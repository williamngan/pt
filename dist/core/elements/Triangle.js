var Triangle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Triangle = (function(superClass) {
  extend(Triangle, superClass);

  function Triangle() {
    Triangle.__super__.constructor.apply(this, arguments);
    this.p1 = new Vector(this.x - 1, this.y - 1, this.z);
    this.p2 = new Vector(this.x + 1, this.y + 1, this.z);
  }

  Triangle.prototype.to = function(args) {
    if (arguments.length > 0) {
      if (typeof arguments[0] === 'object' && arguments.length === 2) {
        this.p1.set(arguments[0]);
        this.p2.set(arguments[1]);
      } else {
        if (arguments.length < 6) {
          this.p1.set([arguments[0], arguments[1]]);
          this.p2.set([arguments[2], arguments[3]]);
        } else {
          this.p1.set([arguments[0], arguments[1], arguments[2]]);
          this.p2.set([arguments[3], arguments[4], arguments[5]]);
        }
      }
    }
    return this;
  };

  Triangle.prototype.toArray = function() {
    return [this, this.p1, this.p2];
  };

  Triangle.prototype.toString = function() {
    return "Triangle (" + this.x + ", " + this.y + ", " + this.z + "), (" + this.p1.x + ", " + this.p1.y + ", " + this.p1.z + "), (" + this.p2.x + ", " + this.p2.y + ", " + this.p2.z + ")";
  };

  Triangle.prototype.toPointSet = function() {
    var p0;
    p0 = new Vector(this);
    return new PointSet(p0).to([p0, this.p1, this.p2]);
  };

  Triangle.prototype.sides = function() {
    return [new Line(this).to(this.p1), new Line(this.p1).to(this.p2), new Line(this.p2).to(this)];
  };

  Triangle.prototype.angles = function(axis) {
    var angles;
    if (axis == null) {
      axis = Const.xy;
    }
    angles = [this.p2.$subtract(this).angleBetween(this.p1.$subtract(this), axis), this.$subtract(this.p1).angleBetween(this.p2.$subtract(this.p1), axis)];
    angles.push(Math.PI - angles[0] - angles[1]);
    return angles;
  };

  Triangle.prototype.medial = function() {
    var pts, side, sides;
    sides = this.sides();
    pts = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = sides.length; i < len; i++) {
        side = sides[i];
        results.push(side.midpoint());
      }
      return results;
    })();
    return new Triangle(pts[0]).to(pts[1], pts[2]);
  };

  Triangle.prototype.perimeter = function() {
    var lens, sides;
    sides = this.sides();
    lens = [sides[0].length(), sides[1].length(), sides[2].length()];
    return {
      sides: sides,
      value: lens[0] + lens[1] + lens[2],
      lengths: lens
    };
  };

  Triangle.prototype.area = function() {
    var hp, p;
    p = this.perimeter();
    hp = p.value / 2;
    return {
      value: Math.sqrt(hp * (hp - p.lengths[0]) * (hp - p.lengths[1]) * (hp - p.lengths[2])),
      perimeter: p
    };
  };

  Triangle.prototype.oppositeSide = function(id) {
    if (id === "p1") {
      return new Line(this).to(this.p2);
    } else if (id === "p2") {
      return new Line(this).to(this.p1);
    } else {
      return new Line(this.p1).to(this.p2);
    }
  };

  Triangle.prototype.adjacentSides = function(id) {
    if (id === "p1") {
      return [new Line(this.p1).to(this), new Line(this.p1).to(this.p2)];
    } else if (id === "p2") {
      return [new Line(this.p2).to(this), new Line(this.p2).to(this.p1)];
    } else {
      return [new Line(this).to(this.p1), new Line(this).to(this.p2)];
    }
  };

  Triangle.prototype.bisector = function(id, asLine, size) {
    var ad, bp, p;
    if (asLine == null) {
      asLine = false;
    }
    if (size == null) {
      size = 100;
    }
    ad = this.adjacentSides(id);
    p = new Vector(ad[0]);
    ad[0].moveTo(0, 0);
    ad[1].moveTo(0, 0);
    bp = ad[0].p1.bisect(ad[1].p1);
    if (asLine) {
      return new Line(p).to(bp.multiply(size).add(p));
    } else {
      return bp;
    }
  };

  Triangle.prototype.altitude = function(id) {
    if (id === "p1" || id === "p2") {
      return new Line(this[id]).to(this.oppositeSide(id).getPerpendicularFromPoint(this[id]));
    } else {
      return new Line(this).to(this.oppositeSide().getPerpendicularFromPoint(this));
    }
  };

  Triangle.prototype.centroid = function() {
    var c0, c1, c2;
    c0 = this.$divide(3);
    c1 = this.p1.$divide(3);
    c2 = this.p2.$divide(3);
    return new Vector(c0.x + c1.x + c2.x, c0.y + c1.y + c2.y, c0.z + c1.z + c2.z);
  };

  Triangle.prototype.orthocenter = function() {
    var a, b;
    a = this.altitude();
    b = this.altitude("p1");
    return a.intersectPath(b, Const.xyz);
  };

  Triangle.prototype.incenter = function() {
    var a, b;
    a = this.bisector("p0", true);
    b = this.bisector("p1", true);
    return a.intersectPath(b, Const.xyz);
  };

  Triangle.prototype.incircle = function() {
    var area, center, radius;
    center = this.incenter();
    area = this.area();
    radius = 2 * area.value / area.perimeter.value;
    return new Circle(center).setRadius(radius);
  };

  Triangle.prototype.circumcenter = function() {
    var medial, pbs;
    medial = this.medial();
    pbs = [new Line(medial).to(this.$subtract(medial).perpendicular()[0].$add(medial)), new Line(medial.p1).to(this.p1.$subtract(medial.p1).perpendicular()[0].$add(medial.p1)), new Line(medial.p2).to(this.p2.$subtract(medial.p2).perpendicular()[0].$add(medial.p2))];
    return {
      center: pbs[0].intersectPath(pbs[1], Const.xyz),
      bisectors: pbs
    };
  };

  Triangle.prototype.circumcircle = function() {
    var center, r;
    center = this.circumcenter();
    r = this.magnitude(center.center);
    return new Circle(center.center).setRadius(r);
  };

  Triangle.prototype.intersectPoint = function(p) {
    var hp, s, sides;
    sides = this.sides();
    hp = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = sides.length; i < len; i++) {
        s = sides[i];
        results.push(s.collinear(p) > 0);
      }
      return results;
    })();
    return hp[0] === hp[1] && hp[1] === hp[2];
  };

  Triangle.prototype.intersectPath = function(path, get_pts, axis) {
    var i, len, p, pts, s, sides;
    if (get_pts == null) {
      get_pts = true;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    sides = this.sides();
    pts = [];
    for (i = 0, len = sides.length; i < len; i++) {
      s = sides[i];
      p = s.intersectPath(path);
      if (p && s.withinBounds(p, axis)) {
        if (!get_pts) {
          return true;
        }
        pts.push(p);
      }
    }
    if (get_pts) {
      return pts;
    } else {
      return false;
    }
  };

  Triangle.prototype.intersectLine = function(line, get_pts, axis) {
    var i, ins, len, p, pts;
    if (get_pts == null) {
      get_pts = true;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    ins = this.intersectPath(line, true, axis);
    pts = [];
    for (i = 0, len = ins.length; i < len; i++) {
      p = ins[i];
      if (line.withinBounds(p)) {
        if (!get_pts) {
          return true;
        }
        pts.push(p);
      }
    }
    if (get_pts) {
      return pts;
    } else {
      return false;
    }
  };

  Triangle.prototype.intersectLines = function(lines, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return Line.intersectLines(this, lines, get_pts);
  };

  Triangle.prototype.intersectPath3D = function(path, get_pts) {
    var det, dir, e1, e2, inv_det, pvec, qvec, t, tvec, u, v;
    e1 = this.p1.$subtract(this);
    e2 = this.p2.$subtract(this);
    dir = path.direction().normalize();
    pvec = dir.cross(e2);
    det = e1.dot(pvec);
    if (det > -Const.epsilon && det < Const.epsilon) {
      return false;
    }
    inv_det = 1 / det;
    tvec = path.$subtract(this);
    u = tvec.dot(pvec) * inv_det;
    if (u < 0 || u > 1) {
      return false;
    }
    qvec = tvec.cross(e1);
    v = dir.dot(qvec) * inv_det;
    if (v < 0 || v > 1) {
      return false;
    }
    t = e2.dot(qvec) * inv_det;
    if (t > Const.epsilon) {
      if (get_pts) {
        return [u, v, t];
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  Triangle.prototype.intersectRectangle = function(rect, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return rect.intersectLines(this.sides(), get_pts);
  };

  Triangle.prototype.intersectCircle = function(circle, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return circle.intersectLines(this.sides(), get_pts);
  };

  Triangle.prototype.intersectTriangle = function(tri, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return tri.intersectLines(this.sides(), get_pts);
  };

  Triangle.prototype.clone = function() {
    return new Triangle(this).to(this.p1, this.p2);
  };

  return Triangle;

})(Vector);

this.Triangle = Triangle;

//# sourceMappingURL=.map/Triangle.js.map