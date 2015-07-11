# ### A circle
class Circle extends Vector

  # ## Create a new Circle. A Circle is a Vector which defines its center position, with a `radius` property to define its radius.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or a Point object as parameters to specify the center of circle. Optionally include a 4th parameter to set the radius directly, or use `setRadius()` afterwards.
  # @eg `new Circle()` `new Circle(1,2,3)` `new Circle(1,2,3,100)`
  # @return a new Circle object
  constructor: () ->
    super

    # ## the radius property
    @radius = if arguments[3]? then arguments[3] else 0 # radius as 4th argument

  # ## set radius of the circle
  # @param `r` radius value
  # @return this Circle
  setRadius: ( r ) ->
    @radius = r
    return @


  # ## Check if a point is on this Circle on xy axis.
  # @param `args` comma-separated values, or an array, or a Point object
  # @eg `circle.intersectPoint(1,2,3)` `circle.intersectPoint(pt)`
  # @return a boolean value to indicate if there is an intersection
  intersectPoint: (args) ->
    item = new Vector( Point.get(arguments) )
    d = item.$subtract( @ )
    return (d.x * d.x + d.y * d.y <  @radius * @radius )


  # ## Check intersections between this Circle and an infinite Line on xy axis. Based on [this algorithm](http://stackoverflow.com/questions/13053061/circle-line-intersection-points).
  # @param `path` a Pair or Line object to specify an infinite line
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero, one, or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectPath: ( path, get_pts=true ) ->
    if not path instanceof Pair then return false

    d = path.direction()
    f = @.$subtract( path )

    a = d.dot(d, Const.xy)
    b = f.dot(d, Const.xy)
    c = f.dot(f, Const.xy) - ( @radius * @radius )
    p = b / a
    q = c / a
    disc = p * p - q # discriminant

    if disc < 0
      return (if get_pts then [] else false)
    else
      if !get_pts then return true

      discSqrt = Math.sqrt( disc )
      t1 = -p + discSqrt
      t2 = -p - discSqrt

      p1 = new Point( path.x - d.x * t1, path.y - d.y * t1 )
      p2 = new Point( path.x - d.x * t2, path.y - d.y * t2 )

      return if disc == 0 then [p1] else [p1, p2]


#    a = d.x * d.x + d.y * d.y
#    b = d.x * f.x + d.y * f.y
#    c = ( f.x * f.x + f.y * f.y ) - ( @radius * @radius )
#    p = b / a
#    q = c / a
#    disc = p * p - q
#
#    if disc < 0
#      return []
#    else
#      discSqrt = Math.sqrt( disc )
#      t1 = -p + discSqrt
#      t2 = -p - discSqrt
#
#      p1 = new Point( ray.x - d.x * t1, ray.y - d.y * t1 )
#      p2 = new Point( ray.x - d.x * t2, ray.y - d.y * t2 )
#
#      return if disc == 0 then [p1] else [p1, p2]


  # ## Check intersections between this Circle and a Line segment on xy axis.
  # @param `line` a Pair or Line object to specify a line segment
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero, one, or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectLine: ( line, get_pts=true ) ->

    # check ray
    pts = @intersectPath( line )
    if pts and pts.length > 0

      # check intersected point is within line bounding box
      pi = []
      bounds = line.bounds()
      for p in pts
        if Rectangle.contain( p, bounds, bounds.p1 )
          if !get_pts then return true
          pi.push( p )

      return (if get_pts then pi else (pi.length>0) )
    else
      return (if get_pts then [] else false)


  # ## Check if this cirlce intersects with a set of lines ( useful for polygon or polyline such as `rectangle.sides()` ) on xy axis.
  # @param `lines` an array of Line
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @eg `circle.intersectLines( rect.sides() )` `circle.intersectLines( pointset.sides(), true )`
  # @returns an Array of intersection points, or a boolean value. (Based on `get_pts` parameter)
  intersectLines: (lines, get_pts=true) ->
    return Line.intersectLines( @, lines, get_pts )


  # ## Check if this circle intersects with another circle
  # @param `circle` another Circle
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two points) or a boolean value, based on `get_pts` parameter.
  intersectCircle: (circle, get_pts=true) ->
    dv = circle.$subtract( @ )
    dr2 = dv.magnitude(false)
    dr = Math.sqrt( dr2 )

    ca_r2 = @radius * @radius
    cb_r2 = circle.radius * circle.radius

    if dr > @radius + circle.radius # not intersected
      return (if get_pts then [] else false)

    else if dr < Math.abs( @radius - circle.radius ) # completely enclosing the other, no intersecting points
      return (if get_pts then [ new Vector(this), new Vector(circle) ] else true)

    else # has two intersection points
      if !get_pts then return true

      a = (ca_r2 - cb_r2 + dr2) / (2*dr)
      h = Math.sqrt( ca_r2 - a*a )
      p = dv.$multiply(a/dr).add(@)

      return [
        new Vector( (p.x + h*dv.y/dr), (p.y - h*dv.x/dr) )
        new Vector( (p.x - h*dv.y/dr), (p.y + h*dv.x/dr) )
      ]


  # ## Check if this cirlce intersect with another element on xy axis
  # @param `item` any object that is based on Point. (Vector, Line, Rectangle, Circle, etc)
  # @eg `circle.hasIntersect( another_circle )` `circle.hasIntersect(line)` `circle.hasIntersect(rect)`
  # @returns an Array of intersection points or a boolean value. (Based on `get_pts` parameter)
  hasIntersect: (item, get_pts=false) ->

    # circle intersection check
    if item instanceof Circle
      return @intersectCircle( item, get_pts )

    # polygon intersection check (TODO any better algorithm?)
    else if item instanceof Rectangle or item instanceof PointSet or item instanceof Triangle
      return @intersectLines(item.sides(), get_pts)

    # line intersection check
    else if item instanceof Pair
      ins = @intersectLine(item)
      return if !get_pts then (ins.length > 0) else ins

    # point intersection check
    else if item instanceof Point
      d = item.$subtract( @ )
      return (d.x * d.x + d.y * d.y < @radius * @radius)

    else
      return if get_pts then [] else false


# namespace
this.Circle = Circle