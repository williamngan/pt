var Line,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Line = (function(superClass) {
  extend(Line, superClass);

  function Line() {
    Line.__super__.constructor.apply(this, arguments);
  }

  Line.slope = function(a, b, axis) {
    var p1, p2;
    if (axis == null) {
      axis = Const.xy;
    }
    p1 = a.get2D(axis);
    p2 = b.get2D(axis);
    if (p2.x - p1.x === 0) {
      return false;
    } else {
      return (p2.y - p1.y) / (p2.x - p1.x);
    }
  };

  Line.intercept = function(a, b, axis) {
    var c, m, p1, p2;
    if (axis == null) {
      axis = Const.xy;
    }
    p1 = a.get2D(axis);
    p2 = b.get2D(axis);
    if (p2.x - p1.x === 0) {
      return false;
    } else {
      m = (p2.y - p1.y) / (p2.x - p1.x);
      c = p1.y - m * p1.x;
      return {
        slope: m,
        yi: c,
        xi: m === 0 ? false : -c / m
      };
    }
  };

  Line.isPerpendicularLine = function(line1, line2, axis) {
    var s1, s2;
    if (axis == null) {
      axis = Const.xy;
    }
    s1 = Line.slope(line1, line1.p1, axis);
    s2 = Line.slope(line2, line2.p1, axis);
    if (s1 === false) {
      return s2 === 0;
    } else if (s2 === false) {
      return s1 === 0;
    } else {
      return s1 * s2 === -1;
    }
  };

  Line.prototype.slope = function(axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return Line.slope(this, this.p1, axis);
  };

  Line.prototype.intercept = function(axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return Line.intercept(this, this.p1, axis);
  };

  Line.prototype.getPerpendicular = function(t, len, reverse, axis) {
    var line, pn, pp;
    if (len == null) {
      len = 10;
    }
    if (reverse == null) {
      reverse = false;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    pn = this.direction().normalize().perpendicular(axis);
    pp = reverse ? pn[1] : pn[0];
    line = new Line(this.interpolate(t));
    line.to(pp.multiply(len).add(line));
    return line;
  };

  Line.prototype.getDistanceFromPoint = function(pt) {
    var normal, path;
    path = this.$subtract(this.p1);
    normal = new Vector(-path.y, path.x).normalize();
    return this.$subtract(pt).dot(normal);
  };

  Line.prototype.getPerpendicularFromPoint = function(pt, fromProjection) {
    var proj;
    if (fromProjection == null) {
      fromProjection = true;
    }
    proj = this.p1.$subtract(this).projection(pt.$subtract(this));
    if (!fromProjection) {
      return proj;
    } else {
      return proj.add(this);
    }
  };

  Line.prototype.intersectPath = function(line, axis) {
    var a, b, ln, p, px, py, y1;
    if (axis == null) {
      axis = Const.xy;
    }
    a = this.intercept(axis);
    b = line.intercept(axis);
    p = this.get2D(axis);
    ln = line.get2D(axis);
    if (a === false) {
      if (b === false) {
        return false;
      }
      y1 = -b.slope * (ln.x - p.x) + ln.y;
      if (axis === Const.xy) {
        return new Vector(p.x, y1);
      } else {
        return new Vector(p.x, y1).get2D(axis, true);
      }
    } else {
      if (b === false) {
        y1 = -a.slope * (p.x - ln.x) + p.y;
        return new Vector(ln.x, y1);
      } else if (b.slope !== a.slope) {
        px = (a.slope * p.x - b.slope * ln.x + ln.y - p.y) / (a.slope - b.slope);
        py = a.slope * (px - p.x) + p.y;
        if (axis === Const.xy) {
          return new Vector(px, py);
        } else {
          return new Vector(px, py).get2D(axis, true);
        }
      } else {
        if (a.yi === b.yi) {
          return null;
        } else {
          return false;
        }
      }
    }
  };

  Line.prototype.intersectLine = function(line, axis) {
    var pt;
    if (axis == null) {
      axis = Const.xy;
    }
    pt = this.intersectPath(line, axis);
    if (pt && this.withinBounds(pt, axis) && line.withinBounds(pt, axis)) {
      return pt;
    } else {
      if (pt === null) {
        return null;
      } else {
        return false;
      }
    }
  };

  Line.intersectLines = function(elem, lines, get_pts) {
    var i, ins, j, len1, ln, p, pts;
    if (get_pts == null) {
      get_pts = true;
    }
    if (!elem.intersectLine) {
      throw "No intersectLine function found in " + elem.toString();
    }
    pts = [];
    for (i in lines) {
      ln = lines[i];
      ins = elem.intersectLine(ln, get_pts);
      if (ins) {
        if (!get_pts) {
          return true;
        }
        if (ins.length > 0) {
          for (j = 0, len1 = ins.length; j < len1; j++) {
            p = ins[j];
            pts.push(p);
          }
        }
      }
    }
    if (get_pts) {
      return pts;
    } else {
      return false;
    }
  };

  Line.prototype.intersectGridLine = function(line, path_only, axis) {
    var a1, a2, b1, b2;
    if (path_only == null) {
      path_only = false;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    a1 = this.get2D(axis);
    a2 = this.p1.get2D(axis);
    b1 = line.get2D(axis);
    b2 = line.p1.get2D(axis);
    if (a2.x - a1.x === 0) {
      if (b2.y - b1.y === 0 && Util.within(a1.x, b1.x, b2.x)) {
        if (path_only || Util.within(b1.y, a1.y, a2.y)) {
          return new Vector(a1.x, b1.y);
        }
      }
    } else if (a2.y - a1.y === 0) {
      if (b2.x - b1.x === 0 && Util.within(a1.y, b1.y, b2.y)) {
        if (path_only || Util.within(b1.x, a1.x, a2.x)) {
          return new Vector(b1.x, a1.y);
        }
      }
    } else {
      return false;
    }
  };

  Line.prototype.subpoints = function(num) {
    var j, ref, results, t;
    results = [];
    for (t = j = 0, ref = num; 0 <= ref ? j <= ref : j >= ref; t = 0 <= ref ? ++j : --j) {
      results.push(this.interpolate(t / num));
    }
    return results;
  };

  Line.prototype.clone = function(deep) {
    return new Line(this).to(this.p1);
  };

  return Line;

})(Pair);

this.Line = Line;

//# sourceMappingURL=.map/Line.js.map