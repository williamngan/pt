
class Triangle extends Vector

  # ## Create a new triangle
  # @param Set the triangle's anchor point using 0 to 3 values. Can be comma-separated values, as an array, or as an object with `{x, y, z}` properties.
  # @eg `new Triangle()` `new Triangle(1,2,3)` `new Triangle([2,4])` `new Triangle({x:3, y:6, z:9})`
  # @return a new Triangle object
  constructor: () ->
    super

    # ## a vertice (corner point) of the triangle as Vector object
    @p1 = new Vector( @x-1, @y-1, @z)

    # ## another vertice (corner point) of the triangle as Vector object
    @p2 = new Vector( @x+1, @y+1, @z)


  # ## Connect triangle's anchor point with the other two points
  # @param Parameters can be 2 objects or 2 arrays, or 4 or 6 numeric values to specify x, y, and optionally z positions
  # @eg `tri.connect( p1, p2)` `tri.connect([1,2], [3,4]` `tri.connect(1,2,3,4)` `tri.connect(1,3,5,2,4,6)`
  # @return this triangle
  connect:( args ) ->

    if arguments.length > 0

      # by object or array
      if typeof arguments[0] is 'object' and arguments.length == 2
          @p1.set( arguments[0] )
          @p2.set( arguments[1] )

      # by 4 or 6 numeric values
      else
        if arguments.length < 6
          @p1.set( [arguments[0], arguments[1]] )
          @p2.set( [arguments[2], arguments[3]] )
        else
          @p1.set( [arguments[0], arguments[1], arguments[2]] )
          @p2.set( [arguments[3], arguments[4], arguments[5]] )

    return @


  # ## Convert this triangle's points to an array of Vectors
  # @return an array of 3 vectors
  toArray: () -> [@, @p1, @p2 ]


  # ## Get a text string that describes this triangle
  toString:() -> "Triangle (#{@x}, #{@y}, #{@z}), (#{@p1.x}, #{@p1.y}, #{@p1.z}), (#{@p2.x}, #{@p2.y}, #{@p2.z})"


  # ## Convert this Triangle to a `PointSet`
  # @return a PointSet with 3 points.
  toPointSet: () ->
    p0 = new Vector(@)
    return new PointSet( p0 ).connect( [p0, @p1, @p2 ] )


  # ## Get an array of Lines that represents this triangle's 3 sides
  # @return an array of 3 lines
  sides: () ->
    return [
      new Line(@).connect(@p1)
      new Line(@p1).connect(@p2)
      new Line(@p2).connect(@)
    ]


  # ## Get the triangle's 3 angles
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return an array of 3 angles
  angles: ( axis=Const.xy ) ->
    angles = [
      @p2.$subtract( @ ).angleBetween( @p1.$subtract( @ ), axis )
      @$subtract( @p1 ).angleBetween( @p2.$subtract( @p1 ), axis )
    ]
    angles.push( Math.PI - angles[0] - angles[1] )
    return angles


  # ## Get the medial, which is an inner triangle formed by connecting the midpoints of this triangle's sides
  # @return the medial triangle
  medial: () ->
    sides = @sides()
    pts = ( side.midpoint() for side in sides )
    return new Triangle( pts[0] ).connect( pts[1], pts[2] )


  # ## Get this triangle's perimeter, which is the length of its 3 sides
  # @return an object with 3 properties, where `.value` is the perimeter value, `.sides` is an array of 3 sides, `lengths` is an array of the 3 sides' lengths
  perimeter: () ->
    sides = @sides()
    lens = [
      sides[0].length()
      sides[1].length()
      sides[2].length()
    ]
    return {
      sides: sides
      value: lens[0] + lens[1] + lens[2]
      lengths: lens
    }


  # ## Get this triangle's area using Heron's formula for calculating polygon area
  # @return an object with 2 properties, where `.value` is the area value, and `.perimeter` is an object returned by `perimeter()` function
  area: () ->
    p = @perimeter()
    hp = p.value / 2
    return {
      value: Math.sqrt( (hp * (hp-p.lengths[0]) * (hp-p.lengths[1]) * (hp-p.lengths[2]) ))
      perimeter: p
    }


  # ## Given a point of the triangle, the opposite side is the side which the point doesn't touch
  # @param specify a point by its id `"p0"` (the anchor point), `"p1"`, or `"p2"`
  # @eg `tri.oppositeSide("p1")`
  # @return a Line which represents the opposite side
  oppositeSide: ( id ) ->
    if id=="p1"
      return new Line(@).connect(@p2)
    else if id == "p2"
      return new Line(@).connect(@p1)
    else
      return new Line(@p1).connect(@p2)


  # ## Given a point of the triangle, the adjacent sides are the two side which the point touches
  # @param specify a point by its id `"p0"` (the anchor point), `"p1"`, or `"p2"`
  # @eg `tri.adjacentSides("p1")`
  # @return an array of 2 Line which represents the adjacent sides
  adjacentSides: (id) ->
    if id=="p1"
      return [new Line(@p1).connect(@), new Line(@p1).connect(@p2)]
    else if id == "p2"
      return [new Line(@p2).connect(@), new Line(@p2).connect(@p1)]
    else
      return [new Line(@).connect(@p1), new Line(@).connect(@p2)]


  # ## Get a bisector, which is a path that splits a triangle's angle in half.
  # @param the first paramter specifies a point by its id `"p0"`, `"p1"`, or `"p2"`. The second parameter determines if the path should be a simple vector from origin (`false`) or a line connected to the triangle's point (`true`). Optionally include a third parameter to set the length of the path.
  # @eg `tri.bisector("p1")`, `tri.bisector("p0", true)`, `tri.bisector("p2", false, 10)`
  # @return either a Line or a Vector, based on the second parameter
  bisector: (id, asLine=false, size=100) ->
    ad = @adjacentSides(id)
    p = new Vector(ad[0])
    ad[0].moveTo(0,0)
    ad[1].moveTo(0,0)
    bp = ad[0].p1.bisect(ad[1].p1) # bisect vector from origin

    return if asLine then new Line(p).connect( bp.multiply(size).add(p) ) else bp


  # ## Get a triangle's altitude, which is a line from a triangle's point to its opposite side, and perpendicular to its opposite side.
  # @param specify a point by its id `"p0"` (the anchor point), `"p1"`, or `"p2"`
  # @eg `tri.altitude("p1")` gets a line from p1 to the side formed by p0 and p2
  # @return a Line representing an altitude
  altitude: ( id ) ->
    if id=="p1" or id=="p2"
      return new Line(@[id]).connect( @oppositeSide(id).getPerpendicularFromPoint( @[id] ) )
    else
      return new Line(@).connect( @oppositeSide().getPerpendicularFromPoint( @ ) )


  # ## Get a triangle's centroid, which is the averge positions of its three points.
  # @return the centroid point as Vector
  centroid : () ->
    c0 = @$divide(3)
    c1 = @p1.$divide(3)
    c2 = @p2.$divide(3)
    return new Vector(c0.x+c1.x+c2.x, c0.y+c1.y+c2.y, c0.z+c1.z+c2.z)


  # ## Get orthocenter, which is the intersection point of a triangle's 3 altitudes (the 3 lines that are perpendicular to its 3 opposite sides).
  # @return the orthocenter point as Vector
  orthocenter: () ->
    a = @altitude()
    b = @altitude("p1")
    return a.intersectPath( b, Const.xyz )

  # ## Get incenter, which is the center point of its inner circle, and also the intersection point of its 3 angle bisector lines (each of which cuts one of the 3 angles in half).
  # @return the incenter point as Vector
  incenter: () ->
    a = @bisector("p0", true)
    b = @bisector("p1", true)
    return a.intersectPath( b, Const.xyz )

  # ## Get an interior circle, which is the largest circle completed enclosed by this triangle
  # @return a Circle
  incircle: () ->
    center = @incenter()
    area = @area()
    radius = 2 * area.value / area.perimeter.value
    return new Circle(center).setRadius( radius )

  # ## Get circumcenter, which is the intersection point of its 3 perpendicular bisectors lines ( each of which divides a side in half and is perpendicular to the side)
  # @return the circumcenter point as Vector
  circumcenter: () ->
    medial = @medial()

    # find perpendicular bisectors
    pbs = [
      new Line( medial ).connect( @.$subtract( medial ).perpendicular()[0].$add(medial) )
      new Line( medial.p1 ).connect( @p1.$subtract( medial.p1 ).perpendicular()[0].$add(medial.p1) )
      new Line( medial.p2 ).connect( @p2.$subtract( medial.p2 ).perpendicular()[0].$add(medial.p2) )
    ]

    return {
      center: pbs[0].intersectPath( pbs[1], Const.xyz )
      bisectors: pbs
    }

  # ## Get circumcircle, which is the smaller circle that encloses this triangle completely
  # @return a Circle
  circumcircle: () ->
    center = @circumcenter()
    r = @magnitude( center.center )
    return new Circle( center.center ).setRadius( r )


  intersectPoint: (p) ->
    sides = @sides()
    hp = ( s.collinear(p) > 0 for s in sides ) # check left or right sides of the half plane
    return hp[0] == hp[1] and hp[1] == hp[2]


  # ## Check intersections between this Triangle and an infinite Line on xy axis.
  # @param `path` a Pair or Line object to specify an infinite line
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectPath: (path, get_pts=true, axis=Const.xy) ->
    sides = @sides()
    pts = []
    for s in sides
      p = s.intersectPath( path )
      if p and s.withinBounds( p, axis )
        if !get_pts then return true
        pts.push( p )

    return if get_pts then pts else false


  # ## Check intersections between this Triangle and a Line segment on xy axis.
  # @param `line` a Line to check
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero, one, or two points), or a boolean value. (Based on `get_pts` parameter)
  intersectLine: (line, get_pts=true, axis=Const.xy) ->
    ins = @intersectPath( line, true, axis )
    pts = []
    for p in ins
      if line.withinBounds( p )
        if !get_pts then return true
        pts.push( p )

    return if get_pts then pts else false


  # ## Check if this Triangle intersects with a set of Lines on xy axis
  # @param `lines` an array of Line
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points, or a boolean value. (Based on `get_pts` parameter)
  intersectLines: (lines, get_pts=true) ->
    return Line.intersectLines( @, lines, get_pts )


  # ## Moller-Trumbore algorithm for 3D ray triangle intersection
  intersectPath3D: (path, get_pts) ->
    e1 = @p1.$subtract(@)
    e2 = @p2.$subtract(@)
    dir = path.direction().normalize()

    pvec = dir.cross(e2)
    det = e1.dot(pvec)

    # 3D only, in 2D the det is always 0
    if (det > -Const.epsilon and det < Const.epsilon ) then return false

    inv_det = 1 / det

    tvec = path.$subtract(@)
    u = tvec.dot(pvec) * inv_det
    if (u < 0 or u > 1) then return false

    qvec = tvec.cross( e1 )
    v = dir.dot(qvec) * inv_det
    if (v < 0 or v > 1) then return false

    t = e2.dot( qvec ) * inv_det
    if t > Const.epsilon
      return if get_pts then [u,v,t] else true
    else
      return false


  # ## Check if this Triangle intersects with a Rectangle
  # @param `rect` a Rectangle to check
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two or four points), or a boolean value. (Based on `get_pts` parameter)
  intersectRectangle: (rect, get_pts=true) ->
    return rect.intersectLines( @sides(), get_pts )


  # ## Check if this Triangle intersects with another Circle
  # @param `circle` a Circle to check
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two or four points), or a boolean value. (Based on `get_pts` parameter)
  intersectCircle: (circle, get_pts=true) ->
    return circle.intersectLines( @sides(), get_pts )


  # ## Check if this Triangle intersects with another Triangle
  # @param `tri` a Triangle to check
  # @param `get_pts` a boolean value to specify whether the results should include the intersection points. If `false`, then only the intersection state (true or false) will be returned.
  # @returns an Array of intersection points (zero or two or four points), or a boolean value. (Based on `get_pts` parameter)
  intersectTriangle: (tri, get_pts=true) ->
    return tri.intersectLines( @sides(), get_pts )


  # overrides clone
  clone: () -> new Triangle(@).connect( @p1, @p2 )


# namespace
this.Triangle = Triangle

