
class PointSet extends Vector

  # ## Create a new PointSet. A PointSet is a set of points which can repsent a polygon or a polyline or a time series.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or an object as parameters to specify the anchor point. Use `to()` to add points to the set.
  # @eg `new PointSet()` `new PointSet(1,2,3)` `new PointSet([2,4])` `new PointSet({x:3, y:6, z:9}).to(1,2,3)` `new PointSet(1,2,3).to([p1, p2, p3, p4, p5])`
  # @return a new PointSet object
  constructor: () ->
    super

    # ## The points in this set as an array
    @points = []


  # ## Describe this rectangle as a text string
  # @return "PointSet [p1... p2... p3...]" text
  toString:() ->
    str = "PointSet [ "
    for p in @points
      str += "#{p.x},#{p.y},#{p.z}, "
    return str+" ]"


  # ## Get a copy of the `points` property as an array
  toArray:() -> @points.slice()


  # ## Add a point or an array of points to this PointSet
  # @param `args` either an Array of Points, or a single point defined by comma-separated values, an array, or an object.
  # @eg `pset.to( 1,2,3 )` `pset.to([1,2,3]` `pset.to({x:3, y:6, z:9})` `pset.to([p1, p2, p3, p4...])`
  # @return this PointSet
  to: ( args ) ->

    if arguments.length > 0
      # if it's an array of objects.
      if Array.isArray( arguments[0] ) and arguments[0].length > 0 and typeof arguments[0][0] is 'object'
        for p in arguments[0]
          @points.push( new Vector(p) )

      else
        @points.push( new Vector( Point.get(arguments ) ) )

    return @


  # ## Add a point whose position is calculated relative to this PointSet's anchor point
  # @param `args` 0-3 comma-separated values, or as an array, or a Point object.
  # @eg `pset.connectFromAnchor(1,2)` `pset.connectFromAnchor([2,4])` `pset.connectFromAnchor({x:3, y:6, z:9})`
  # @return this PointSet
  connectFromAnchor: ( args ) ->

    if arguments.length > 0
      if Array.isArray( arguments[0] ) and arguments[0].length > 0 # if it's Array.
        for p in arguments[0]
          @points.push( @$add(p) )

      else
        @points.push( @$add( Point.get(arguments ) ) )

    return @


  # ## Remove a point or a series of points from this Points set
  # @param `index` an index which can be positive or negative integer. If index is negative, the points are removed from the end. For example, `-2` will remove the last 2 points.
  # @eg `pset.disconnect(3)`, `pset.disconnect(-2)`
  # @return this PointSet
  disconnect: (index=-1) ->
    if index < 0
      @points = @points.slice( 0, @points.length+index )
    else
      @points = @points.slice( index+1 )

    return @

  # ## Add a vector to all the points in the `points` array.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this PointSet
  pointsAdd: (args) ->
    a = @_getArgs( arguments )
    for p in @points
      p.add( a )
    return @


  # ## Same as `pointsAdd()` but returns a new array of the resulting points.
  $pointsAdd: (args) ->
    a = @_getArgs( arguments )
    return (p.$add( a ) for p in @points)


  # ## Subtract a vector from all the points in the `points` array.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this PointSet
  #  pointsSubtract: (args) ->
  #    a = @_getArgs( arguments )
  #    for p in @points
  #      p.subtract( a )
  #    return @


  # ## Same as `pointsSubtract()` but returns a new array of the resulting points.
  #  $pointsSubtract: (args) ->
  #    a = @_getArgs( arguments )
  #    return (p.$subtract( a ) for p in @points)


  # ## Multiply a vector with all the points in the `points` array.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this PointSet
  #  pointsMultiply: (args) ->
  #    a = @_getArgs( arguments )
  #    for p in @points
  #      p.multiply( a )
  #    return @


  # ## Same as `pointsMultiply()` but returns a new array of the resulting points.
  #  $pointsMultiply: (args) ->
  #    a = @_getArgs( arguments )
  #    return (p.$multiply( a ) for p in @points)


  # ## Divide all the points in the `points` array with a vector.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this PointSet
  #  pointsDivide: (args) ->
  #    a = @_getArgs( arguments )
  #    for p in @points
  #      p.divide( a )
  #    return @


  # ## Same as `pointsDivide()` but returns a new array of the resulting points.
  #  $pointsDivide: (args) ->
  #    a = @_getArgs( arguments )
  #    return (p.$divide( a ) for p in @points)


  # ## Get an array of Lines that represents this PointSet's sides
  # @param `close_path` a boolean value to include the side from last point to first point when set to `true`
  # @return an array of Lines
  sides: ( close_path=true ) ->
    lastP = null
    sides = []
    for p in @points
      if lastP then sides.push( new Line(lastP).to(p) )
      lastP = p

    if close_path
      sides.push( new Line( lastP ).to( @points[0] ) )

    return sides

  # ## Get the angles of each vertice connected by 2 sides
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return an array of angles in radian
  angles: ( axis=Const.xy ) ->
    angles = []
    for i in [1...@points.length-1] by 1
      v1 = @points[i-1].$subtract( @points[i] )
      v2 = @points[i+1].$subtract( @points[i] )
      angles.push( { p0: @points[i-1], p1: @points[i], p2: @points[i+1], angle: v1.angleBetween( v2 ) } )

    return angles


  # ## Get the bounding box for this point set.
  # @return a Rectangle which is the bounding box of the PointSet
  bounds: () ->
    Util.boundingBox( @points )


  # ## Get this PointSet's centroid, which is the averge positions of its points.
  # @return the centroid point as Vector
  centroid: () ->
    Util.centroid( @points )


  # ## Get a convex hull of the point set using Melkman's algorithm
  # @param `sort` a boolean value to sort the `points` by x position first if set to true
  # @return an array of Vectors to define the convex hull
  convexHull: ( sort=true ) ->

    if @points.length < 3 then return []

    # sort points array first or not
    if sort
      pts = @points.slice()
      pts.sort( (a, b) -> return a.x - b.x )
    else
      pts = @points

    # if pt is on left of ray ab. Similar to Pari.collinear()
    left = (a, b, pt) ->
      (b.x - a.x) * (pt.y - a.y) - (pt.x - a.x) * (b.y - a.y) > 0

    # double end queue
    dq = []

    # first 3 points
    if left( pts[0], pts[1], pts[2])
      dq.push( pts[0] )
      dq.push( pts[1] )
    else
      dq.push( pts[1] )
      dq.push( pts[0] )

    dq.unshift( pts[2] )
    dq.push( pts[2] )

    # remaining points
    i = 3
    while i < pts.length
      pt = pts[i]

      if left( pt, dq[0], dq[1] ) and left(dq[dq.length-2], dq[dq.length-1], pt)
        i++
        continue

      while !left(dq[dq.length-2], dq[dq.length-1], pt)
        dq.pop()
      dq.push( pt )

      while !left( dq[0], dq[1], pt)
        dq.shift()
      dq.unshift( pt )

      i++

    # returns the hull's points
    return dq


  # overrides clone
  clone: () ->
    new PointSet(@).to( Util.clonePoints( @points ) )


# namespace
this.PointSet = PointSet