var Easing;

Easing = (function() {
  function Easing() {}

  Easing.linear = function(t, b, c, d) {
    return c * (t /= d) + b;
  };

  Easing._linear = function(t) {
    return Easing.linear(t, 0, 1, 1);
  };

  Easing.quadIn = function(t, b, c, d) {
    return c * (t /= d) * t + b;
  };

  Easing._quadIn = function(t) {
    return Easing.quadIn(t, 0, 1, 1);
  };

  Easing.quadOut = function(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  };

  Easing._quadOut = function(t) {
    return Easing.quadOut(t, 0, 1, 1);
  };

  Easing.cubicIn = function(t, b, c, d) {
    t = t / d;
    return c * t * t * t + b;
  };

  Easing._cubicIn = function(t) {
    return Easing.cubicIn(t, 0, 1, 1);
  };

  Easing.cubicOut = function(t, b, c, d) {
    t = t / d;
    return c * ((t - 1) * t * t + 1) + b;
  };

  Easing._cubicOut = function(t) {
    return Easing.cubicOut(t, 0, 1, 1);
  };

  Easing.elastic = function(t, b, c, d, el) {
    var a, p, s;
    if (el == null) {
      el = 0.3;
    }
    s = 1.70158;
    p = d * el;
    a = c;
    if (t === 0) {
      return b;
    }
    t = t / d;
    if (t === 1) {
      return b + c;
    }
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else if (a !== 0) {
      s = p / Const.two_pi * Math.asin(c / a);
    } else {
      s = 0;
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * Const.two_pi / p) + c + b;
  };

  Easing._elastic = function(t) {
    return Easing.elastic(t, 0, 1, 1);
  };

  Easing.bounce = function(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  };

  Easing._bounce = function(t) {
    return Easing.bounce(t, 0, 1, 1);
  };

  return Easing;

})();

this.Easing = Easing;

//# sourceMappingURL=map/Easing.js.map