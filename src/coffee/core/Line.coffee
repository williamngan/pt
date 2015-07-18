# ### Line element
class Line extends Pair

  # ## Create a new Line. A Line is a Pair defined by two vectors. It can be treated as an infinite line, or as a line segment with two end points.
  # @param `args` Similar to Pair constructor, use comma-separated values, an array, or an object as parameters to specify the first point. As a shortcut to `connect()`, you can also pass 4 or 6 values to set both anchor and `p1` points directly as a 2d or 3d vector.
  # @eg `new Line()` `new Line(1,2,3)` `new Line([2,4])` `new Line({x:3, y:6, z:9}).connect(1,2,3)`
  # @return a new Pair object
  constructor: () ->
    super


  # ## a static function `Line.slope` to find the slope between two points
  # @param `a` a Point
  # @param `b` another Point
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @eg `Line.slope(pt1, pt2)`, `Line.slope(pt1, pt2, Const.yz)`
  # @return slope value, or false if it divides by 0 (a vertical line)
  @slope: ( a, b, axis=Const.xy ) ->
    p1 = a.get2D( axis )
    p2 = b.get2D( axis )
    return if (p2.x - p1.x is 0) then false else (p2.y - p1.y) / (p2.x - p1.x)


  # ## a static function `Line.intercept` to get x and y intercept
  # @param `a` a Point
  # @param `b` another Point
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @eg `Line.intercept(pt1, pt2)`, `Line.intercept(pt1, pt2, Const.yz)`
  # return: an Object with {xi, yi, slope} properties, or false if it divides by 0 (a vertical line)
  @intercept: ( a, b, axis=Const.xy ) ->
    p1 = a.get2D( axis )
    p2 = b.get2D( axis )
    if p2.x - p1.x is 0
      return false
    else
      # y = mx + c
      m = ((p2.y - p1.y) / (p2.x - p1.x)) # slope
      c = p1.y - m * p1.x
      return { slope: m, yi: c, xi: if m==0 then false else -c/m } #[ -c/m, c, m ]


  # ##  a static function `Line.isPerpendicularLine` to check if two lines are perpendicular to each other
  # @param `line1` a Line
  # @param `line2` another Line
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @eg `Line.isPerpendicularLine(ln1, ln2)`, `Line.isPerpendicularLine(ln1, ln2, Const.yz)`
  # return a boolean value where `true` means the two lines are perpendicular
  @isPerpendicularLine: (line1, line2, axis=Const.xy) ->
    s1 = Line.slope( line1, line1.p1, axis )
    s2 = Line.slope( line2, line2.p1, axis )
    if s1 is false
      return (s2 is 0)
    else if s2 is false
      return (s1 is 0)
    else
      return (s1*s2 is -1)


  # ## Get slope of this line
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return slope value, or false if it divides by 0 (a vertical line)
  slope: ( axis=Const.xy ) -> Line.slope( @, @p1, axis )


  # ## Get intercepts and slop of this line
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # return: an Object with {xi, yi, slope} properties, or false if it divides by 0 (a vertical line)
  intercept: ( axis=Const.xy ) -> Line.intercept( @, @p1, axis )


  # ## Given an interpolated point on this line, return another line of specific length that is perpendicular to this line.
  # @param `t` a value between 0 to 1 to interpolate a point on this line
  # @param `len` an optional value to specify a length for the new line. Defaults to 10.
  # @param `reverse` a boolean value to reverse the direction of the new line if set to `true`
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @eg `ln.getPerpendicular(0.5)`, `ln.getPerpendicular(0.2, 100, true, Const.yz)`
  # @return a new Line that's perpendicular to this line
  getPerpendicular: ( t, len=10, reverse=false, axis=Const.xy ) ->
    pn = @direction().normalize().perpendicular( axis ) # get normal vector
    pp = if reverse then pn[1] else pn[0] # from which side of the dividing line
    line = new Line( @interpolate( t ) ) # the start-point in the new line
    line.connect( pp.multiply(len).add( line ) ) # connect the end point
    return line

  # ## Find the shortest distance from a point to this line (as infinite line, not line segment)
  # @param `pt` a Point
  # return the distance, which can be positive or negative value depending on the point's position.
  getDistanceFromPoint: ( pt ) ->
    path = @$subtract( @p1 )
    normal = new Vector( -path.y, path.x ).normalize()
    return @$subtract( pt ).dot( normal )


  # ## Find the perpendicular vector from this line to the point. You can connect the resulting vector with the point's position to draw a perpendicular line
  # @param `pt` a Point
  # @param `fromProjection` a boolean value defaults to true. If true, the resulting vector is based on this line's position. Otherwise the vector starts from origin (0,0).
  # @return a perpendicular Vector
  getPerpendicularFromPoint: ( pt, fromProjection=true ) ->
    proj = @p1.$subtract(@).projection( pt.$subtract(@) )
    return if !fromProjection then proj else proj.add(@)


  # ## Get intersection point of this line and another line (as infinite lines, not line segements)
  # @param `line` another Line
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return an intersection point as Vector, or `false` if no intersection, or `null` if two lines are identical
  intersectPath: ( line, axis=Const.xy ) ->

    a = @intercept( axis )
    b = line.intercept( axis )

    p = @get2D( axis )
    ln = line.get2D( axis )

    if a == false
      if b == false then return false # no solution
      # one of them is vertical line, while the other is not, so they will intersect
      y1 = -b.slope *  (ln.x - p.x) + ln.y # -slope * p.x + p.y
      return if axis == Const.xy then new Vector( p.x, y1 ) else new Vector( p.x, y1 ).get2D( axis, true )

    else
      # diff slope, or b slope is vertical line
      if b == false
        y1 = -a.slope *  (p.x - ln.x) + p.y # -slope * p.x + p.y
        return new Vector( ln.x, y1 )

      else if b.slope != a.slope
        px = (a.slope * p.x - b.slope * ln.x + ln.y - p.y) / (a.slope - b.slope)
        py = a.slope * ( px - p.x ) + p.y
        if axis == Const.xy
          return new Vector( px, py )
        else
          return new Vector( px, py ).get2D( axis, true ) # flip back to intended axis

      else
        if a.yi == b.yi # exactly along the same path
          return null
        else
          return false


  # ## Get intersection point of this line segement and another line segement (not infintie lines)
  # @param `line` another Line
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return an intersection point as Vector, or `false` if no intersection, or `null` if two lines are identical
  intersectLine: (line, axis=Const.xy) ->
    # get point from intersectPath()
    pt = @intersectPath( line, axis )

    # check line segment intersection
    if pt and @withinBounds( pt, axis ) and line.withinBounds( pt, axis )
      return pt
    else
      return if pt == null then null else false


  # ## A static function `Line.intersectLines` if an element intersects with a list of lines ( useful for polygon or polyline such as `rectangle.sides()` ) on xy axis.
  # @param `lines` an array of Line
  # @get_pts `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @eg `Line.intersectLines( rect, triangle.sides() )` `Line.intersectLines( line, pointset.sides(), true )`
  # @returns an Array of intersection points, or a boolean value. (Based on `get_pts` parameter)
  @intersectLines: (elem, lines, get_pts=true) ->
    if !elem.intersectLine
      throw "No intersectLine function found in "+ elem.toString()

    pts = []
    # check each line
    for i, ln of lines
      ins = elem.intersectLine(ln, get_pts)

      # store intersection points
      if ins
        if !get_pts then return true
        if ins.length > 0
          for p in ins
            pts.push( p )

    return if get_pts then pts else false


  # ## Get intersection point of between two "grid" lines. Grid lines are parallel to an axis, such as a horizontal or vertical line on xy plane.
  # @param `line` another Line which is parallen to an axis
  # @param `path_only` a boolean value to specify whether to check for whole path (`true`) or line segment (`false`). Defaults to `false`.
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return an intersection point as Vector, or `false` if no intersection
  intersectGridLine: (line, path_only=false, axis=Const.xy ) ->
    a1 = @get2D( axis )
    a2 = @p1.get2D( axis )

    b1 = line.get2D( axis )
    b2 = line.p1.get2D( axis )

    if a2.x - a1.x == 0
      if b2.y - b1.y == 0 and Util.within( a1.x, b1.x, b2.x )
        if path_only or Util.within( b1.y, a1.y, a2.y )
          return new Vector( a1.x, b1.y )

    else if a2.y - a1.y == 0
      if b2.x - b1.x == 0 and Util.within( a1.y, b1.y, b2.y )
        if path_only or Util.within( b1.x, a1.x, a2.x )
          return new Vector( b1.x, a1.y )

    else
      return false


  # ## Get a list of evenly distributed points on this line
  # @param `num` the number of points to get
  # @return an Array of Points
  subpoints: (num) -> (@interpolate t/num for t in [0..num] )


  # ## override clone
  clone: (deep) ->
    return new Line(@).connect(@p1)


# namespace
this.Line = Line



# Old code -- Use Matrix transform functions instead

# Rotate this line from a hinged point along the line
# param: t is between 0 to 1, radian is the rotation
# see also Matrix.rotateAnchor2D
#  rotate: (t, radian, axis=Const.xy) ->
#    # get anchor point
#    anchor = @interpolate( t )
#    # get init angle
#    ang = anchor.angle( axis, @ ) + radian
#
#    # find rotated line's points
#    pa = new Vector( Math.cos( ang ), Math.sin( ang ) )
#
#    if axis is Const.yz
#      pb = new Vector( 0, -pa.y, -pa.z )
#    else if axis is Const.xz
#      pb = new Vector( -pa.x, 0, -pa.z )
#    else
#      pb = new Vector( -pa.x, -pa.y, 0 )
#
#    pa.multiply( anchor.$subtract( @ ).magnitude() )
#    pa.add( anchor )
#
#    pb.multiply( @p1.$subtract( anchor ).magnitude() )
#    pb.add( anchor )
#
#    # set the points to new position
#    @set( pa )
#    @p1.set( pb )
#
#    return @


# Reflect a point to the other side of this line
# see also Vector.reflect2D and Matrix.reflectAnchor2D
#  reflect: (point, axis=Const.xy) ->
#    ln = @intercept( axis )
#    p = point.get2D( axis )
#    d = ( p.x + (p.y-ln.yi) * ln.slope ) / (1+ ln.slope*ln.slope)
#    ref = {
#      x: 2*d - p.x,
#      y: 2*d*ln.slope - p.y + 2*ln.yi
#    }
#
#    if axis == Const.xz
#      return new Vector( ref.x, point.y, ref.y )
#    else if axis == Const.yz
#      return new Vector( point.x, ref.x, ref.y )
#    else
#      return new Vector( ref.x, ref.y, point.z )