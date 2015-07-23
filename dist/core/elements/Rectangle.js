var Rectangle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  function Rectangle() {
    Rectangle.__super__.constructor.apply(this, arguments);
    this.center = new Vector();
  }

  Rectangle.contain = function(pt, ptl, pbr) {
    return pt.x >= ptl.x && pt.x <= pbr.x && pt.y >= ptl.y && pt.y <= pbr.y && pt.z >= ptl.z && pt.z <= pbr.z;
  };

  Rectangle.prototype.toString = function() {
    var s;
    s = this.size();
    return "Rectangle x1 " + this.x + ", y1 " + this.y + ", z1 " + this.z + ", x2 " + this.p1.x + ", y2 " + this.p1.y + ", z2 " + this.p1.z + ", width " + s.x + ", height " + s.y;
  };

  Rectangle.prototype.toPointSet = function() {
    var c;
    c = this.corners();
    return new PointSet(this).to([c.topRight, c.bottomRight, c.bottomLeft, c.topLeft]);
  };

  Rectangle.prototype.to = function(args) {
    this.p1 = new Vector(Point.get(arguments));
    this.resetBounds();
    this.center = this.midpoint();
    return this;
  };

  Rectangle.prototype.setCenter = function(args) {
    var halfsize;
    if (arguments.length === 0) {
      this.center = this.midpoint();
      return;
    }
    halfsize = this.size().$divide(2);
    this.center.set(Point.get(arguments));
    this.set(this.center.$subtract(halfsize));
    this.p1.set(this.center.$add(halfsize));
    return this;
  };

  Rectangle.prototype.resizeTo = function() {
    this.p1 = new Vector(Point.get(arguments));
    this.relative();
    this.center = this.midpoint();
    return this;
  };

  Rectangle.prototype.resizeCenterTo = function() {
    var size;
    size = new Vector(Point.get(arguments)).divide(2);
    this.set(this.center.$subtract(size));
    this.p1.set(this.center.$add(size));
    return this;
  };

  Rectangle.prototype.enclose = function(rect) {
    this.set(this.min(rect));
    this.p1.set(this.p1.max(rect.p1));
    this.center = this.midpoint();
    return this;
  };

  Rectangle.prototype.$enclose = function(rect) {
    return this.clone().enclose(rect);
  };

  Rectangle.prototype.isEnclosed = function(rect) {
    var d, d2;
    d = this.$subtract(rect).multiply(this.p1.$subtract(rect.p1));
    d2 = this.size().subtract(rect.size());
    return d.x <= 0 && d.y <= 0 && d.z <= 0 && (d2.x * d2.y >= 0);
  };

  Rectangle.prototype.isLarger = function(rect) {
    var s1, s2;
    s1 = this.size();
    s2 = rect.size();
    return s1.x * s1.y > s2.x * s2.y;
  };

  Rectangle.prototype.intersectPoint = function() {
    var pt;
    pt = Point.get(arguments);
    return pt.x >= this.x && pt.x <= this.p1.x && pt.y >= this.y && pt.y <= this.p1.y && pt.z >= this.z && pt.z <= this.p1.z;
  };

  Rectangle.prototype.intersectPath = function(line, get_pts) {
    var i, len, p, pts, s, sides;
    if (get_pts == null) {
      get_pts = true;
    }
    sides = this.sides();
    pts = [];
    for (i = 0, len = sides.length; i < len; i++) {
      s = sides[i];
      p = s.intersectPath(line);
      if (p && this.intersectPoint(p)) {
        if (get_pts) {
          pts.push(p);
        } else {
          return true;
        }
      }
    }
    if (get_pts) {
      return pts;
    } else {
      return false;
    }
  };

  Rectangle.prototype.intersectLine = function(line, get_pts) {
    var i, ip1, ip2, lbound, len, p, pts, s, sides;
    if (get_pts == null) {
      get_pts = true;
    }
    ip1 = this.intersectPoint(line);
    ip2 = this.intersectPoint(line.p1);
    if (ip1 && ip2) {
      if (get_pts) {
        return [];
      }
    } else {
      true;
    }
    if (!(ip1 || ip2)) {
      lbound = line.bounds();
      if (!this.intersectRectangle(lbound, false)) {
        if (get_pts) {
          return [];
        } else {
          return false;
        }
      }
    }
    sides = this.sides();
    pts = [];
    for (i = 0, len = sides.length; i < len; i++) {
      s = sides[i];
      p = line.intersectLine(s);
      if (p) {
        if (get_pts) {
          pts.push(p);
        } else {
          return true;
        }
      }
    }
    if (get_pts) {
      return pts;
    } else {
      return false;
    }
  };

  Rectangle.prototype.intersectLines = function(lines, get_pts) {
    if (get_pts == null) {
      get_pts = true;
    }
    return Line.intersectLines(this, lines, get_pts);
  };

  Rectangle.prototype.intersectRectangle = function(rect, get_pts) {
    var i, intersected, j, len, len1, p, pts, sa, sb, sidesA, sidesB, xi, yi, zi;
    if (get_pts == null) {
      get_pts = true;
    }
    xi = (this.p1.x >= rect.x) && (this.x <= rect.p1.x);
    yi = (this.p1.y >= rect.y) && (this.y <= rect.p1.y);
    zi = (this.p1.z >= rect.z) && (this.z <= rect.p1.z);
    intersected = xi && yi && zi;
    if (!get_pts) {
      return intersected;
    }
    if (this.isEnclosed(rect)) {
      return (get_pts ? [] : true);
    }
    if (!intersected) {
      return [];
    }
    sidesA = this.sides();
    sidesB = rect.sides();
    pts = [];
    for (i = 0, len = sidesA.length; i < len; i++) {
      sa = sidesA[i];
      for (j = 0, len1 = sidesB.length; j < len1; j++) {
        sb = sidesB[j];
        p = sa.intersectGridLine(sb);
        if (p) {
          pts.push(p);
        }
      }
    }
    return pts;
  };

  Rectangle.prototype.hasIntersect = function(item, get_pts) {
    if (get_pts == null) {
      get_pts = false;
    }
    if (item instanceof Circle) {
      return item.intersectLines(this.sides(), get_pts);
    } else if (item instanceof Rectangle) {
      return this.intersectRectangle(item, get_pts);
    } else if (item instanceof PointSet || item instanceof Triangle) {
      return this.intersectLines(item.sides(), get_pts);
    } else if (item instanceof Pair) {
      return this.intersectLine(item, get_pts);
    } else if (item instanceof Point) {
      return Rectangle.contain(item, this, this.p1);
    } else {
      if (get_pts) {
        return [];
      } else {
        return false;
      }
    }
  };

  Rectangle.prototype.corners = function() {
    return {
      topLeft: new Vector(Math.min(this.x, this.p1.x), Math.min(this.y, this.p1.y), Math.max(this.z, this.p1.z)),
      topRight: new Vector(Math.max(this.x, this.p1.x), Math.min(this.y, this.p1.y), Math.min(this.z, this.p1.z)),
      bottomLeft: new Vector(Math.min(this.x, this.p1.x), Math.max(this.y, this.p1.y), Math.max(this.z, this.p1.z)),
      bottomRight: new Vector(Math.max(this.x, this.p1.x), Math.max(this.y, this.p1.y), Math.min(this.z, this.p1.z))
    };
  };

  Rectangle.prototype.sides = function() {
    var c;
    c = this.corners();
    return [new Line(c.topLeft).to(c.topRight), new Line(c.topRight).to(c.bottomRight), new Line(c.bottomRight).to(c.bottomLeft), new Line(c.bottomLeft).to(c.topLeft)];
  };

  Rectangle.prototype.quadrants = function() {
    var c;
    c = this.corners();
    return {
      topLeft: new this.__proto__.constructor(c.topLeft).to(this.center),
      topRight: new this.__proto__.constructor(c.topRight).to(this.center),
      bottomLeft: new this.__proto__.constructor(c.bottomLeft).to(this.center),
      bottomRight: new this.__proto__.constructor(c.bottomRight).to(this.center)
    };
  };

  Rectangle.prototype.clone = function() {
    var p;
    p = new Rectangle(this).to(this.p1);
    p.to(this.p1.clone());
    return p;
  };

  return Rectangle;

})(Pair);

this.Rectangle = Rectangle;

//# sourceMappingURL=.map/Rectangle.js.map