var Vector,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Vector = (function(superClass) {
  extend(Vector, superClass);

  function Vector() {
    Vector.__super__.constructor.apply(this, arguments);
  }

  Vector.prototype._getArgs = function(args) {
    if (typeof args[0] === 'number' && args.length > 1) {
      return args;
    } else {
      return args[0];
    }
  };

  Vector.prototype.add = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x += arguments[0];
      this.y += arguments[0];
      this.z += arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x += _p.x;
      this.y += _p.y;
      this.z += _p.z;
    }
    return this;
  };

  Vector.prototype.$add = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).add(a);
  };

  Vector.prototype.subtract = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x -= arguments[0];
      this.y -= arguments[0];
      this.z -= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x -= _p.x;
      this.y -= _p.y;
      this.z -= _p.z;
    }
    return this;
  };

  Vector.prototype.$subtract = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).subtract(a);
  };

  Vector.prototype.multiply = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x *= arguments[0];
      this.y *= arguments[0];
      this.z *= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x *= _p.x;
      this.y *= _p.y;
      this.z *= _p.z;
    }
    return this;
  };

  Vector.prototype.$multiply = function(args) {
    var a, arg;
    a = arg = this._getArgs(arguments);
    return new Vector(this).multiply(a);
  };

  Vector.prototype.divide = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x /= arguments[0];
      this.y /= arguments[0];
      this.z /= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x /= _p.x;
      this.y /= _p.y;
      this.z /= _p.z;
    }
    return this;
  };

  Vector.prototype.$divide = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).divide(a);
  };

  Vector.prototype.angle = function(args) {
    var axis, p;
    if (arguments.length === 0) {
      return Math.atan2(this.y, this.x);
    }
    if (typeof arguments[0] === 'string') {
      axis = arguments[0];
      p = arguments.length > 1 ? this.$subtract(arguments[1]).multiply(-1) : void 0;
    } else {
      p = this.$subtract(arguments[0]).multiply(-1);
      axis = false;
    }
    if (p && !axis) {
      return Math.atan2(p.y, p.x);
    } else if (axis === Const.xy) {
      if (p) {
        return Math.atan2(p.y, p.x);
      } else {
        return Math.atan2(this.y, this.x);
      }
    } else if (axis === Const.yz) {
      if (p) {
        return Math.atan2(p.z, p.y);
      } else {
        return Math.atan2(this.z, this.y);
      }
    } else if (axis === Const.xz) {
      if (p) {
        return Math.atan2(p.z, p.x);
      } else {
        return Math.atan2(this.z, this.x);
      }
    }
  };

  Vector.prototype.angleBetween = function(vec, axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return Util.boundRadian(this.angle(axis), true) - Util.boundRadian(vec.angle(axis), true);
  };

  Vector.prototype.magnitude = function(args) {
    var _sq, axis, m, mag, p, useSq;
    m = {
      x: this.x * this.x,
      y: this.y * this.y,
      z: this.z * this.z
    };
    useSq = arguments.length >= 1 && !arguments[arguments.length - 1];
    _sq = useSq ? (function(x) {
      return x;
    }) : Math.sqrt;
    if (arguments.length === 0) {
      return _sq(m.x + m.y + m.z);
    }
    if (typeof arguments[0] === 'string') {
      axis = arguments[0];
      if (arguments.length > 1 && arguments[1]) {
        p = this.$subtract(arguments[1]);
      } else {
        p = void 0;
      }
    } else {
      p = this.$subtract(arguments[0]);
      axis = false;
    }
    mag = p ? {
      x: p.x * p.x,
      y: p.y * p.y,
      z: p.z * p.z
    } : m;
    if (p && !axis) {
      return _sq(mag.x + mag.y + mag.z);
    } else if (axis === Const.xy) {
      return _sq(mag.x + mag.y);
    } else if (axis === Const.yz) {
      return _sq(mag.y + mag.z);
    } else if (axis === Const.xz) {
      return _sq(mag.x + mag.z);
    }
  };

  Vector.prototype.distance = function(pt, axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return this.magnitude(axis, pt);
  };

  Vector.prototype.normalize = function() {
    this.set(this.$normalize());
    return this;
  };

  Vector.prototype.$normalize = function() {
    var m;
    m = this.magnitude();
    if (m === 0) {
      return new Vector();
    } else {
      return new Vector(this.x / m, this.y / m, this.z / m);
    }
  };

  Vector.prototype.abs = function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  };

  Vector.prototype.dot = function(p, axis) {
    if (axis == null) {
      axis = Const.xyz;
    }
    if (axis === Const.xyz) {
      return this.x * p.x + this.y * p.y + this.z * p.z;
    } else if (axis === Const.xy) {
      return this.x * p.x + this.y * p.y;
    } else if (axis === Const.yz) {
      return this.y * p.y + this.z * p.z;
    } else if (axis === Const.xz) {
      return this.x * p.x + this.z * p.z;
    } else {
      return this.x * p.x + this.y * p.y + this.z * p.z;
    }
  };

  Vector.prototype.projection = function(vec, axis) {
    var a, b, dot, m;
    if (axis == null) {
      axis = Const.xyz;
    }
    m = vec.magnitude();
    a = this.$normalize();
    b = new Vector(vec.x / m, vec.y / m, vec.z / m);
    dot = a.dot(b, axis);
    return a.$multiply(m * dot);
  };

  Vector.prototype.cross = function(p) {
    return new Vector(this.y * p.z - this.z * p.y, this.z * p.x - this.x * p.z, this.x * p.y - this.y * p.x);
  };

  Vector.prototype.bisect = function(vec, isNormalized) {
    if (isNormalized == null) {
      isNormalized = false;
    }
    if (isNormalized) {
      return this.$add(vec).divide(2);
    } else {
      return this.$normalize().add(vec.$normalize()).divide(2);
    }
  };

  Vector.prototype.perpendicular = function(axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    switch (axis) {
      case Const.xy:
        return [new Vector(-this.y, this.x, this.z), new Vector(this.y, -this.x, this.z)];
      case Const.yz:
        return [new Vector(this.x, -this.z, this.y), new Vector(this.x, this.z, -this.y)];
      case Const.xz:
        return [new Vector(-this.z, this.y, this.x), new Vector(this.z, -this.y, this.x)];
      default:
        return [new Vector(-this.y, this.x, this.z), new Vector(this.y, -this.x, this.z)];
    }
  };

  Vector.prototype.isPerpendicular = function(p, axis) {
    if (axis == null) {
      axis = Const.xyz;
    }
    return this.dot(p, axis) === 0;
  };

  Vector.prototype.surfaceNormal = function(p) {
    return this.cross(p).normalize(true);
  };

  Vector.prototype.moveTo = function(args) {
    var d, i, len, p, pts, target;
    target = Point.get(arguments);
    d = this.$subtract(target);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      p.subtract(d);
    }
    return this;
  };

  Vector.prototype.moveBy = function(args) {
    var i, inc, len, p, pts;
    inc = Point.get(arguments);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      p.add(inc);
    }
    return this;
  };

  Vector.prototype.rotate2D = function(radian, anchor, axis) {
    var i, len, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.rotateAnchor2D(radian, anchor, axis);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.reflect2D = function(line, axis) {
    var i, len, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    mx = Matrix.reflectAnchor2D(line, axis);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.scale2D = function(sx, sy, anchor, axis) {
    var i, len, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.scaleAnchor2D(sx, sy, anchor, axis);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.shear2D = function(sx, sy, anchor, axis) {
    var i, len, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.shearAnchor2D(sx, sy, anchor, axis);
    pts = this.toArray();
    for (i = 0, len = pts.length; i < len; i++) {
      p = pts[i];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.clone = function() {
    return new Vector(this);
  };

  Vector.prototype.toString = function() {
    return "Vector " + this.x + ", " + this.y + ", " + this.z;
  };

  Vector.prototype.toArray = function() {
    return [this];
  };

  return Vector;

})(Point);

this.Vector = Vector;

//# sourceMappingURL=.map/Vector.js.map