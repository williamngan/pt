# Rectangle class is a pair of points
class Rectangle extends Pair

  # ## Create a new Rectangle. A Rectangle is a Pair whose rectangular bounding box are defined by two Vectors. Use `toPointSet()` to convert it to a PointSet with 4 points if you need to rotate or shear it.
  # @param `args` Similar to Pair constructor, use comma-separated values, an array, or an object as parameters to specify the first point. As a shortcut to `to()`, you can also pass 4 or 6 values to set both anchor and `p1` points directly as a 2d or 3d vector.
  # @eg `new Rectangle()` `new Rectangle(1,2,3)` `new Rectangle([2,4])` `new Rectangle({x:3, y:6, z:9}).to(1,2,3)`
  # @return a new Rectangle object
  constructor: () ->
    super

    # ## the center point of rectangle as Vector object
    @center = new Vector()


  # ## A static method `Rectangle.contain` to check if a point is within a bound
  # @param `pt` the Point to check
  # @param `ptl` a Point to specify top-left position of the rectangular bounds
  # @param `pbr`  a Point to specify bottom-right position of the rectangular bounds
  # @return a boolean value indicating if the point is contained within the rectangular bounds
  @contain: (pt, ptl, pbr) ->
    return (pt.x >= ptl.x && pt.x <= pbr.x && pt.y >= ptl.y && pt.y <= pbr.y && pt.z >= ptl.z && pt.z <= pbr.z)


  # ## Describe this rectangle as a text string
  # @return "Rectangle x1, y1, z1, x2, y2, z2, width height" text
  toString : ->
    s = @size()
    "Rectangle x1 #{@x}, y1 #{@y}, z1 #{@z}, x2 #{@p1.x}, y2 #{@p1.y}, z2 #{@p1.z}, width #{s.x}, height #{s.y}"


  # ## Convert this Rectangle from a pair of points to a `PointSet` which has 4 points. Note that if you want to rotate or shear this rectangle, convert this rectangle to a `PointSet` first.
  # @return a PointSet with 4 points. (top-right, bottom-right, bottom-left, top-left)
  toPointSet: () ->
    c = @corners()
    return new PointSet( @ ).to( [c.topRight, c.bottomRight, c.bottomLeft, c.topLeft ] )


  # ## Similar to `Pair`, this function connects the anchor with another point to define the rectangular bounds. This also calls Pair's `resetBounds()` to make sure anchor point is at top-left and `p1` is at bottom-right
  # @param `args` comma-separated values, or an array, or an object
  # @eg `rect.to(1,2,3)` `new Rect(pt).to([3,4])`
  # @return this Rectangle
  to: ( args ) ->
    @p1 = new Vector( Point.get(arguments) )
    @resetBounds()
    @center = @midpoint() # get center point also
    return @


  setCenter: ( args ) ->
    halfsize = @size().$divide(2)
    @center.set( Point.get(arguments) )
    @set( @center.$subtract( halfsize ) )
    @p1.set( @center.$add( halfsize ) )
    return @

  # ## Resize this rectangle by a certain amount from top left
  # @param `args` comma-separated values, or an array, or an object to specify the size change
  # @eg `rect.resizeBy(1,2,3)` `rect.resizeBy( delta_vec )`
  # @return this Rectangle
  resizeBy: ( args ) ->
    size = new Vector( Point.get(arguments) ) # get full size
    @p1.add( size )
    @center = @midpoint()
    return @


  # ## resize this rectangle by a certain amount from center
  # @param `args` comma-separated values, or an array, or an object to specify the size change
  # @eg `rect.resizeCenterBy(1,2,3)` `rect.resizeCenterBy( delta_vec )`
  # @return this Rectangle
  resizeCenterBy: () ->
    size = new Vector( Point.get(arguments) ).divide( 2 ) # get half size
    @subtract( size )
    @p1.add( size )
    return @


  # ## resize to a specific size from top left
  # @param `args` comma-separated values, or an array, or an object to specify the new size
  # @eg `rect.resizeTo(10,10)` `rect.resizeTo( size_vec )`
  # @return this Rectangle
  resizeTo: () ->
    @p1 = new Vector( Point.get(arguments) )
    @relative()
    @center = @midpoint() # get center point also
    return @


  # ## resize to a specific size from center point
  # @param `args` comma-separated values, or an array, or an object to specify the new size
  # @eg `rect.resizeCenterTo(10,10)` `rect.resizeCenterTo( size_vec )`
  # @return this Rectangle
  resizeCenterTo: () ->
    size = new Vector( Point.get(arguments)).divide( 2 ) # get half size
    @set( @center.$subtract(size) )
    @p1.set( @center.$add(size) )
    return @


  # ## resize this rectangle so that it will enclose another rectangle. Namely, the resulting rectangle is a *union* of the two initial rectangles.
  # @param `rect` another Rectangle or Pair object
  # @return this Rectangle which has the new size
  enclose: ( rect ) ->
    @set( @min( rect ) )
    @p1.set( @p1.max( rect.p1 ) )
    @center = @midpoint() # get center point also
    return @


  # ## Same as `enclose()` but returns a new Rectangle
  # @param `rect` another Rectangle or Pair object
  # @return a new Rectangle which has the new size
  $enclose: ( rect ) -> return @clone().enclose( rect )

  # ## Check if this rectangle encloses (or is enclosed by) another rect. Use with `isLarger()` to check which rectangle is being enclosed.
  # @param `rect` another rectangle
  # @return a boolean value to indicate if one rectangle is enclosed by another
  isEnclosed: ( rect ) ->
    d = @$subtract( rect ).multiply( @p1.$subtract( rect.p1 ) )
    d2 = @size().subtract( rect.size() )
    return d.x <= 0 and d.y <= 0 and d.z <= 0 and (d2.x * d2.y >= 0)


  # ## Check if this rectangle is larger than another rectangle
  # @param `rect` another rectangle
  # @return a boolean value to indicate if this rectangle is larger
  isLarger: ( rect ) ->
    s1 = @size()
    s2 = rect.size()
    return s1.x * s1.y > s2.x * s2.y


  # ## Check if a Point is on this Rectangle
  # @param `args` comma-separated values, or an array, or a Point object
  # @eg `rect.intersectPoint(1,2,3)` `rect.intersectPoint(pt)`
  # @return a boolean value to indicate if there is an intersection
  intersectPoint: () ->
    pt = Point.get(arguments)
    return (pt.x >= @x && pt.x <= @p1.x && pt.y >= @y && pt.y <= @p1.y && pt.z >= @z && pt.z <= @p1.z)


  # ## Check intersections between this Rectangle and an infinite Line on xy axis.
  # @param `path` a Pair or Line object to specify an infinite line
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectPath: ( line, get_pts=true ) ->
    sides = @sides()
    pts = []
    for s in sides
      p = line.intersectPath( s )
      if p
        if get_pts
          pts.push( p )
        else
          return true

    return if get_pts then pts else false


  # ## Check intersections between this Rectangle and a Line segment on xy axis.
  # @param `line` a Line to check
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero, one, or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectLine: (line, get_pts=true) ->

    # check if fully enclosed
    ip1 = @intersectPoint( line )
    ip2 = @intersectPoint( line.p1 )
    if ip1 and ip2 then return if get_pts then [] else true

    # bounding box check
    if !(ip1 or ip2)
      lbound = line.bounds()
      if !@intersectRectangle( lbound, false )
        return if get_pts then [] else false

    # check sides
    sides = @sides()
    pts = []
    for s in sides
      p = line.intersectLine( s )
      if p
        if get_pts
          pts.push( p )
        else
          return true

    return if get_pts then pts else false


  # ## Check if this Rectangle intersects with a list of Lines ( useful for polygon or polyline such as `rectangle.sides()` ) on xy axis.
  # @param `lines` an array of Line
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points, or a boolean value. (Based on `get_pts` parameter)
  intersectLines: (lines, get_pts=true) ->
    return Line.intersectLines( @, lines, get_pts )


  # ## Check if this Rectangle intersects with another Rectangle
  # @param `rect` a Rectangle to check
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two or four points), or a boolean value. (Based on `get_pts` parameter)
  intersectRectangle: ( rect, get_pts=true ) ->

    # rectangle intersection check, check for whether it's completely contain
    xi = ( @p1.x >= rect.x ) && ( @x <= rect.p1.x )
    yi = ( @p1.y >= rect.y ) && ( @y <= rect.p1.y )
    zi = ( @p1.z >= rect.z ) && ( @z <= rect.p1.z )
    intersected = (xi && yi && zi)

    if !get_pts then return intersected
    if @isEnclosed( rect ) then return (if get_pts then [] else true )

    if !intersected then return []

    #      pa = new Vector(@max( rect ))
    #      pb = new Vector(@p1.min( rect.p1 ))

    sidesA = @sides()
    sidesB = rect.sides()

    pts = []
    for sa in sidesA
      for sb in sidesB

        p = sa.intersectGridLine( sb )
        if p then pts.push(p)

    return pts



  # ## Check if this Rectangle intersect with another element
  # @param `item` any object that is based on Point. (Vector, Line, Rectangle, Circle, etc)
  # @eg `rect.hasIntersect( another_circle )` `rect.hasIntersect(line)` `rect.hasIntersect(rect)`
  # @returns an Array of intersection points or a boolean value. (Based on `get_pts` parameter)
  hasIntersect: ( item, get_pts=false ) ->

    # circle intersection check
    if item instanceof Circle
      return item.intersectLines( @sides(), get_pts )

    # rectangle bounding box check
    else if item instanceof Rectangle
      return @intersectRectangle( item, get_pts )

    # polygon intersection check
    else if item instanceof PointSet or item instanceof Triangle
      return @intersectLines(item.sides(), get_pts)

    # line intersection check
    else if item instanceof Pair
      return @intersectLine( item, get_pts )

    # point intersection check
    else if item instanceof Point
      return Rectangle.contain( item, @, @p1 )

    else
      return if get_pts then [] else false


  # ## Get the corners of this rectangle as 4 Vectors
  # @return an Object with 4 `Vector` objects as {topLeft, topRight, bottomLeft, bottomRight}
  corners: () -> {
    topLeft: new Vector( Math.min( @x, @p1.x ), Math.min( @y, @p1.y), Math.max( @z, @p1.z) )
    topRight: new Vector( Math.max( @x, @p1.x ), Math.min( @y, @p1.y), Math.min( @z, @p1.z) )
    bottomLeft: new Vector( Math.min( @x, @p1.x ), Math.max( @y, @p1.y), Math.max( @z, @p1.z) )
    bottomRight: new Vector( Math.max( @x, @p1.x ), Math.max( @y, @p1.y), Math.min( @z, @p1.z) )
  }


  # ## Get the sides of this rectangle as 4 lines
  # @return an Array of 4 `Line` objects [top, right, bottom, left]
  sides: () ->
    c = @corners()
    return [
      new Line( c.topLeft ).to( c.topRight )
      new Line( c.topRight ).to( c.bottomRight )
      new Line( c.bottomRight ).to( c.bottomLeft )
      new Line( c.bottomLeft ).to( c.topLeft )
    ]

  # ## Get 4 rectangles from this rectangle by subdividing the quadrants
  # @return an Object with 4 `Rectangle` objects as {topLeft, topRight, bottomLeft, bottomRight}
  quadrants: () ->
    c = @corners()
    return {
      topLeft: new this.__proto__.constructor(  c.topLeft ).to( @center )
      topRight: new this.__proto__.constructor(  c.topRight ).to( @center )
      bottomLeft: new this.__proto__.constructor( c.bottomLeft ).to( @center )
      bottomRight: new this.__proto__.constructor(  c.bottomRight ).to( @center )
    }


  # override clone
  clone: () ->
    p = new Rectangle(@).to(@p1)
    p.to( @p1.clone() )
    return p


# namespace
this.Rectangle = Rectangle