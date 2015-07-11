# ### Vector element
class Vector extends Point

  # ## Create a new Vector. A Vector extends a Point and includes functions for arithmetics.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or a Point object as parameters.
  # @eg `new Vector()` `new Vector(1,2,3)` `new Vector([2,4])` `new Vector({x:3, y:6, z:9})`
  # @return a new Vector object
  constructor: () ->
    super

  # private function to get arguments based on argument types
  _getArgs: (args) -> return if typeof args[0] is 'number' and args.length > 1 then args else args[0]

  # ## Add another vector to this vector.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @eg `vec.add(1,2)` `vec.add([2,4])` `vec.add({x:3, y:6, z:9})`
  # @return this Vector
  add: (args) ->
    # add scalar
    if typeof arguments[0] is 'number' and arguments.length is 1
      @x += arguments[0]
      @y += arguments[0]
      @z += arguments[0]
      # add point
    else
      _p = Point.get(arguments)
      @x += _p.x
      @y += _p.y
      @z += _p.z

    return @


  # ## Same as `add()` but returns a new Vector. The values of this vector are not changed.
  $add: (args) ->
    a = @_getArgs( arguments )
    new Vector( @ ).add( a )


  # ## Subtract another vector from this vector.
  # @param `args` 0-3 comma-separated values, or as an array, or a Point object.
  # @eg `vec.subtract(1,2)` `vec.subtract([2,4])` `vec.subtract({x:3, y:6, z:9})`
  # @return this Vector
  subtract: (args) ->
    # subtract scalar
    if typeof arguments[0] is 'number' and arguments.length is 1
      @x -= arguments[0]
      @y -= arguments[0]
      @z -= arguments[0]
      # subtract point
    else
      _p = Point.get(arguments)
      @x -= _p.x
      @y -= _p.y
      @z -= _p.z

    return @

  # ## Same as `subtract()` but returns a new Vector. The values of this vector are not changed.
  $subtract: (args) ->
    a = @_getArgs( arguments )
    return new Vector( @ ).subtract( a )


  # ## Multiple this vector with a scalar or vector. If there's only one numberic value in the parameter, this vector will be multiplied by that scalar value. Otherwise, this vector's x,y,z values will be multiplied by the corresponding x,y,z in the parameters. Note that this is different to .dot and .cross products.
  # @param `args` 0-3 comma-separated values, or as an array, or a Point object.
  # @eg `vec.multiply(4)` `vec.multiply(1,2,3)` `vec.multiply([2,4])` `vec.multiply({x:3, y:6, z:9})`
  # @return this Vector
  multiply: (args) ->
    # multiply scalar
    if typeof arguments[0] is 'number' and arguments.length is 1
      @x *= arguments[0]
      @y *= arguments[0]
      @z *= arguments[0]
      # multiply point
    else
      _p = Point.get(arguments)
      @x *= _p.x
      @y *= _p.y
      @z *= _p.z

    return @

  # ## Same as `multiply()` but returns a new Vector. The values of this vector is not changed.
  $multiply: (args) ->
    a = arg = @_getArgs( arguments )
    return new Vector( @ ).multiply( a )


  # ## Similar as `multiply()` but easier to read semantically.
  # @eg `vec.divide(2,4,5)` is the same as `vec.multiply(0.5, 0.25, 0.2)`
  # @return this Vector
  divide: (args) ->
    # divide scalar
    if typeof arguments[0] is 'number' and arguments.length is 1
      @x /= arguments[0]
      @y /= arguments[0]
      @z /= arguments[0]
      # divide point
    else
      _p = Point.get(arguments)
      @x /= _p.x
      @y /= _p.y
      @z /= _p.z

    return @

  # ## Same as `divide()` but returns a new Vector. The values of this vector is not changed.
  $divide: (args) ->
    a = @_getArgs( arguments )
    return new Vector( @ ).divide( a )


  # ## Get the angle of this vector on a plane. Or get the angle from this vector to another point. If no parameter specified, this will return the angle on xy plane.
  # @param `axis` single argument as optional axis id (eg, `Const.yz`) to specify a plane
  # @param `pt` single argument as optional Point object to calculate the angle from this Point to another Point instead
  # @param `axis, pt` 2 arguments in this sequence, as optional axis id and Point object to get the angle to a Point on a specific plane
  # @eg `vec.angle()` `vec.angle(Const.yz)` `vec.angle(another_pt)` `vec.angle(Const.xz, another_pt)` `new Vector(1,1).angle( new Vector(1,2) ) * Const.rad_to_deg = 90`
  # @return a radian value
  angle: (args) ->

    # no argument angle from origin
    if arguments.length is 0
      return Math.atan2( @y, @x )

    # if first argument is axis
    if typeof arguments[0] is 'string'
      axis = arguments[0]
      p = if arguments.length > 1 then @$subtract( arguments[1] ).multiply(-1) else undefined

    # first argument is object or none
    else
      p = @$subtract( arguments[0]).multiply(-1)
      axis = false

    # if has point and no axis, find xy to another point
    if p and !axis
      return Math.atan2( p.y, p.x )

      # has axis parameter
    else if axis is Const.xy
      return if p then Math.atan2( p.y, p.x ) else (Math.atan2( @y, @x ))

    else if axis is Const.yz
      return if p then Math.atan2( p.z, p.y ) else (Math.atan2( @z, @y ))

    else if axis is Const.xz
      return if p then Math.atan2( p.z, p.x ) else (Math.atan2( @z, @x ))


  # ## Get the change in radian between this and another vector (at origin position)
  # @param `vec` another Vector to compare against
  # @param axis optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.angleBetween( another_pt )` `vec.angleBetween( another_pt, Const.yz )`
  angleBetween: (vec, axis=Const.xy) ->
    Util.boundRadian( @angle( axis ), true ) - Util.boundRadian( vec.angle( axis ), true )


  # ## Get the mangnitude (ie, distance from origin) of this vector. Or get the distance from this vector to another point. Default is to get the magnitude on xyz plane.
  # @param `axis` single argument as optional axis id (eg, `Const.yz`) to specify a plane
  # @param `pt` single argument as optional Point object to calculate the distance from this Point to another Point instead
  # @param `sqrt` single argument as optional boolean value to get distance-squared value if set to `false`. Default is true.
  # @param `axis, pt, sqrt` 3 optional parameters can be used in this sequence to specify a plane, a Point, and whether to get squared value.
  # @eg `vec.magnitude()` `vec.magnitude(false)` `vec.magnitude(Const.yz)` `vec.magnitude(another_pt)` `vec.magnitude(Const.xz, another_pt, false)`.
  # @return magnitude value
  magnitude: (args) ->

    m = {x:@x*@x, y:@y*@y, z:@z*@z }

    # if last argument is false, then don't use Math.sqrt
    useSq = (arguments.length >= 1 and !arguments[ arguments.length-1 ])
    _sq = if useSq then ( (x) -> x ) else Math.sqrt

    # no argument angle from origin
    if arguments.length is 0
      return _sq( m.x + m.y + m.z )

    # if first argument is axis
    if typeof arguments[0] is 'string'
      axis = arguments[0]
      if arguments.length > 1 and arguments[1]
        p = @$subtract( arguments[1] )
      else
        p = undefined

      # first argument is object or none
    else
      p = @$subtract( arguments[0] )
      axis = false

    mag = if p then {x:p.x*p.x, y:p.y*p.y, z:p.z*p.z} else m

    # if has point and no axis, find xyz to another point
    if p and !axis
      return _sq( mag.x + mag.y + mag.z )

    # has axis parameter
    else if axis is Const.xy
      return _sq( mag.x + mag.y )

    else if axis is Const.yz
      return _sq( mag.y + mag.z )

    else if axis is Const.xz
        return _sq( mag.x + mag.z )


  # ## Get the distance between this and another point. An alias of magnitude.
  # @param `pt` another point
  # @param `axis` optional axis id (eg, `Const.yz`) to specify a plane
  # @return distance
  distance: (pt, axis=Const.xy) -> @magnitude( axis, pt )

  # ## Normalize this vector to a unit vector, which has magnitude of 1.
  # @return this vector
  normalize: () ->
    @set( @$normalize() )
    return @


  # ## Get a normalized unit vector which has magnitude of 1. The original vector is not changed.
  # @return a new unit vector
  $normalize: () ->
    m = @magnitude()

    if m is 0
      return new Vector()
    else
      return new Vector( @x/m, @y/m, @z/m )

  # ## Set this vector's values to its absolute value (always positive).
  # @return this vector
  abs: () ->
    @x = Math.abs(@x)
    @y = Math.abs(@y)
    @z = Math.abs(@z)
    return @


  # ## Calculate the [dot product](http://en.wikipedia.org/wiki/Dot_product) of this and another vector.
  # @param `p` a Point to calculate the dot product
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.dot( another_vec )`, `vec.dot( another_vec, Const.xz )`
  # @return the dot product which is a scalar (numeric) value
  dot: ( p, axis=Const.xyz ) ->
    if axis == Const.xyz
      return @x*p.x + @y*p.y + @z*p.z
    else if axis == Const.xy
      return @x*p.x + @y*p.y
    else if axis == Const.yz
      return @y*p.y + @z*p.z
    else if axis == Const.xz
      return @x*p.x + @z*p.z
    else
      return @x*p.x + @y*p.y + @z*p.z

  # ## Calculate [vector projection](http://en.wikipedia.org/wiki/Vector_projection). A vector projection that has the same direction as this vector but a different length. So if you draw a line from the projection vector to the vector specified in the parameter, it will be perpendicular to this vector.
  # @param `vec` a Vector to calculate the projection
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.projection( another_vec)`, , `vec.projection( another_vec, Const.xz )`
  # @return the vector projection
  projection: ( vec, axis=Const.xyz ) ->
    m = vec.magnitude()
    a = @$normalize()
    b = new Vector( vec.x/m, vec.y/m, vec.z/m )
    dot = a.dot( b, axis )
    return a.$multiply( m * dot )

  # ## Calculate the [cross product](http://en.wikipedia.org/wiki/Cross_product) of this and another vector.
  # @param `p` a Point to calculate the cross product
  # @eg `vec.cross( another_vec )`
  # @return the cross product which is a vector
  cross: ( p ) ->
    new Vector( (@y*p.z - @z*p.y), (@z*p.x - @x*p.z), (@x*p.y - @y*p.x) )


  # ## Get the middle vector between this and another vector
  # @param `vec` a Vector to calculate the bisect
  # @eg `vec.bisect( another_vec )`
  # @return a vector in the middle
  bisect: ( vec, isNormalized=false ) ->
    if isNormalized
      return @$add(vec).divide(2)
    else
      return @$normalize().add( vec.$normalize() ).divide(2)


  # ## Get 2 vectors that are perpendicular to this vector
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.perpendicular()` `vec.perpendicular(Const.yz)`
  # @return an array of two vectors
  perpendicular: ( axis=Const.xy ) ->
      switch axis
        when Const.xy then return [new Vector( -@y, @x, @z ), new Vector( @y, -@x, @z )]
        when Const.yz then return [new Vector( @x, -@z, @y ), new Vector( @x, @z, -@y )]
        when Const.xz then return [new Vector( -@z, @y, @x ), new Vector( @z, -@y, @x )]
        else return [new Vector( -@y, @x, @z ), new Vector( @y, -@x, @z )]

  # ## Check if another vector is perpendicular to this
  # @param `p` a Point to check against
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.isPerpendicular( another_vec )` `vec.isPerpendicular( another_vec, Const.yz )`
  # @return a boolean (true or false)
  isPerpendicular: ( p, axis=Const.xyz ) -> @dot(p, axis) == 0

  # ## Get surface normal vector. A [normal](http://en.wikipedia.org/wiki/Normal_%28geometry%29) is a vector perpendicular to a plane or object.
  # @param `p` a Point to calculate the surface normal
  # @eg `vec.surfaceNormal( another_vec )`
  # @return the normal vector
  surfaceNormal: ( p ) ->
    return @cross( p ).normalize(true)


  # ## move origin to a new position. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will move all the points.
  # @param `args` new position as 0-3 comma-separated values, or as an array, or a Point object.
  moveTo: ( args ) ->
    target = Point.get(arguments)
    d = @$subtract( target )
    pts = @toArray()
    for p in pts
      p.subtract( d )

    return @

  # ## move origin by a certain amount. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will move all the points.
  # @param `args` move amount as 0-3 comma-separated values, or as an array, or a Point object.
  moveBy: ( args ) ->
    inc = Point.get(arguments)
    pts = @toArray()
    for p in pts
      p.add( inc )

    return @


  # ## Rotate this vector around an anchor point on a 2D plane. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will rotate all the points.
  # @param `radian` a radian value specifying the angle. (where 1 degree = PI / 180 radian)
  # @param `anchor` a Point object specifying the anchor position
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.rotate2D( Math.PI/2, anchor_pt )` `vec.rotate2D( 30*Const.deg_to_rad, another_pt, Const.xz )`
  # @return this vector
  rotate2D: (radian, anchor, axis=Const.xy) ->
    if !anchor then anchor = new Point(0,0,0)
    mx = Matrix.rotateAnchor2D( radian, anchor, axis )

    pts = @toArray()
    for p in pts
      Matrix.transform2D( p, mx, axis )

    return @


  # ## Reflect this vector along a path. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will reflect all the points.
  # @param `line` a Line object to specify the path
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.reflect2D( line )` `vec.reflect2D( line, Const.xz )`
  # @return this vector
  reflect2D: (line, axis=Const.xy) ->
    mx = Matrix.reflectAnchor2D( line, axis )
    pts = @toArray()
    for p in pts
      Matrix.transform2D( p, mx, axis )

    return @


  # ## Rescale this vector from an anchor point. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will scale all the points together.
  # @param `sx` x scale value, where 1 = no change
  # @param `sy` y scale value, where 1 = no change
  # @param `anchor` a Point object specifying the anchor position to scale from
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.scale2D( 0.7, 1.2, anchor_pt )` `vec.scale2D( 1, 3, anchor_pt, Const.xz )`
  # @return this vector
  scale2D: (sx, sy, anchor, axis=Const.xy) ->
    if !anchor then anchor = new Point(0,0,0)
    mx = Matrix.scaleAnchor2D( sx, sy, anchor, axis )
    pts = @toArray()
    for p in pts
      Matrix.transform2D( p, mx, axis )

    return @


  # ## Shear this vector from an anchor point. In subclasses of `Vector`, such as `Pair` or `PointSet`, this will shear all the points together.
  # @param `sx` x scale value, where 1 = no change
  # @param `sy` y scale value, where 1 = no change
  # @param `anchor` a Point object specifying the anchor position to scale from
  # @param `axis` optional axis id (eg `Const.xy`) to specify a plane
  # @eg `vec.scale2D( 0.7, 1.2, anchor_pt )` `vec.scale2D( 1, 3, anchor_pt, Const.xz )`
  # @return this vector
  shear2D: (sx, sy, anchor, axis=Const.xy) ->
    if !anchor then anchor = new Point(0,0,0)
    mx = Matrix.shearAnchor2D( sx, sy, anchor, axis )
    pts = @toArray()
    for p in pts
      Matrix.transform2D( p, mx, axis )

    return @

  # ## Clone this vector
  # @return a new vector identical to this vector
  clone: () -> return new Vector(@)


  # ## Describe this point as a text string
  # @return "Vector x, y, z" text
  toString: () -> "Vector #{ @x }, #{ @y }, #{ @z }"

  # ## Put this vector into an array
  # @return an array with a single point object
  toArray: () -> [@]


# namespace
this.Vector = Vector
