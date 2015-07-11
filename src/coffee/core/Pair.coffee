# ### A Pair of Vector
class Pair extends Vector

  # ## Create a new Pair. A Pair is a Vector which defines its anchor point, and connected to another Vector through the `connect()` function.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or an object as parameters to specify the first point. As a shortcut to `connect()`, you can also pass 4 or 6 values to set both anchor and `p1` points directly as a 2d or 3d vector.
  # @eg `new Pair()` `new Pair(1,2,3)` `new Pair([2,4])` `new Pair({x:3, y:6, z:9}).connect(1,2,3)`, `new Pair(10,10, 20,20)`
  # @return a new Pair object
  constructor: () ->
    super

    # ## A vector object which is other point in this pair.
    @p1 = new Vector( @x, @y, @z )

    if arguments.length == 4
      @z = 0
      @p1.set( arguments[2], arguments[3] )
    else if arguments.length == 6
      @p1.set( arguments[3], arguments[4], arguments[5] )


  # ## connect the other point
  # @param `args` comma-separated values, or an array, or an object
  # @eg `pair.connect(1,2,3)` `new Pair(1,2).connect(3,4)`
  # @return this Pair
  connect: () ->
    @p1 = new Vector( Point.get(arguments) )
    return @

  # ## Update p1's new position by recalculating it as a relative position to the anchor point
  # @return this Pair
  relative: () ->
    @p1.add( @ )
    return @

  # ## Return a new vector of p1's new position, by recalculating it as a relative position to the anchor point
  # @return a new Vector
  $relative: () -> @$add( @p1 )


  # ## Add a vector to both points in this `Pair`. Same as `Pair.moveBy`.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this `Pair`
  pointsAdd: (args) ->
    a = @_getArgs( arguments )
    @add( a )
    @p1.add( a )
    return @


  # ## Same as `pointsAdd()` but returns a new `Pair`
  $pointsAdd: (args) ->
    a = @_getArgs( arguments )
    return new this.__proto__.constructor( @.$add( a ) ).connect( @p1.$add( a ) )


  # ## Subtract a vector from both points in this `Pair`. Same as `Pair.moveBy`.
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this `Pair`
  pointsSubtract: (args) ->
    a = @_getArgs( arguments )
    @subtract( a )
    @p1.subtract( a )
    return @


  # ## Same as `pointsSubtract()` but returns a new `Pair`
  $pointsSubtract: (args) ->
    a = @_getArgs( arguments )
    return new this.__proto__.constructor( @.$subtract( a ) ).connect( @p1.$subtract( a ) )


  # ## Multiply a vector with both points in this `Pair`. Same as `Pair.scale2D` with anchor at (0,0).
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this `Pair`
  pointsMultiply: (args) ->
    a = @_getArgs( arguments )
    @multiply( a )
    @p1.multiply( a )
    return @


  # ## Same as `pointsMultiply()` but returns a new `Pair`
  $pointsMultiply: (args) ->
    a = @_getArgs( arguments )
    return new this.__proto__.constructor( @.$multiply( a ) ).connect( @p1.$multiply( a ) )


  # ## Divide with both points in this `Pair` with a vector. Same as `Pair.scale2D` with anchor at (0,0).
  # @param `args` comma-separated values, or as an array, or a Point object.
  # @return this `Pair`
  pointsDivide: (args) ->
    a = @_getArgs( arguments )
    @divide( a )
    @p1.divide( a )
    return @


  # ## Same as `pointsDivide()` but returns a new `Pair`
  $pointsDivide: (args) ->
    a = @_getArgs( arguments )
    return new this.__proto__.constructor( @.$divide( a ) ).connect( @p1.$divide( a ) )


  # ## Get a new pair that's the bounding box of this pair. This is the same as calculating its top-left (min) and bottom-right (max) points.
  # @return a new Pair
  bounds: () ->
    return new Pair( @min(@p1) ).connect( @max(@p1) )

  # ## Check if a point is within the bounds of this pair
  # @param `pt` a Point object to check.
  # @param `axis` optional axis id such as Const.xy.
  # @eg `pair.withinBounds( point )`, `pair.withinBounds( point, Const.yz )`
  # @return a boolean value where `true` means the point is within bounds.
  withinBounds: ( pt, axis ) ->
    if axis
      a = @get2D( axis )
      b = @p1.get2D( axis )

      # simplify checking for horizontal and vertical lines, and avoid rounding errors
      if a.x == b.x
        return pt.y >= Math.min(a.y, b.y) and pt.y <= Math.max(a.y, b.y)
      else if a.y == b.y
        return pt.x >= Math.min(a.x, b.x) and pt.x <= Math.max(a.x, b.x)

      # bounding box check
      else
        return ( pt.x >= Math.min(a.x, b.x) and pt.y >= Math.min(a.y, b.y) and pt.x <= Math.max(a.x, b.x) and pt.y <= Math.max(a.y, b.y) )
    else
      return ( pt.x >= Math.min( @x, @p1.x) and pt.y >= Math.min(@y, @p1.y) and pt.z >= Math.min(@z, @p1.z) and pt.x <= Math.max(@x, @p1.x) and pt.y <= Math.max(@y, @p1.y) and pt.z <= Math.max(@z, @p1.z) )

  # ## Interpolate to find a point which lies somewhere on a straight path between the two points of this pair
  # @param `t` a value between 0 to 1.
  # @param `relative` an optional boolean value. If `true`, then `this.p1` will be treated as relative to the achor point. Default is `false`.
  # @eg `pair.interpolate(0.4)` `pair.interpolate(0.1, true)`
  # @return the interpolated point as Vector
  interpolate: ( t, relative=false ) ->
    p2 = if relative then @$relative() else @p1

    return new Vector(
      (1-t) * @x + t * p2.x
      (1-t) * @y + t * p2.y
      (1-t) * @z + t * p2.z
    )

  # ## A convenient method to get the midpoint of this pair of points. Same as @interpolate( 0.5 )
  # @return the middle point as Vector
  midpoint: () -> @interpolate( 0.5 )

  # ## Get a vector which points to the same direction as this pair, but starts at origin (0,0)
  # @param `reverse` optional parameter to reverse the direction if set to `true`. Default is `false`.
  # @eg `pair.direction()`, `pair.direction(false)`, `pair.direction().normalize()`
  # @return the directional vector
  direction: ( reverse ) ->
    return if reverse then @.$subtract( @p1 ) else @p1.$subtract( @ )


  # ## Set or get width and height of this pair
  # @param `args` Optional parameter to set the size of this Pair. Can be comma-separated values, or as an array, or a Point object.
  # @eg `pair.size()`, `pair.size(100, 50)`
  # @return When setting a new size, returns self. When getting size, returns a Vector whose x is the width and y is the height.
  size: () ->
    if arguments.length > 0
      @p1 = @.$add( Point.get(arguments) )
      return @
    else
      return @p1.$subtract( @ ).abs()

  # ## Find distance of this pair from anchor to p1
  # @param: `sqrt` optional boolean value to get distance-squared value if set to `false`. Default is true.
  # @return distance value
  length: ( sqrt = true ) ->
    dz = @z - @p1.z
    dy = @y - @p1.y;
    dx = @x - @p1.x;
    d = dx*dx + dy*dy + dz*dz
    return if sqrt then Math.sqrt( d ) else d


  # ## Check if a point lies on the left or right side of this pair's *ray*, and if the 3 points are collinear
  # @param `point` a Point object to check against this pair.
  # @return a value where 0 means collinear, poitive value means the point lies on left, and negative value means it's on right
  collinear: (point) ->
    return (@p1.x - @x) * (point.y - @y) - (point.x - @x) * (@p1.y - @y)

  # ## Recalculate the origin and vec so that origin is at top-left and vec is at bottom-right
  # @return this Pair
  resetBounds: () ->
    temp = @min( @p1 )
    @p1.set( @max( @p1 ) )
    @set( temp )
    return @

  # ## override equal() from parent class
  equal: (epsilon=false) ->
    if arguments[0] instanceof Pair
      return super( arguments[0] ) and @p1.equal( arguments[0].p1 )
    else
      super

  # ## Override clone() from parent class
  clone: () ->
    p = new Pair( @ )
    p.connect( @p1.clone() )
    return p

  # ## Override floor() from parent class
  floor: () ->
    super
    @p1.floor()

  # ## Describe this Pair as a text string
  # @return "Pair of vectors from ... to ..." text
  toString: () -> "Pair of vectors from (#{ @x }, #{ @y }, #{ @z }) to (#{ @p1.x }, #{ @p1.y }, #{ @p1.z })"

  # ## Override toArray() include `p1` in the array.
  toArray: () -> [@, @p1]


# namespace
this.Pair = Pair