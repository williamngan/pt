# ### A point is the smallest thing in a space. It defines a static position, an indivisible abstraction, and a creative beginning. Think of a point not as a dot, but as a potentiality, visible only to the mind's squinted eyes.
class Point

  # ## Create a new point using optional parameters which can be a list of numeric values, or an array, or an object with x,y,z properties. If no parameter is specified, this will return a Point at (0,0,0) position.
  # @param `args(x,y,z)` optional comma separated values to specify x, y, and z position
  # @param `args([x,y,z])` optional array with 1 to 3 values to specify x, y, and z position
  # @param `args(pt)` an optional object with `{x, y, z}` properties.
  # @eg `new Point()` `new Point(1,2,3)` `new Point([2,4])` `new Point({x:3, y:6, z:9})`
  # @return a new Point object
  constructor: (args) ->

    # parse arguments and copy to this.x,y,z
    @copy( Point.get(arguments) )


  # ## A static function `Point.get()` which converts arrays or objects to an object with `{x, y, z}` properties.
  # @param `args` Similar to Point constructor, this accepts optional parameters which can be comma-separated values, or an array, or any object.
  # @eg `Point.get([2,4])` `Point.get({x:3, y:6, z:9})`
  # @return an Object with {x, y, z} properties
  @get : ( args ) ->

    if args.length > 0

      if typeof args[0] is 'object'

        # if it's Array or arguments (object with length property). Note that "arguments" is not considered as an Array by javascript.
        if args[0] instanceof Array or args[0].length > 0

          return {
            x: args[0][0] || 0
            y: args[0][1] || 0
            z: args[0][2] || 0
          }

          # Point object
        else
          return {
            x: args[0].x || 0
            y: args[0].y || 0
            z: args[0].z || 0
          }

        # multiple args for x, y, z
      else

        return {
        x: args[0] || 0
        y: args[1] || 0
        z: args[2] || 0
        }

    else
      # no argument return empty point
      return { x: 0, y: 0, z: 0 }


  # ## Given another point in relation to this point, this returns which side or quadrant the other point is at. Possible
  # @param `pt` a Point object
  # @param `epsilon` an optional value to specify the minimum distance threshold. Default is Const.epsilon.
  # @eg `p.quadrant( another_p )` `p.quadrant( another_p, 2 )`
  # @demo point.quadrant
  # @return a constant value such as Const.identical, Const.bottom, Const.top_right
  quadrant: (pt, epsilon=Const.epsilon) ->

    if pt.near(@) then return Const.identical

    if (Math.abs(pt.x-@x) < epsilon)
      return if pt.y < @y then Const.top else Const.bottom

    if (Math.abs(pt.y-@y) < epsilon)
      return if pt.x < @x then Const.left else Const.right

    if (pt.y < @y && pt.x > @x)
      return Const.top_right
    else if (pt.y < @y && pt.x < @x)
      return Const.top_left
    else if (pt.y > @y && pt.x < @x)
      return Const.bottom_left
    else
      return Const.bottom_right


  # ## Set position of this point
  # @param `args` comma-separated values, as an array, or as a Point object.
  # @eg Eg, `p.set( x, y )` or `p.set( {x, y, z} )` or  `p.set( [x, y, z] )`
  # @return this Point
  set: (args) ->
    p = Point.get(arguments)

    # ## property for x position
    @x = p.x

    # ## property for y position
    @y = p.y

    # ## propoerty for z position
    @z = p.z
    return @


  # ## Copy another point object to this point. Slightly faster than `set()`
  # @param `p` a Point object to copy
  # @return this Point
  copy: (p) ->
    @x = p.x
    @y = p.y
    @z = p.z
    return @


  # ## Clone this point
  # @return a new Point that is identical to this point
  clone: () -> return new Point( @ )


  # ## Describe this point as a text string
  # @return "Point x, y, z" text
  toString: () -> "Point #{ @x }, #{ @y }, #{ @z }"

  # ## Put this vector into an array
  # @return an array with a single point object
  toArray: () -> [@]



  # ## When a point has 3 dimensions `(x,y,z)`, this function converts it to a new point `(x,y)` of a specific 2D plane (such as `yz`)
  # @param `axis` an axis id such as `Const.yz`.
  # @param `reverse` optional boolean value. If `true`, the mapping will be flipped. Default is false.
  # @eg `p.get2D( Const.xy )` `p.get2D(Const.yz, true)`
  # @return a new 2D Point
  get2D: (axis, reverse=false) ->

    if axis == Const.xy then return new this.__proto__.constructor( @ )
    if axis == Const.xz then return new this.__proto__.constructor( @x, @z, @y ) # same flip in reverse
    if axis == Const.yz
      if reverse
        return new this.__proto__.constructor( @z, @x, @y )
      else
        return new this.__proto__.constructor( @y, @z, @x )

    return new this.__proto__.constructor( @ )



  # ## Evaluate the minimum x,y,z of this point and another point, and get a minimum Point
  # @param `args` comma-separated values, as an array, or as a Point object.
  # @eg `p.min(1,2)` `p.min( another_p )`
  # @return this Point
  min: (args) ->
    _p = Point.get(arguments)
    @x = Math.min(@x, _p.x)
    @y = Math.min(@y, _p.y)
    @z = Math.min(@z, _p.z)
    return @


  # ## Similar to `min()` but returns a new instance
  $min: (args) ->
    _p = Point.get(arguments)
    return new this.__proto__.constructor( Math.min(@x, _p.x), Math.min(@y, _p.y), Math.min(@z, _p.z) )


  # ## Evaluate the minimum x,y,z of this point and another point, and get a maximum Point
  # @param `args` comma-separated values, as an array, or as a Point object.
  # @eg `p.max(1,2)` `p.max( another_p )`
  # @demo point.max
  # @return this Point
  max: (args) ->
    _p = Point.get(arguments)
    @x = Math.max(@x, _p.x)
    @y = Math.max(@y, _p.y)
    @z = Math.max(@z, _p.z)
    return @


  # ## Similar to `max()` but returns a new instance
  $max: (args) ->
    _p = Point.get(arguments)
    return new this.__proto__.constructor( Math.max(@x, _p.x), Math.max(@y, _p.y), Math.max(@z, _p.z) )


  # ## Check if this point is at exactly the same position as the other point
  # @param `args` comma-separated values, as an array, or as a Point object.
  # @eg `p.equal(1,2)` `p.equal( another_p )`
  # @return boolean, true if they are equal
  equal: (args) ->
    _p = Point.get(arguments)
    return  (_p.x == @x) and (_p.y == @y) and (_p.z == @z)


  # ## Check if this point is at exactly the same position as the other point
  # @param `pt` a Point to check against
  # @param `epsilon` an optional threshold value indicating the minimum distance that's near enough
  # @eg `p.near(another_p)` `p.near( another_p, 2 )` `p.near( Point.get(1,2,3) )`
  # @return boolean, true if they are near
  near: ( pt, epsilon=Const.epsilon) ->
    _p = Point.get(arguments)
    return (Math.abs(_p.x-@x) < epsilon) and (Math.abs(_p.y-@y) < epsilon) and (Math.abs(_p.z-@z) < epsilon)


  # ## Snap this point's position to the nearest integer by its floor
  # @return this Point
  floor: () ->
    @x = Math.floor( @x )
    @y = Math.floor( @y )
    @z = Math.floor( @z )
    return @


  # ## Snap this point's position to the nearest integer by its ceiling
  # @return this Point
  ceil: () ->
    @x = Math.ceil( @x )
    @y = Math.ceil( @y )
    @z = Math.ceil( @z )
    return @


# namespace
this.Point = Point
