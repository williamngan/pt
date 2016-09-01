# ### Shaping functions.
class Shaping extends Vector

  constructor: ( args ) ->
    super


  @linear: (t, c=1) ->
    return c * t;

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


  # ## Exponential ease In, based on Golan Levin's [polynomial shapers](http://www.flong.com/texts/code/shapers_poly/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` a value between 0 to 1 to control the curve.
  @exponentialIn: (t, c=1, p=0.25) ->
    return c * Math.pow( t, 1/p );


  # ## Exponential ease out, based on Golan Levin's [polynomial shapers](http://www.flong.com/texts/code/shapers_poly/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` a value between 0 to 1 to control the curve.
  @exponentialOut: (t, c=1, p=0.25) ->
    return c * Math.pow( t, p );


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


  # ## A faster way to approximate cosine ease in-out using Blinn-Wyvill Approximation. See Golan Levin's [polynomial shaping](http://www.flong.com/texts/code/shapers_poly/)
  @cosineApprox: (t, c=1) ->
    t2 = t * t
    t4 = t2 * t2
    t6 = t4 * t2
    return c * ( 4*t6/9 - 17*t4/9 + 22*t2/9 )


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
  # @param `c` the value to shape, default is 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  @elasticIn: (t, c=1, p=0.7) ->
    dt = t - 1
    s = (p / Const.two_pi) * 1.5707963267948966
    return c * (-Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p))


  # ## Elastic out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  @elasticOut: (t, c=1, p=0.7) ->
    s = (p / Const.two_pi) * 1.5707963267948966
    return c * ( Math.pow(2, -10 * t) * Math.sin((t - s) * Const.two_pi / p)) + c


  # ## Elastic in-out, based on Robert Penner's easing functions
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` elastic parmeter between 0 to 1. The lower the number, the more elastic it will be
  @elasticInOut: (t, c=1, p=0.6) ->
    dt = t*2
    s = (p / Const.two_pi) * 1.5707963267948966
    if (t<0.5)
      dt -= 1
      return c * ( -0.5 * ( Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p)) )
    else
      dt -= 1
      return c * (0.5 * ( Math.pow(2, -10 * dt) * Math.sin(( dt - s) * Const.two_pi / p))) + c


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


  # ## Sigmoid curve changes its shape based on the input value, but always returns a value between 0 to 1.
  # @param `t` a value between 0 to 1
  # @param `p` the larger the value, the "steeper" the curve will be. Default is 10
  @sigmoid: (t, c=1, p=10) ->
    d = p * (t-0.5)
    return c / (1 + Math.exp( -d ) )


  # ## The Logistic Sigmoid is a useful curve. Based on Golan Levin's [shaping function](http://www.flong.com/texts/code/shapers_exp/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` a parameter between 0 to 1 to control the steepness of the curve. Higher is steeper.
  @logSigmoid: (t, c=1, p=0.7) ->
    p = Math.max( Const.epsilon, Math.min( 1-Const.epsilon, p ) )
    p = 1/(1-p)

    A = 1 / (1 + Math.exp( ((t-0.5) * p * -2) ));
    B = 1 / (1 + Math.exp(p));
    C = 1 / (1 + Math.exp(-p));
    return c * (A-B)/(C-B);


  # ## An exponential seat curve. Based on Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_exp/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p` a parameter between 0 to 1 to control the steepness of the curve. Higher is steeper.
  @seat: (t, c=1, p=0.5) ->
    if (t < 0.5)
      return c * ( Math.pow( 2*t, 1-p ) ) / 2
    else
      return c * ( 1 - ( Math.pow( 2 * (1-t), 1-p)) / 2 )


  # ## Quadratic bezier curve. Based on Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_exp/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p1` a Point object specifying the first control point, or a value specifying the control point's x position (its y position will default to 0.5)
  @quadraticBezier: (t, c=1, p=new Point(0.05, 0.95)) ->
    a = if (p.x) then p.x else p
    b = if (p.y) then p.y else 0.5
    om2a = 1 - 2*a
    if (om2a == 0) then om2a = Const.epsilon
    d = (Math.sqrt(a*a + om2a*t) - a)/om2a
    return c * ((1-2*b)*(d*d) + (2*b)*d)


  # ## Cubic bezier curve. This reuses the bezier functions in Curve class.
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p1` a Point object specifying the first control point
  # @param `p2` a Point object specifying the second control point
  @cubicBezier: ( t, c=1, p1=new Point(0.1, 0.7), p2=new Point(0.9, 0.2)) ->
    curve = new Curve().to( [new Point(0,0,), p1, p2, new Point(1,1)])
    return c * curve.bezierPoint([t, t*t, t*t*t], curve.controlPoints() ).y


  # ## Give a point, draw a quadratic curve that will pass through that point as closely as possible. Based on Golan Levin's [shaping functions](http://www.flong.com/texts/code/shapers_poly/)
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p1` a Point object specifying the point to pass through
  @quadraticTarget: (t, c=1, p1= new Point(0.2, 0.35)) ->
    a = Math.min(1-Const.epsilon, Math.max(Const.epsilon, p1.x))
    b = Math.min(1, Math.max(0, p1.y))
    A = (1-b)/(1-a) - (b/a);
    B = (A * (a*a) - b ) / a;
    y = A*(t*t) - B*(t);
    return c * Math.min( 1, Math.max( 0, y ) )


  # ## Step function is a simple jump from 0 to 1 at a specific point in time
  # @param `t` a value between 0 to 1
  # @param `p` usually a value between 0 to 1, which specify the point to "jump". Default is 0.5 which is in the middle.
  @cliff: (t, c=1, p=0.5) ->
    return if ( t > p ) then c else 0


  # ## Turn any shaping functions into a series of steps
  # @param `fn` the original shaping function
  # @param `steps` the number of steps
  # @param `t` a value between 0 to 1
  # @param `c` the value to shape, default is 1
  # @param `p1` optional first paramter to pass to original function
  # @param `p2` optional second paramter to pass to original function
  @step: (fn, steps, t, c, p1, p2) ->
    s = 1/steps
    tt = Math.floor(t/s) * s
    return fn( tt, c, p1, p2 )
