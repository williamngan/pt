var Util;

Util = (function() {
  function Util() {}

  Util.toRadian = function(angle) {
    return angle * Const.deg_to_rad;
  };

  Util.toDegree = function(radian) {
    return radian * Const.rad_to_deg;
  };

  Util.toHexColor = function(number) {
    var h;
    h = Math.floor(number).toString(16);
    if (h.length === 1) {
      return "0" + h;
    } else {
      return h;
    }
  };

  Util.toRGBColor = function(hexString, asRGBA, opacity) {
    var b, g, r;
    if (asRGBA == null) {
      asRGBA = false;
    }
    if (opacity == null) {
      opacity = 1;
    }
    if (hexString[0] === "#") {
      hexString = hexString.substr(1);
    }
    if (hexString.length === 3) {
      r = parseInt(hexString[0] + hexString[0], 16);
      g = parseInt(hexString[1] + hexString[1], 16);
      b = parseInt(hexString[2] + hexString[2], 16);
    } else if (hexString.length >= 6) {
      r = parseInt(hexString[0] + hexString[1], 16);
      g = parseInt(hexString[2] + hexString[3], 16);
      b = parseInt(hexString[4] + hexString[5], 16);
    } else {
      r = 0;
      g = 0;
      b = 0;
    }
    if (asRGBA) {
      return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    } else {
      return [r, g, b, opacity];
    }
  };

  Util.bound = function(val, max, positive) {
    var a, half;
    if (positive == null) {
      positive = false;
    }
    a = val % max;
    half = max / 2;
    if (a > half) {
      a -= max;
    } else if (a < -half) {
      a += max;
    }
    if (positive) {
      if (a < 0) {
        return a + max;
      } else {
        return a;
      }
    } else {
      return a;
    }
  };

  Util.boundAngle = function(ang, positive) {
    return Util.bound(ang, 360, positive);
  };

  Util.boundRadian = function(radian, positive) {
    return Util.bound(radian, Const.two_pi, positive);
  };

  Util.boundingBox = function(points, is3D) {
    var j, len, maxPt, minPt, p;
    if (is3D == null) {
      is3D = false;
    }
    minPt = new Point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    maxPt = new Point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    for (j = 0, len = points.length; j < len; j++) {
      p = points[j];
      if (p.x < minPt.x) {
        minPt.x = p.x;
      }
      if (p.y < minPt.y) {
        minPt.y = p.y;
      }
      if (p.x > maxPt.x) {
        maxPt.x = p.x;
      }
      if (p.y > maxPt.y) {
        maxPt.y = p.y;
      }
      if (is3D) {
        if (p.z < minPt.z) {
          minPt.z = p.z;
        }
        if (p.z > maxPt.z) {
          maxPt.z = p.z;
        }
      }
    }
    return new Rectangle(minPt).to(maxPt);
  };

  Util.lerp = function(a, b, t) {
    return (1 - t) * a + t * b;
  };

  Util.centroid = function(points) {
    var c, j, len, p;
    c = new Vector();
    for (j = 0, len = points.length; j < len; j++) {
      p = points[j];
      c.add(p);
    }
    return c.divide(points.length);
  };

  Util.same = function(a, b, threshold) {
    if (threshold == null) {
      threshold = Const.epsilon;
    }
    return Math.abs(a - b) < threshold;
  };

  Util.within = function(p, a, b) {
    return p >= Math.min(a, b) && p <= Math.max(a, b);
  };

  Util.randomRange = function(a, b) {
    var r;
    if (b == null) {
      b = 0;
    }
    r = a > b ? a - b : b - a;
    return a + Math.random() * r;
  };

  Util.mixin = function(klass, mix) {
    var k, v;
    for (k in mix) {
      v = mix[k];
      if (mix.hasOwnProperty(k)) {
        klass.prototype[k] = mix[k];
      }
    }
    return klass;
  };

  Util.extend = function(klass, parent) {
    klass.prototype = Object.create(parent.prototype);
    klass.prototype.constructor = klass;
    return klass;
  };

  Util.clonePoints = function(array) {
    var j, len, p, results;
    results = [];
    for (j = 0, len = array.length; j < len; j++) {
      p = array[j];
      results.push(p.clone());
    }
    return results;
  };

  Util.contextRotateOrigin = function(ctx, bound, radian, origin, mask) {
    var msz, size;
    if (origin == null) {
      origin = false;
    }
    size = bound.size();
    if (!origin) {
      origin = size.$multiply(0.5);
      origin.add(bound);
    }
    if (mask) {
      msz = mask.size();
      Form.rect(ctx, mask);
      ctx.clip();
    }
    ctx.translate(origin.x, origin.y);
    ctx.rotate(radian);
    return ctx.translate(-origin.x, -origin.y);
  };

  Util.sinCosTable = function() {
    var cos, i, j, sin;
    cos = [];
    sin = [];
    for (i = j = 0; j <= 360; i = j += 1) {
      cos[i] = Math.cos(i * Math.PI / 180);
      sin[i] = Math.sin(i * Math.PI / 180);
    }
    return {
      sin: sin,
      cos: cos
    };
  };

  Util.chance = function(p) {
    return Math.random() < p;
  };

  Util.gaussian = function(x, mean, sigma) {
    if (mean == null) {
      mean = 0;
    }
    if (sigma == null) {
      sigma = 1;
    }
    x = (x - mean) / sigma;
    return Const.gaussian * Math.exp(-0.5 * x * x) / sigma;
  };

  return Util;

})();

this.Util = Util;

//# sourceMappingURL=.map/Util.js.map