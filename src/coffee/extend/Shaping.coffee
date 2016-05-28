# ### Shaping functions.
class Shaping extends Vector

  constructor: ( args ) ->
    super


  # ## Quadratic, in based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @quadraticIn: ( t, c=1 ) ->
    return c * t * t


  # ## Quadratic out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @quadraticOut: ( t, c=1 ) ->
    return -c * t * (t-2)


  # ## Quadratic in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @quadraticInOut: (t, c=1) ->
    dt = t * 2
    return if (t<0.5) then c/2 * t * t * 4 else -c/2 * ((dt-1) * (dt-3) - 1)


  # ## Cubic in, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @cubicIn: ( t, c=1 ) ->
    return c * t * t * t


  # ## Cubic out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @cubicOut: ( t, c=1 ) ->
    dt = t - 1
    return c * ( dt * dt * dt + 1)

  # ## Cubic in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @cubicInOut: (t, c=1) ->
    dt = t * 2
    return if (t<0.5) then c/2 * dt * dt * dt else c/2 * ((dt-2) * (dt-2) * (dt-2) + 2)

  # ## Sinuous in, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @sineIn: (t, c=1) ->
    return -c * Math.cos(t * Const.half_pi) + c


  # ## Sinuous out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @sineOut: (t, c=1) ->
    return c * Math.sin(t * Const.half_pi)


  # ## Sinuous in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @sineInOut: (t, c=1) ->
    return -c/2 * (Math.cos(Math.PI*t) - 1)


  # ## Circular in, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @circularIn: (t, c=1) ->
    return -c * (Math.sqrt(1 - t*t) - 1)


  # ## Circular out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @circularOut: (t, c=1) ->
    dt = t-1
    return c * Math.sqrt(1 - dt*dt)


  # ## Circular in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @circularInOut: (t, c=1) ->
    dt = t*2
    return if (t<0.5) then -c/2 * (Math.sqrt(1 - dt*dt) - 1) else c/2 * (Math.sqrt(1 - (dt-2)*(dt-2)) + 1)


  # ## Elastic in, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  # @param `c` the value to shape, default is 1
  @elasticIn: (t, p=0.5, c=1) ->
    dt = t - 1
    s = (p / Const.two_pi) * 1.5707963267948966
    return -c * Math.pow(2, 10 * dt) * Math.sin((dt * c - s) * Const.two_pi / p)


  # ## Elastic out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  # @param `c` the value to shape, default is 1
  @elasticOut: (t, p=0.5, c=1) ->
    s = (p / Const.two_pi) * 1.5707963267948966
    return c * Math.pow(2, -10 * t) * Math.sin((t * c - s) * Const.two_pi / p) + c


  # ## Elastic in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  # @param `c` the value to shape, default is 1
  @elasticInOut: (t, p=0.5, c=1) ->
    dt = t*2
    s = (p / Const.two_pi) * 1.5707963267948966
    if (t<0.5)
      dt -= 1
      return -c/2 * ( Math.pow(2, 10 * dt) * Math.sin((dt * c - s) * Const.two_pi / p))
    else
      dt -= 1
      return c/2 * ( Math.pow(2, -10 * dt) * Math.sin(( dt * c - s) * Const.two_pi / p)) + c


  # ## Bounce in, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @bounceIn: (t, c=1) ->
    return c - Shaping.bounceOut((1-t), c)


  # ## Bounce out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @bounceOut: (t, c=1) ->
    if t < (1 / 2.75)
      return c * (7.5625 * t * t)
    else if t < (2 / 2.75)
      t -= 1.5/2.75
      return c * (7.5625 * t * t + 0.75)
    else if t < (2.5 / 2.75)
      t -= 2.25 / 2.75
      return c * (7.5625 * t * t + 0.9375)
    else
      t -= 2.625 / 2.75
      return c * (7.5625 * t * t + 0.984375)


  # ## Bounce in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  @bounceInOut: (t, c=1) ->
    return if (t<0.5) then Shaping.bounceIn( t*2, c ) / 2 else Shaping.bounceOut( t*2 - 1, c) / 2 + c/2
    
  # ---

  # ## Sigmoid curve changes its shape based on the input value, but always returns a value between 0 to 1.
  # @param `t` a value between 0 to 1
  # @param `c` the larger the value, the "steeper" the curve will be. Default is 8
  @sigmoid: (t, c=8) ->
    d = c*(t-0.5)
    return 1 / (1 + Math.exp( d*-1 ) )


  # ## Step function is a simple jump from 0 to 1 at a specific point in time
  # @param `t` a value between 0 to 1
  # @param `c` usually a value between 0 to 1, which specify the point to "jump". Default is 0.5 which is in the middle.
  @step: (t, c=0.5) ->
    return (t - 0.5 - (c-0.5) ) ? 1: 0
