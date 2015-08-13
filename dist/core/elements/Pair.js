var Pair,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Pair = (function(superClass) {
  extend(Pair, superClass);

  function Pair() {
    Pair.__super__.constructor.apply(this, arguments);
    this.p1 = new Vector(this.x, this.y, this.z);
    if (arguments.length === 4) {
      this.z = 0;
      this.p1.set(arguments[2], arguments[3]);
    } else if (arguments.length === 6) {
      this.p1.set(arguments[3], arguments[4], arguments[5]);
    }
  }

  Pair.prototype.to = function() {
    this.p1 = new Vector(Point.get(arguments));
    return this;
  };

  Pair.prototype.getAt = function(index) {
    if (index === 1 || index === "p1") {
      return this.p1;
    }
    return this;
  };

  Pair.prototype.$getAt = function(index) {
    return new Vector(this.getAt(index));
  };

  Pair.prototype.relative = function() {
    this.p1.add(this);
    return this;
  };

  Pair.prototype.$relative = function() {
    return this.$add(this.p1);
  };

  Pair.prototype.bounds = function() {
    return new Pair(this.$min(this.p1)).to(this.$max(this.p1));
  };

  Pair.prototype.withinBounds = function(pt, axis) {
    var a, b;
    if (axis) {
      a = this.get2D(axis);
      b = this.p1.get2D(axis);
      if (a.x === b.x) {
        return pt.y >= Math.min(a.y, b.y) && pt.y <= Math.max(a.y, b.y);
      } else if (a.y === b.y) {
        return pt.x >= Math.min(a.x, b.x) && pt.x <= Math.max(a.x, b.x);
      } else {
        return pt.x >= Math.min(a.x, b.x) && pt.y >= Math.min(a.y, b.y) && pt.x <= Math.max(a.x, b.x) && pt.y <= Math.max(a.y, b.y);
      }
    } else {
      return pt.x >= Math.min(this.x, this.p1.x) && pt.y >= Math.min(this.y, this.p1.y) && pt.z >= Math.min(this.z, this.p1.z) && pt.x <= Math.max(this.x, this.p1.x) && pt.y <= Math.max(this.y, this.p1.y) && pt.z <= Math.max(this.z, this.p1.z);
    }
  };

  Pair.prototype.interpolate = function(t, relative) {
    var p2;
    if (relative == null) {
      relative = false;
    }
    p2 = relative ? this.$relative() : this.p1;
    return new Vector((1 - t) * this.x + t * p2.x, (1 - t) * this.y + t * p2.y, (1 - t) * this.z + t * p2.z);
  };

  Pair.prototype.midpoint = function() {
    return this.interpolate(0.5);
  };

  Pair.prototype.direction = function(reverse) {
    if (reverse) {
      return this.$subtract(this.p1);
    } else {
      return this.p1.$subtract(this);
    }
  };

  Pair.prototype.size = function() {
    if (arguments.length > 0) {
      this.p1 = this.$add(Point.get(arguments));
      return this;
    } else {
      return this.p1.$subtract(this).abs();
    }
  };

  Pair.prototype.length = function(sqrt) {
    var d, dx, dy, dz;
    if (sqrt == null) {
      sqrt = true;
    }
    dz = this.z - this.p1.z;
    dy = this.y - this.p1.y;
    dx = this.x - this.p1.x;
    d = dx * dx + dy * dy + dz * dz;
    if (sqrt) {
      return Math.sqrt(d);
    } else {
      return d;
    }
  };

  Pair.prototype.collinear = function(point) {
    return (this.p1.x - this.x) * (point.y - this.y) - (point.x - this.x) * (this.p1.y - this.y);
  };

  Pair.prototype.resetBounds = function() {
    var temp;
    temp = this.$min(this.p1);
    this.p1.set(this.$max(this.p1));
    this.set(temp);
    return this;
  };

  Pair.prototype.equal = function(epsilon) {
    if (epsilon == null) {
      epsilon = false;
    }
    if (arguments[0] instanceof Pair) {
      return Pair.__super__.equal.call(this, arguments[0]) && this.p1.equal(arguments[0].p1);
    } else {
      return Pair.__super__.equal.apply(this, arguments);
    }
  };

  Pair.prototype.clone = function() {
    var p;
    p = new Pair(this);
    p.to(this.p1.clone());
    return p;
  };

  Pair.prototype.floor = function() {
    Pair.__super__.floor.apply(this, arguments);
    return this.p1.floor();
  };

  Pair.prototype.toString = function() {
    return "Pair of vectors from (" + this.x + ", " + this.y + ", " + this.z + ") to (" + this.p1.x + ", " + this.p1.y + ", " + this.p1.z + ")";
  };

  Pair.prototype.toArray = function() {
    return [this, this.p1];
  };

  return Pair;

})(Vector);

this.Pair = Pair;

//# sourceMappingURL=.map/Pair.js.map