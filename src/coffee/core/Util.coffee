# ### A collection of static methods and helper classes to get things done.
class Util

  # ## A static function to convert degrees to radian
  # @param `degree` angle in degrees. ie, 180 degrees = Math.PI radian
  @toRadian : ( angle ) -> angle * Const.deg_to_rad


  # ## A static function to convert radian to degrees
  # @param `radian` angle in radian. ie, Math.PI radian = 180 degrees
  @toDegree : ( radian ) -> radian * Const.rad_to_deg


  # ## A static function to convert a color value (0-255) to hex "FF". See also `Color.hex()` and `Color.rgba()`
  # @param `number` a value between 0 to 255
  # @return a string with 2 hex digits, such as "FF" or "00"
  @toHexColor: (number) ->
    h = Math.floor(number).toString(16)
    return if h.length is 1 then "0"+h else h


  # ## A static function to convert a hex string to rgb value or string. See also `Color.parseHex()`
  # @param hexString hex string such as "FF9900" or "#FF9900"
  # @param asRGBA a boolean value to set if the return value should be `rgba(...)` string
  # @param opacity optional opacity value between 0 to 1 for `rgba(...)` output
  # @eg `Util.toRGBColor("")`
  @toRGBColor: (hexString, asRGBA=false, opacity=1) ->
    if hexString[0] == "#" then hexString = hexString.substr(1)

    if hexString.length == 3
      r = parseInt( hexString[0]+hexString[0], 16 )
      g = parseInt( hexString[1]+hexString[1], 16 )
      b = parseInt( hexString[2]+hexString[2], 16 )
    else if hexString.length >= 6
      r = parseInt( hexString[0]+hexString[1], 16 )
      g = parseInt( hexString[2]+hexString[3], 16 )
      b = parseInt( hexString[4]+hexString[5], 16 )
    else
      r = 0
      g = 0
      b = 0

    return if asRGBA then "rgba(#{r},#{g},#{b},#{opacity})" else [r,g,b,opacity]


  # ## A static function to limit a value (such as an angle, can be negative) as the modulus between 0 to max, or between -max/2 to max/2
  # @param `val` the value to be bound
  # @param `max` maximum value as boundary
  # @param `positive` a boolean value. If set to `true`, the return value will be between 0 to max; if `false`, return value will be between -max/2 to max/2. Default is `false`.
  # @return a value either (0 to max) or (-max/2 to max/2)
  @bound : ( val, max, positive=false ) ->
    a = val % max
    half = max / 2

    if a>half
      a -= max
    else if a < -half
      a += max

    if positive
      if a<0 then return a+max else return a
    else
      return a


  # ## A static function to limit an angle
  # @param `ang` an angle to be bound
  # @param `positive` a boolean value. If set to `true`, the return value will be between 0 to max; if `false`, return value will be between -max/2 to max/2. Default is `false`.
  # @return an angle either between 0 to 360, or between -180 to 180 degrees
  @boundAngle : ( ang, positive ) ->
    Util.bound( ang, 360, positive)


  # ## A static function similar to `Util.boundAngle` but limit a radian angle between 0 to 2*PI, or between -PI to PI
  @boundRadian : ( radian, positive ) ->
    Util.bound( radian, Const.two_pi, positive )


  # ## A static function to get a bounding box for a list of points
  # @param `points` an array of points
  # @param `is3D` a boolean value to specify if the points are 3D. Default is false which means the points are 2D.
  # @return an Rectangle object as bounding box
  @boundingBox: ( points, is3D=false ) ->
    minPt = new Point( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    maxPt = new Point( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    for p in points
      if p.x < minPt.x then minPt.x = p.x
      if p.y < minPt.y then minPt.y = p.y
      if p.x > maxPt.x then maxPt.x = p.x
      if p.y > maxPt.y then maxPt.y = p.y

      if is3D
        if p.z < minPt.z then minPt.z = p.z
        if p.z > maxPt.z then maxPt.z = p.z

    return new Rectangle( minPt ).to( maxPt )


  # ## A static function to get linear interpolation between two values
  # @param `a, b` first and second values
  # @param `t` a value between 0 to 1
  # return the interpolated value
  @lerp: ( a, b, t ) -> return (1-t) * a + t * b


  # ## Get a centroid point which is the averge positions of a list of points.
  # @param `points` an array of points
  # @return the centroid point as Vector
  @centroid: (points) ->
      c = new Vector()
      for p in points
        c.add( p )
      return c.divide( points.length )


  # ## Check if two numbers are equal within a threshold
  # @param `a, b` two numbers to compare
  # @param `threshold` the smallest difference allowed to be considered as same. Default is `Const.epsilon`.
  # @return a boolean value where `true` means they are the same
  @same : (a, b, threshold=Const.epsilon ) ->
    ( Math.abs( a - b ) < threshold )


  # ## Check is a number is within the range of two number
  # @param `p` the number to check
  # @param `a, b` two numbers to set the range
  # @return a boolean value where `true` means the number is within range
  @within: ( p, a, b) ->
    return p >= Math.min(a, b) and p <= Math.max(a, b)


  # ## Get a random value in between a range
  # @param `a, b` two numbers to set a range. `b` is optional and defaults to 0.
  # @return a random number within the range
  @randomRange : (a, b=0) ->
    r = if a > b then ( a - b ) else ( b - a )
    return a + Math.random() * r


  # ## Simple mixin implementataion
  # @param `klass` the class to inject
  # @param `mix` is the source mixin object
  # @return the klass with mixin
  @mixin : ( klass, mix ) ->
    for k,v of mix
      if mix.hasOwnProperty( k )
        klass.prototype[k] = mix[k]
    return klass


  # ## A helper function to extend a class
  # @param `klass` constructor function
  # @param `parent` class to inherit
  # @eg `function V() { Vector.call(this, arguments); }; Util.extend(V, Vector);`
  # @return the extended class
  @extend: (klass, parent) ->
    klass.prototype = Object.create(parent.prototype)
    klass.prototype.constructor = klass
    return klass


  # ## Given an array of Points (eg, in results of toArray() ), return an array of the points as copy
  @clonePoints: (array) -> ( p.clone() for p in array )


  # ## Rotate from an origin using canvas rendering context
  # @param `ctx` canvas rendering context
  # @param `bound` the bounding box as Rectangle object
  # @param `radian` the angle in radian to rotate
  # @param `origin` an optional Point object to specify the anchor point of rotation. If origin is false or not set, the anchor is at the center of the `bound` bounding box
  # @param `mask` an optional Rectangle object as mask
  @contextRotateOrigin : (ctx, bound, radian, origin=false, mask) ->

    size =  bound.size()

    if !origin
      origin = size.$multiply(0.5)
      origin.add(bound)

    if mask
      msz = mask.size()
      Form.rect(ctx, mask)
      ctx.clip()

    ctx.translate( origin.x, origin.y )
    ctx.rotate( radian )
    ctx.translate( -origin.x, -origin.y)


  # ## A static function to pre-calculate a sine and cosine table. To use this, convert radian to angle as an integer, and then get table index by finding modulus `angle%360`
  # @return an object with `{sin, cos}` properties.
  @sinCosTable: () ->
    cos = []
    sin = []
    for i in [0..360] by 1
        cos[i] = Math.cos( i * Math.PI / 180 )
        sin[i] = Math.sin( i * Math.PI / 180 )
    return {sin: sin, cos: cos}


  # ## A static function which check if a random number from 0 to 1 is smaller than a user defined number
  # @param `p` a value between 0 to 1
  # @return a boolean value where true means a random number is smaller than the supplied parameter
  @chance: (p) -> return (Math.random() < p);


  # ## A static function to calculate Gaussian curve
  @gaussian: (x, mean=0, sigma=1) ->
    x = (x - mean) / sigma
    return Const.gaussian * Math.exp( -0.5 * x * x) / sigma


  # ## Map a value from one range to another
  # @param `n` a value in the first range
  # @param `min1` lower bound of the first range
  # @param `max1` upper bound of the first range
  # @param `min2` lower bound of the second range
  # @param `max2` upper bound of the second range
  # @return a remapped value in the second range
  @mapToRange: (n, min1, max1, min2, max2) ->
    if (min1 == max1) then throw "[min1, max1] must be a non-degenerate interval (that is, min1 != max1)"
    return ( (n - min1) / (max1 - min1) ) * (max2 - min2) + min2;


# namespace
this.Util = Util;
