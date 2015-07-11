
# ## Easing functions based on Robert Penner's
class Easing

  # ## Linear interpolation
  # @param `t` current time or iteration
  # @param `b` start value
  # @param `c` change in value
  # @param `d` duration time or total iteration
  @linear: (t, b, c, d) ->
    return c * (t /= d) + b

  @_linear:(t) -> Easing.linear(t, 0, 1, 1)

  @quadIn: (t, b, c, d) ->
    return c * (t /= d) * t + b

  @_quadIn: (t) -> Easing.quadIn(t, 0, 1, 1)

  @quadOut: (t, b, c, d) ->
    return -c * (t /= d) * (t - 2) + b

  @_quadOut: (t) -> Easing.quadOut(t, 0, 1, 1)

  @cubicIn: (t, b, c, d) ->
    t = t/d
    return c * t * t * t + b

  @_cubicIn: (t) -> Easing.cubicIn(t, 0, 1, 1)

  @cubicOut: (t, b, c, d) ->
    t = t/d
    return c * ((t - 1) * t * t + 1) + b

  @_cubicOut: (t) -> Easing.cubicOut(t, 0, 1, 1)

  @elastic: (t, b, c, d, el=0.3) ->
    s = 1.70158
    p = d * el
    a = c
    if t == 0 then return b
    t = t/d
    if t == 1 then return b + c
    if a < Math.abs(c)
      a = c
      s = p / 4
    else if a != 0
      s = p / Const.two_pi * Math.asin(c / a)
    else
      s = 0

    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * Const.two_pi / p) + c + b

  @_elastic: (t) -> Easing.elastic(t, 0, 1, 1)

  @bounce: (t, b, c, d) ->
    if (t /= d) < (1 / 2.75)
      return c * (7.5625 * t * t) + b
    else if t < (2 / 2.75)
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
    else if t < (2.5 / 2.75)
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
    else
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b

  @_bounce: (t) -> Easing.bounce(t, 0, 1, 1)


# namespace
this.Easing = Easing