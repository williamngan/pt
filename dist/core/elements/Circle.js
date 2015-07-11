var Circle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Circle = (function(superClass) {
  extend(Circle, superClass);

  function Circle() {
    Circle.__super__.constructor.apply(this, arguments);
    this.radius = arguments[3] != null ? arguments[3] : 0;
  }

  Circle.prototype.setRadius = function(r) {
    this.radius = r;
    return this;
  };

  Circle.prototype.intersectPoint = function(args) {
    var d, item;
    item = new Vector(Point.get(arguments));
    d = item.$subtract(this);
    return d.x * d.x + d.y * d.y < this.radius * this.radius;
  };

  Circle.prototype.intersectPath = function(path, get_pts) {
    var a, b, c, d, disc, discSqrt, f, p, p1, p2, q, t1, t2;
    if (get_pts == null) {
      get_pts = true;
    }
    if (!path instanceof Pair) {
      return false;
    }
    d = path.direction();
    f = this.$subtract(path);
    a = d.dot(d, Const.xy);
    b = f.dot(d, Const.xy);
    c = f.dot(f, Const.xy) - (this.radius * this.radius);
    p = b / a;
    q = c / a;
    disc = p * p - q;
    if (disc < 0) {
      return (get_pts ? [] : false);
    } else {
      if (!get_pts) {
        return true;
      }
      discSqrt = Math.sqrt(disc);
      t1 = -p + discSqrt;
      t2 = -p - discSqrt;
      p1 = new Point(path.x - d.x * t1, path.y - d.y * t1);
      p2 = new Point(path.x - d.x * t2, path.y - d.y * t2);
      if (disc === 0) {
        return [p1];
      } else {
        return [p1, p2];
      }
    }
  };

  Circle.prototype.intersectLine = function(line, get_pts) {
    var bounds, i, len, p, pi, pts;
    if (get_pts == null) {
      get_pts = true;
    }
    pts = this.intersectPath(line);
    if (pts && pts.length > 0) {
      pi = [];
      bounds = line.bounds();
      for (i = 0, len = pts.length; i < len; i++) {
        p = pts[i];
        if (Rectangle.contain(p, bounds, bounds.p1)) {
          if (!get_pts) {
            return true;
          }
          pi.push(p);
        }
      }
      return (get_pts ? pi : pi.length > 0);
    } else {
      return (get_pts ? [] : false);
    }
  };

  Circle.prototype.intersectLines = function(lines, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return Line.intersectLines(this, lines, get_pts);
  };

  Circle.prototype.intersectCircle = function(circle, get_pts) {
    var a, ca_r2, cb_r2, dr, dr2, dv, h, p;
    if (get_pts == null) {
      get_pts = true;
    }
    dv = circle.$subtract(this);
    dr2 = dv.magnitude(false);
    dr = Math.sqrt(dr2);
    ca_r2 = this.radius * this.radius;
    cb_r2 = circle.radius * circle.radius;
    if (dr > this.radius + circle.radius) {
      return (get_pts ? [] : false);
    } else if (dr < Math.abs(this.radius - circle.radius)) {
      return (get_pts ? [new Vector(this), new Vector(circle)] : true);
    } else {
      if (!get_pts) {
        return true;
      }
      a = (ca_r2 - cb_r2 + dr2) / (2 * dr);
      h = Math.sqrt(ca_r2 - a * a);
      p = dv.$multiply(a / dr).add(this);
      return [new Vector(p.x + h * dv.y / dr, p.y - h * dv.x / dr), new Vector(p.x - h * dv.y / dr, p.y + h * dv.x / dr)];
    }
  };

  Circle.prototype.hasIntersect = function(item, get_pts) {
    var d, ins;
    if (get_pts == null) {
      get_pts = false;
    }
    if (item instanceof Circle) {
      return this.intersectCircle(item, get_pts);
    } else if (item instanceof Rectangle || item instanceof PointSet || item instanceof Triangle) {
      return this.intersectLines(item.sides(), get_pts);
    } else if (item instanceof Pair) {
      ins = this.intersectLine(item);
      if (!get_pts) {
        return ins.length > 0;
      } else {
        return ins;
      }
    } else if (item instanceof Point) {
      d = item.$subtract(this);
      return d.x * d.x + d.y * d.y < this.radius * this.radius;
    } else {
      if (get_pts) {
        return [];
      } else {
        return false;
      }
    }
  };

  return Circle;

})(Vector);

this.Circle = Circle;

//# sourceMappingURL=.map/Circle.js.map