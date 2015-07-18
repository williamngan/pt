var Point;

Point = (function() {
  function Point(args) {
    this.copy(Point.get(arguments));
  }

  Point.get = function(args) {
    if (args.length > 0) {
      if (typeof args[0] === 'object') {
        if (args[0] instanceof Array || args[0].length > 0) {
          return {
            x: args[0][0] || 0,
            y: args[0][1] || 0,
            z: args[0][2] || 0
          };
        } else {
          return {
            x: args[0].x || 0,
            y: args[0].y || 0,
            z: args[0].z || 0
          };
        }
      } else {
        return {
          x: args[0] || 0,
          y: args[1] || 0,
          z: args[2] || 0
        };
      }
    } else {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }
  };

  Point.prototype.quadrant = function(pt, epsilon) {
    if (epsilon == null) {
      epsilon = Const.epsilon;
    }
    if (pt.near(this)) {
      return Const.identical;
    }
    if (Math.abs(pt.x - this.x) < epsilon) {
      if (pt.y < this.y) {
        return Const.top;
      } else {
        return Const.bottom;
      }
    }
    if (Math.abs(pt.y - this.y) < epsilon) {
      if (pt.x < this.x) {
        return Const.left;
      } else {
        return Const.right;
      }
    }
    if (pt.y < this.y && pt.x > this.x) {
      return Const.top_right;
    } else if (pt.y < this.y && pt.x < this.x) {
      return Const.top_left;
    } else if (pt.y > this.y && pt.x < this.x) {
      return Const.bottom_left;
    } else {
      return Const.bottom_right;
    }
  };

  Point.prototype.set = function(args) {
    var p;
    p = Point.get(arguments);
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
    return this;
  };

  Point.prototype.copy = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z;
    return this;
  };

  Point.prototype.clone = function() {
    return new Point(this);
  };

  Point.prototype.toString = function() {
    return "Point " + this.x + ", " + this.y + ", " + this.z;
  };

  Point.prototype.toArray = function() {
    return [this];
  };

  Point.prototype.get2D = function(axis, reverse) {
    if (reverse == null) {
      reverse = false;
    }
    if (axis === Const.xy) {
      return new this.__proto__.constructor(this);
    }
    if (axis === Const.xz) {
      return new this.__proto__.constructor(this.x, this.z, this.y);
    }
    if (axis === Const.yz) {
      if (reverse) {
        return new this.__proto__.constructor(this.z, this.x, this.y);
      } else {
        return new this.__proto__.constructor(this.y, this.z, this.x);
      }
    }
    return new this.__proto__.constructor(this);
  };

  Point.prototype.min = function(args) {
    var _p;
    _p = Point.get(arguments);
    return new this.__proto__.constructor(Math.min(this.x, _p.x), Math.min(this.y, _p.y), Math.min(this.z, _p.z));
  };

  Point.prototype.max = function(args) {
    var _p;
    _p = Point.get(arguments);
    return new this.__proto__.constructor(Math.max(this.x, _p.x), Math.max(this.y, _p.y), Math.max(this.z, _p.z));
  };

  Point.prototype.equal = function(args) {
    var _p;
    _p = Point.get(arguments);
    return (_p.x === this.x) && (_p.y === this.y) && (_p.z === this.z);
  };

  Point.prototype.near = function(pt, epsilon) {
    var _p;
    if (epsilon == null) {
      epsilon = Const.epsilon;
    }
    _p = Point.get(arguments);
    return (Math.abs(_p.x - this.x) < epsilon) && (Math.abs(_p.y - this.y) < epsilon) && (Math.abs(_p.z - this.z) < epsilon);
  };

  Point.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  };

  return Point;

})();

this.Point = Point;

//# sourceMappingURL=.map/Point.js.map