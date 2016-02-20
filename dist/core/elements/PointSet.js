var PointSet,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

PointSet = (function(superClass) {
  extend(PointSet, superClass);

  function PointSet() {
    PointSet.__super__.constructor.apply(this, arguments);
    this.points = [];
  }

  PointSet.prototype.toString = function() {
    var j, len, p, ref, str;
    str = "PointSet [ ";
    ref = this.points;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      str += p.x + "," + p.y + "," + p.z + ", ";
    }
    return str + " ]";
  };

  PointSet.prototype.toArray = function() {
    return this.points.slice();
  };

  PointSet.prototype.to = function(args) {
    var j, len, p, ref;
    if (arguments.length > 0) {
      if (Array.isArray(arguments[0]) && arguments[0].length > 0 && typeof arguments[0][0] === 'object') {
        ref = arguments[0];
        for (j = 0, len = ref.length; j < len; j++) {
          p = ref[j];
          this.points.push(new Vector(p));
        }
      } else {
        this.points.push(new Vector(Point.get(arguments)));
      }
    }
    return this;
  };

  PointSet.prototype.getAt = function(index) {
    return this.points[Math.min(this.points.length - 1, Math.max(0, index))];
  };

  PointSet.prototype.$getAt = function(index) {
    return new Vector(this.getAt(index));
  };

  PointSet.prototype.setAt = function(index, p) {
    this.points[index] = p;
    return this;
  };

  PointSet.prototype.count = function() {
    return this.points.length;
  };

  PointSet.prototype.connectFromAnchor = function(args) {
    var j, len, p, ref;
    if (arguments.length > 0) {
      if (Array.isArray(arguments[0]) && arguments[0].length > 0) {
        ref = arguments[0];
        for (j = 0, len = ref.length; j < len; j++) {
          p = ref[j];
          this.points.push(this.$add(p));
        }
      } else {
        this.points.push(this.$add(Point.get(arguments)));
      }
    }
    return this;
  };

  PointSet.prototype.disconnect = function(index) {
    if (index == null) {
      index = -1;
    }
    if (index < 0) {
      this.points = this.points.slice(0, this.points.length + index);
    } else {
      this.points = this.points.slice(index + 1);
    }
    return this;
  };

  PointSet.prototype.clear = function() {
    this.points = [];
    return this;
  };

  PointSet.prototype.sides = function(close_path) {
    var j, lastP, len, p, ref, sides;
    if (close_path == null) {
      close_path = true;
    }
    lastP = null;
    sides = [];
    ref = this.points;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      if (lastP) {
        sides.push(new Line(lastP).to(p));
      }
      lastP = p;
    }
    if (this.points.length > 1 && close_path) {
      sides.push(new Line(lastP).to(this.points[0]));
    }
    return sides;
  };

  PointSet.prototype.angles = function(axis) {
    var angles, i, j, ref, v1, v2;
    if (axis == null) {
      axis = Const.xy;
    }
    angles = [];
    for (i = j = 1, ref = this.points.length - 1; j < ref; i = j += 1) {
      v1 = this.points[i - 1].$subtract(this.points[i]);
      v2 = this.points[i + 1].$subtract(this.points[i]);
      angles.push({
        p0: this.points[i - 1],
        p1: this.points[i],
        p2: this.points[i + 1],
        angle: v1.angleBetween(v2)
      });
    }
    return angles;
  };

  PointSet.prototype.bounds = function() {
    return Util.boundingBox(this.points);
  };

  PointSet.prototype.centroid = function() {
    return Util.centroid(this.points);
  };

  PointSet.prototype.convexHull = function(sort) {
    var dq, i, left, pt, pts;
    if (sort == null) {
      sort = true;
    }
    if (this.points.length < 3) {
      return [];
    }
    if (sort) {
      pts = this.points.slice();
      pts.sort(function(a, b) {
        return a.x - b.x;
      });
    } else {
      pts = this.points;
    }
    left = function(a, b, pt) {
      return (b.x - a.x) * (pt.y - a.y) - (pt.x - a.x) * (b.y - a.y) > 0;
    };
    dq = [];
    if (left(pts[0], pts[1], pts[2])) {
      dq.push(pts[0]);
      dq.push(pts[1]);
    } else {
      dq.push(pts[1]);
      dq.push(pts[0]);
    }
    dq.unshift(pts[2]);
    dq.push(pts[2]);
    i = 3;
    while (i < pts.length) {
      pt = pts[i];
      if (left(pt, dq[0], dq[1]) && left(dq[dq.length - 2], dq[dq.length - 1], pt)) {
        i++;
        continue;
      }
      while (!left(dq[dq.length - 2], dq[dq.length - 1], pt)) {
        dq.pop();
      }
      dq.push(pt);
      while (!left(dq[0], dq[1], pt)) {
        dq.shift();
      }
      dq.unshift(pt);
      i++;
    }
    return dq;
  };

  PointSet.prototype.clone = function() {
    return new PointSet(this).to(Util.clonePoints(this.points));
  };

  return PointSet;

})(Vector);

this.PointSet = PointSet;

//# sourceMappingURL=.map/PointSet.js.map