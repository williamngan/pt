var Delaunay, Easing, GridCascade, Noise, ParticleEmitter, ParticleField, QuadTree, SVGForm, SVGSpace, SamplePoints, StripeBound, UI,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SVGForm = (function() {
  SVGForm._domId = 0;

  function SVGForm(space) {
    this.cc = space.ctx || {};
    this.cc.group = this.cc.group || null;
    this.cc.groupID = "ptx";
    this.cc.groupCount = 0;
    this.cc.currentID = "ptx0";
    this.cc.style = {
      fill: "#999",
      stroke: "#666",
      "stroke-width": 1,
      "stroke-linejoin": false,
      "stroke-linecap": false
    };
    this.cc.font = "11px sans-serif";
    this.cc.fontSize = 11;
    this.cc.fontFace = "sans-serif";
  }

  SVGForm.prototype.fill = function(c) {
    this.cc.style.fill = c ? c : false;
    return this;
  };

  SVGForm.prototype.stroke = function(c, width, joint, cap) {
    this.cc.style.stroke = c ? c : false;
    if (width) {
      this.cc.style["stroke-width"] = width;
    }
    if (joint) {
      this.cc.style["stroke-linejoin"] = joint;
    }
    if (cap) {
      this.cc.style["stroke-linecap"] = joint;
    }
    return this;
  };

  SVGForm.prototype.scope = function(group_id, group) {
    if (group == null) {
      group = false;
    }
    if (group) {
      this.cc.group = group;
    }
    this.cc.groupID = group_id;
    this.cc.groupCount = 0;
    this.nextID();
    return this.cc;
  };

  SVGForm.prototype.getScope = function(item) {
    if (!item || item.animateID === null) {
      throw "getScope()'s item must be added to a Space, and has an animateID property. Otherwise, use scope() instead.";
    }
    return this.scope(SVGForm._scopeID(item));
  };

  SVGForm.prototype.nextID = function() {
    this.cc.groupCount++;
    this.cc.currentID = this.cc.groupID + "-" + this.cc.groupCount;
    return this.cc.currentID;
  };

  SVGForm.id = function(ctx) {
    return ctx.currentID || "p-" + SVGForm._domId++;
  };

  SVGForm._scopeID = function(item) {
    return "item" + item.animateID;
  };

  SVGForm.style = function(elem, styles) {
    var k, st, v;
    st = [];
    for (k in styles) {
      v = styles[k];
      if (!v) {
        if (k === "fill") {
          st.push("fill: none");
        } else if (k === "stroke") {
          st.push("stroke: none");
        }
      } else {
        st.push(k + ":" + v);
      }
    }
    return DOMSpace.attr(elem, {
      style: st.join(";")
    });
  };

  SVGForm.point = function(ctx, pt, halfsize, fill, stroke, circle) {
    var elem;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = true;
    }
    if (circle == null) {
      circle = false;
    }
    elem = SVGSpace.svgElement(ctx.group, (circle ? "circle" : "rect"), SVGForm.id(ctx));
    if (!elem) {
      return;
    }
    if (circle) {
      DOMSpace.attr(elem, {
        cx: pt.x,
        cy: pt.y,
        r: halfsize
      });
    } else {
      DOMSpace.attr(elem, {
        x: pt.x - halfsize,
        y: pt.y - halfsize,
        width: halfsize + halfsize,
        height: halfsize + halfsize
      });
    }
    SVGForm.style(elem, ctx.style);
    return elem;
  };

  SVGForm.prototype.point = function(p, halfsize, isCircle) {
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    this.nextID();
    SVGForm.point(this.cc, p, halfsize, true, true, isCircle);
    return this;
  };

  SVGForm.points = function(ctx, pts, halfsize, fill, stroke, circle) {
    var p;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = true;
    }
    if (circle == null) {
      circle = false;
    }
    return (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = pts.length; l < len; l++) {
        p = pts[l];
        results.push(SVGForm.point(ctx, p, halfsize, fill, stroke, circle));
      }
      return results;
    })();
  };

  SVGForm.prototype.points = function(ps, halfsize, isCircle) {
    var l, len, p;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    for (l = 0, len = ps.length; l < len; l++) {
      p = ps[l];
      this.point(p, halfsize, isCircle);
    }
    return this;
  };

  SVGForm.line = function(ctx, pair) {
    var elem;
    if (!pair.p1) {
      throw (pair.toString()) + " is not a Pair";
    }
    elem = SVGSpace.svgElement(ctx.group, "line", SVGForm.id(ctx));
    DOMSpace.attr(elem, {
      x1: pair.x,
      y1: pair.y,
      x2: pair.p1.x,
      y2: pair.p1.y
    });
    SVGForm.style(elem, ctx.style);
    return elem;
  };

  SVGForm.prototype.line = function(p) {
    this.nextID();
    SVGForm.line(this.cc, p);
    return this;
  };

  SVGForm.lines = function(ctx, pairs) {
    var ln;
    return (function() {
      var l, len, results;
      results = [];
      for (l = 0, len = pairs.length; l < len; l++) {
        ln = pairs[l];
        results.push(SVGForm.line(ctx, ln));
      }
      return results;
    })();
  };

  SVGForm.prototype.lines = function(ps) {
    var l, len, p;
    for (l = 0, len = ps.length; l < len; l++) {
      p = ps[l];
      this.line(p);
    }
    return this;
  };

  SVGForm.rect = function(ctx, pair, fill, stroke) {
    var elem, size;
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = true;
    }
    if (!pair.p1) {
      throw "" + (pair.toString() === !a(Pair));
    }
    elem = SVGSpace.svgElement(ctx.group, "rect", SVGForm.id(ctx));
    size = pair.size();
    DOMSpace.attr(elem, {
      x: pair.x,
      y: pair.y,
      width: size.x,
      height: size.y
    });
    SVGForm.style(elem, ctx.style);
    return elem;
  };

  SVGForm.prototype.rect = function(p, checkBounds) {
    var r;
    if (checkBounds == null) {
      checkBounds = true;
    }
    this.nextID();
    r = checkBounds ? p.bounds() : p;
    SVGForm.rect(this.cc, r);
    return this;
  };

  SVGForm.circle = function(ctx, c, fill, stroke) {
    var elem;
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    elem = SVGSpace.svgElement(ctx.group, "circle", SVGForm.id(ctx));
    if (!elem) {
      return;
    }
    DOMSpace.attr(elem, {
      cx: c.x,
      cy: c.y,
      r: c.radius
    });
    SVGForm.style(elem, ctx.style);
    return elem;
  };

  SVGForm.prototype.circle = function(c) {
    this.nextID();
    SVGForm.circle(this.cc, c);
    return this;
  };

  SVGForm.polygon = function(ctx, pts, closePath, fill, stroke) {
    var elem, i, points;
    if (closePath == null) {
      closePath = true;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = true;
    }
    elem = SVGSpace.svgElement(ctx.group, (closePath ? "polygon" : "polyline"), SVGForm.id(ctx));
    if (!elem) {
      return;
    }
    if (pts.length <= 1) {
      return;
    }
    points = (function() {
      var l, ref, results;
      results = [];
      for (i = l = 0, ref = pts.length; l < ref; i = l += 1) {
        results.push(pts[i].x + "," + pts[i].y);
      }
      return results;
    })();
    DOMSpace.attr(elem, {
      points: points.join(" ")
    });
    SVGForm.style(elem, ctx.style);
    return elem;
  };

  SVGForm.prototype.polygon = function(ps, closePath) {
    this.nextID();
    SVGForm.polygon(this.cc, ps, closePath);
    return this;
  };

  SVGForm.triangle = function(ctx, tri, fill, stroke) {
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    return SVGForm.polygon(ctx, tri.toArray());
  };

  SVGForm.prototype.triangle = function(tri) {
    this.nextID();
    SVGForm.triangle(this.cc, tri);
    return this;
  };

  SVGForm.curve = function(ctx, pts, closePath) {
    if (closePath == null) {
      closePath = false;
    }
    return SVGForm.polygon(ctx, pts, closePath);
  };

  SVGForm.prototype.curve = function(ps, closePath) {
    if (closePath == null) {
      closePath = false;
    }
    this.nextID();
    SVGForm.curve(this.cc, ps, closePath);
    return this;
  };

  SVGForm.text = function(ctx, pt, txt, maxWidth, dx, dy) {
    var elem;
    if (maxWidth == null) {
      maxWidth = 0;
    }
    if (dx == null) {
      dx = 0;
    }
    if (dy == null) {
      dy = 0;
    }
    elem = SVGSpace.svgElement(ctx.group, "text", SVGForm.id(ctx));
    if (!elem) {
      return;
    }
    DOMSpace.attr(elem, {
      "pointer-events": "none",
      x: pt.x,
      y: pt.y,
      dx: 0,
      dy: 0
    });
    elem.textContent = txt;
    SVGForm.style(elem, {
      fill: ctx.style.fill,
      stroke: ctx.style.stroke,
      "font-family": ctx.fontFace || false,
      "font-size": ctx.fontSize || false
    });
    return elem;
  };

  SVGForm.prototype.text = function(p, txt, maxWidth, xoff, yoff) {
    if (maxWidth == null) {
      maxWidth = 1000;
    }
    this.nextID();
    SVGForm.text(this.cc, p, txt, maxWidth, xoff, yoff);
    return this;
  };

  SVGForm.prototype.font = function(size, face) {
    if (face == null) {
      face = false;
    }
    this.cc.fontFace = face;
    this.cc.fontSize = size;
    this.cc.font = size + "px " + face;
    return this;
  };

  SVGForm.prototype.draw = function(shape) {
    return this.sketch(shape);
  };

  SVGForm.prototype.sketch = function(shape) {
    shape.floor();
    if (shape instanceof Circle) {
      SVGForm.circle(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Rectangle) {
      SVGForm.rect(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Triangle) {
      SVGForm.triangle(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Line || shape instanceof Pair) {
      SVGForm.line(this.cc, shape);
    } else if (shape instanceof PointSet) {
      SVGForm.polygon(this.cc, shape.points);
    } else if (shape instanceof Vector || shape instanceof Point) {
      SVGForm.point(this.cc, shape);
    }
    return this;
  };

  return SVGForm;

})();

this.SVGForm = SVGForm;

SVGSpace = (function(superClass) {
  extend(SVGSpace, superClass);

  function SVGSpace(id, bgcolor, context) {
    if (id == null) {
      id = 'pt_space';
    }
    if (bgcolor == null) {
      bgcolor = false;
    }
    if (context == null) {
      context = 'svg';
    }
    SVGSpace.__super__.constructor.apply(this, arguments);
    this.bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.bg.setAttribute("id", id + "_bg");
    this.bg.setAttribute("fill", bgcolor);
    this.space.appendChild(this.bg);
  }

  SVGSpace.prototype._createSpaceElement = function() {
    this.space = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.space.setAttribute("id", this.id);
    return this.appended = false;
  };

  SVGSpace.svgElement = function(parent, name, id) {
    var elem;
    if (!parent || !parent.appendChild) {
      throw "parent parameter needs to be a DOM node";
    }
    elem = document.querySelector("#" + id);
    if (!elem) {
      elem = document.createElementNS("http://www.w3.org/2000/svg", name);
      elem.setAttribute("id", id);
      elem.setAttribute("class", id.substring(0, id.indexOf("-")));
      parent.appendChild(elem);
    }
    return elem;
  };

  SVGSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    this.size.set(w, h);
    this.center = new Vector(w / 2, h / 2);
    this.space.setAttribute("width", w);
    this.space.setAttribute("height", h);
    this.bg.setAttribute("width", w);
    this.bg.setAttribute("height", h);
    ref = this.items;
    for (k in ref) {
      p = ref[k];
      if (p.onSpaceResize != null) {
        p.onSpaceResize(w, h, evt);
      }
    }
    return this;
  };

  SVGSpace.prototype.remove = function(item) {
    var l, len, t, temp;
    temp = this.space.querySelectorAll("." + SVGForm._scopeID(item));
    for (l = 0, len = temp.length; l < len; l++) {
      t = temp[l];
      t.parentNode.removeChild(t);
    }
    delete this.items[item.animateID];
    return this;
  };

  SVGSpace.prototype.removeAll = function() {
    while (this.space.firstChild) {
      this.space.removeChild(this.space.firstChild);
      return this;
    }
  };

  return SVGSpace;

})(DOMSpace);

this.SVGSpace = SVGSpace;

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

GridCascade = (function(superClass) {
  extend(GridCascade, superClass);

  function GridCascade() {
    GridCascade.__super__.constructor.apply(this, arguments);
    this.startRow = 0;
  }

  GridCascade.prototype.resetLayout = function() {
    this.layout = [];
    return this.startRow = 0;
  };

  GridCascade.prototype.occupy = function(x, y, w, h) {
    var c, l, r, ref, ref1, ref2, ref3, u;
    for (c = l = ref = x, ref1 = w + x; ref <= ref1 ? l < ref1 : l > ref1; c = ref <= ref1 ? ++l : --l) {
      for (r = u = ref2 = y, ref3 = h + y; ref2 <= ref3 ? u < ref3 : u > ref3; r = ref2 <= ref3 ? ++u : --u) {
        if (this.layout[r] == null) {
          this.layout[r] = [];
        }
        this.layout[r][c] = 1;
      }
    }
    return this;
  };

  GridCascade.prototype.findStartRow = function() {
    var c, index, l, r, ref, ref1, ref2, u;
    index = this.startRow;
    for (r = l = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? l < ref1 : l > ref1; r = ref <= ref1 ? ++l : --l) {
      index = r;
      for (c = u = 0, ref2 = this.columns; 0 <= ref2 ? u < ref2 : u > ref2; c = 0 <= ref2 ? ++u : --u) {
        if (this.layout[r] != null) {
          if ((this.layout[r][c] == null) || this.layout[r][c] <= 0) {
            return index;
          }
        }
      }
    }
    return index;
  };

  GridCascade.prototype.fit = function(cols, rows) {
    var allRowsFree, b, cell, colCount, colSize, currCol, currRow, freeCol, l, rc, ref, ref1, ref2, ref3, ref4, u, z;
    colSize = Math.min(cols, this.columns);
    for (currRow = l = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? l < ref1 : l > ref1; currRow = ref <= ref1 ? ++l : --l) {
      colCount = colSize;
      freeCol = 0;
      if (currRow + rows >= this.rows) {
        this.rows += rows;
      }
      if (this.layout[currRow] == null) {
        this.layout[currRow] = [];
      }
      for (currCol = u = 0, ref2 = this.columns; 0 <= ref2 ? u < ref2 : u > ref2; currCol = 0 <= ref2 ? ++u : --u) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol = currCol + 1;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount === 0) {
            allRowsFree = true;
            if (rows > 1) {
              for (rc = z = ref3 = currRow, ref4 = currRow + rows; ref3 <= ref4 ? z < ref4 : z > ref4; rc = ref3 <= ref4 ? ++z : --z) {
                if (rc <= this.rows && (this.layout[rc] != null) && this.layout[rc][freeCol] > 0) {
                  allRowsFree = false;
                  break;
                }
              }
            }
            if (allRowsFree) {
              this.occupy(freeCol, currRow, colSize, rows);
              if (currRow > this.startRow) {
                this.startRow = this.findStartRow();
              }
              b = new Rectangle(this.$add(this.cell.size.$multiply(freeCol, currRow)));
              b.resizeTo(this.cell.size.$multiply(colSize, rows));
              return {
                row: currRow,
                column: freeCol,
                columnSize: colSize,
                rowSize: rows,
                bound: b
              };
            }
          }
        }
      }
    }
    console.error("cannot fit " + currRow + " " + freeCol + " " + cols + " " + rows);
    return false;
  };

  return GridCascade;

})(Grid);

this.GridCascade = GridCascade;

ParticleEmitter = (function(superClass) {
  extend(ParticleEmitter, superClass);

  function ParticleEmitter() {
    ParticleEmitter.__super__.constructor.apply(this, arguments);
    this.system = null;
    this.lastTime = 0;
    this.period = 0;
    this.animateID = -1;
  }

  ParticleEmitter.prototype.init = function(system) {
    return this.system = system;
  };

  ParticleEmitter.prototype.frequency = function(f) {
    this.period = 1000 / f;
    return this;
  };

  ParticleEmitter.prototype.emit = function() {};

  ParticleEmitter.prototype.animate = function(time, frame, ctx) {
    if (time - this.lastTime > this.period) {
      this.emit();
      return this.lastTime = time;
    }
  };

  return ParticleEmitter;

})(Vector);

this.ParticleEmitter = ParticleEmitter;

ParticleField = (function(superClass) {
  extend(ParticleField, superClass);

  function ParticleField() {
    ParticleField.__super__.constructor.apply(this, arguments);
    this.system = void 0;
  }

  ParticleField.prototype.check = function(particles, removal) {
    var l, len, p, temp;
    if (removal == null) {
      removal = false;
    }
    temp = [];
    for (l = 0, len = particles.length; l < len; l++) {
      p = particles[l];
      if (this.hasIntersect(p)) {
        this.work(p);
      } else {
        temp.push(p);
      }
    }
    return (removal ? temp : particles);
  };

  ParticleField.prototype.work = function(p) {};

  return ParticleField;

})(Rectangle);

this.ParticleField = ParticleField;

QuadTree = (function(superClass) {
  extend(QuadTree, superClass);

  function QuadTree() {
    QuadTree.__super__.constructor.apply(this, arguments);
    this.quads = false;
    this.items = [];
    this.depth = 0;
    this.max_depth = 6;
    this.max_items = 2;
  }

  QuadTree.prototype.getQuads = function(p, list) {
    var k, q, ref;
    if (list == null) {
      list = [];
    }
    if (this.intersectPoint(p)) {
      list.push(this);
      if (this.quads) {
        ref = this.quads;
        for (k in ref) {
          q = ref[k];
          if (q.intersectPoint(p)) {
            q.getQuads(p, list);
          }
        }
      }
    }
    return list;
  };

  QuadTree.prototype.getItems = function(p) {
    var k, q, ref;
    if (this.intersectPoint(p)) {
      if (!this.quads) {
        return this.items;
      }
      if (this.quads) {
        ref = this.quads;
        for (k in ref) {
          q = ref[k];
          if (q.intersectPoint(p)) {
            return q.getItems(p);
          }
        }
      }
    }
    return [];
  };

  QuadTree.prototype.addToQuad = function(item) {
    var _depth, k, q, ref;
    if (!item) {
      return -1;
    }
    if (this.quads) {
      ref = this.quads;
      for (k in ref) {
        q = ref[k];
        _depth = q.addToQuad(item);
        if (_depth > 0) {
          return _depth;
        }
      }
      return -1;
    }
    if (!this.quads && this.intersectPoint(item)) {
      if (this.items.length >= this.max_items) {
        if (this.depth < this.max_depth) {
          this.splitQuad();
          return this.addToQuad(item);
        } else {
          return -1;
        }
      } else {
        this.items.push(item);
        return this.depth;
      }
    }
    return -1;
  };

  QuadTree.prototype.splitQuad = function() {
    var _depth, i, item, k, l, len, len1, q, ref, ref1, ref2, results, t, u;
    this.quads = this.quadrants();
    ref = this.quads;
    for (k in ref) {
      q = ref[k];
      q.depth = this.depth + 1;
    }
    ref1 = this.items;
    for (i = l = 0, len = ref1.length; l < len; i = ++l) {
      item = ref1[i];
      _depth = this.addToQuad(item);
      if (_depth > this.depth) {
        this.items[i] = null;
      }
    }
    ref2 = this.items;
    results = [];
    for (u = 0, len1 = ref2.length; u < len1; u++) {
      t = ref2[u];
      if (!t) {
        results.push(this.items.splice(t, 1));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  QuadTree.prototype.resetQuad = function() {
    var k, q, ref;
    this.items = [];
    if (this.quads) {
      ref = this.quads;
      for (k in ref) {
        q = ref[k];
        q.resetQuad();
      }
      return this.quads = false;
    }
  };

  return QuadTree;

})(Rectangle);

this.QuadTree = QuadTree;

SamplePoints = (function(superClass) {
  extend(SamplePoints, superClass);

  function SamplePoints() {
    SamplePoints.__super__.constructor.apply(this, arguments);
    this.bestcandidate = null;
    this.poisson = null;
    this.bound = null;
    this.boundsize = null;
  }

  SamplePoints.prototype.setBounds = function(b, anchor) {
    if (anchor == null) {
      anchor = false;
    }
    if (anchor) {
      this.set(b);
    }
    this.bound = new Rectangle(this).size(b.size());
    return this;
  };

  SamplePoints.prototype.bestCandidateSampler = function() {
    this.points = [];
    if (!this.bound) {
      this.bound = new Rectangle().size(500, 500);
    }
    this.boundsize = this.bound.size();
    this.bestcandidate = {
      halfsize: this.boundsize.$divide(2),
      quartersize: this.boundsize.$divide(4),
      maxDist: this.boundsize.x * this.boundsize.x + this.boundsize.y * this.boundsize.y
    };
    return this;
  };

  SamplePoints.prototype.poissonSampler = function(radius) {
    var cellsize;
    this.points = [];
    if (!this.bound) {
      this.bound = new Rectangle().size(500, 500);
    }
    this.boundsize = this.bound.size();
    cellsize = radius * Math.SQRT1_2;
    this.poisson = {
      grid: [],
      gridWidth: Math.ceil(this.boundsize.x / cellsize),
      gridHeight: Math.ceil(this.boundsize.y / cellsize),
      cellSize: cellsize,
      radius: radius,
      radius2: radius * radius,
      R: 3 * radius * radius,
      queue: [],
      queueSize: 0,
      sampleSize: 0,
      sincos: Util.sinCosTable()
    };
    return this;
  };

  SamplePoints.prototype.sample = function(numSamples, type) {
    var a, best, bestDist, i, j, l, nearest, p, r, ref, ref1, s, u, x, y;
    if (numSamples == null) {
      numSamples = 10;
    }
    if (type == null) {
      type = false;
    }
    if (this.poisson && type === 'poisson') {
      if (this.poisson.sampleSize > 0 && this.poisson.queueSize === 0) {
        return false;
      }
      if (!this.poisson.sampleSize) {
        return this._poissonSample(this.bound.x + this.boundsize.x / 2, this.bound.y + this.boundsize.y / 2);
      }
      while (this.poisson.queueSize) {
        i = Math.floor(Math.random() * this.poisson.queueSize);
        s = this.poisson.queue[i];
        for (j = l = 0, ref = numSamples; l < ref; j = l += 1) {
          a = Math.floor(360 * Math.random());
          r = Math.sqrt(Math.random() * this.poisson.R + this.poisson.radius2);
          x = s.x + r * this.poisson.sincos.cos[a];
          y = s.y + r * this.poisson.sincos.sin[a];
          if (x >= this.bound.x && x < this.boundsize.x && y >= this.bound.y && y < this.boundsize.y && this._poissonCheck(x, y)) {
            return this._poissonSample(x, y);
          }
        }
        this.poisson.queue[i] = this.poisson.queue[--this.poisson.queueSize];
        this.poisson.queue.length = this.poisson.queueSize;
      }
      return true;
    } else if (this.bestcandidate) {
      best = null;
      bestDist = -1;
      for (i = u = 0, ref1 = numSamples; u < ref1; i = u += 1) {
        p = new Vector(this.bound.x + this.boundsize.x * Math.random(), this.bound.y + this.boundsize.y * Math.random());
        if (this.points.length === 0) {
          best = p;
          break;
        } else {
          nearest = this._bestCandidateCheck(p);
          if (nearest > bestDist) {
            best = p;
            bestDist = nearest;
          }
        }
      }
      if (best) {
        this.points.push(best);
      }
      return best;
    }
  };

  SamplePoints.prototype._bestCandidateCheck = function(p) {
    var _dist, dist, dx, dy, halfbound, it, l, len, matches, w;
    _dist = this.bestcandidate.maxDist;
    halfbound = new Rectangle(p.x - this.bestcandidate.quartersize.x, p.y - this.bestcandidate.quartersize.y).size(this.bestcandidate.halfsize.x, this.bestcandidate.halfsize.y);
    matches = (function() {
      var l, len, ref, results;
      ref = this.points;
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        it = ref[l];
        if (halfbound.intersectPoint(it)) {
          results.push(it);
        }
      }
      return results;
    }).call(this);
    for (l = 0, len = matches.length; l < len; l++) {
      w = matches[l];
      dx = w.x - p.x;
      dy = w.y - p.y;
      dist = dx * dx + dy * dy;
      if (dist < _dist) {
        _dist = dist;
      }
    }
    return _dist;
  };

  SamplePoints.prototype._poissonSample = function(x, y) {
    var s;
    s = new Point(x, y);
    this.poisson.queue.push(s);
    this.poisson.grid[this.poisson.gridWidth * (y / this.poisson.cellSize | 0) + (x / this.poisson.cellSize | 0)] = s;
    this.poisson.sampleSize++;
    this.poisson.queueSize++;
    return s;
  };

  SamplePoints.prototype._poissonCheck = function(x, y) {
    var dx, dy, i, i0, i1, j, j0, j1, l, o, ref, ref1, ref2, ref3, s, u;
    i = Math.floor(x / this.poisson.cellSize);
    j = Math.floor(y / this.poisson.cellSize);
    i0 = Math.max(i - 2, 0);
    j0 = Math.max(j - 2, 0);
    i1 = Math.min(i + 3, this.poisson.gridWidth);
    j1 = Math.min(j + 3, this.poisson.gridHeight);
    for (j = l = ref = j0, ref1 = j1; l < ref1; j = l += 1) {
      o = j * this.poisson.gridWidth;
      for (i = u = ref2 = i0, ref3 = i1; u < ref3; i = u += 1) {
        s = this.poisson.grid[o + i];
        if (s) {
          dx = s.x - x;
          dy = s.y - y;
          if (dx * dx + dy * dy < this.poisson.radius2) {
            return false;
          }
        }
      }
    }
    return true;
  };

  SamplePoints.bestCandidate = function(bound, items, samples) {
    var _nearest, best, bestDist, halfsize, i, l, maxDist, nearest, p, quartersize, ref, size;
    if (samples == null) {
      samples = 10;
    }
    size = bound.size();
    halfsize = size.$divide(2);
    quartersize = size.$divide(4);
    maxDist = size.x * size.x + size.y * size.y;
    _nearest = function(p) {
      var _dist, dist, dx, dy, halfbound, it, l, len, matches, w;
      _dist = maxDist;
      halfbound = new Rectangle(p.x - quartersize.x, p.y - quartersize.y).size(halfsize.x, halfsize.y);
      matches = (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = items.length; l < len; l++) {
          it = items[l];
          if (halfbound.intersetPoint(it)) {
            results.push(it);
          }
        }
        return results;
      })();
      for (l = 0, len = matches.length; l < len; l++) {
        w = matches[l];
        dx = w.x - p.x;
        dy = w.y - p.y;
        dist = dx * dx + dy * dy;
        if (dist < _dist) {
          _dist = dist;
        }
      }
      return _dist;
    };
    best = null;
    bestDist = -1;
    for (i = l = 0, ref = samples; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
      p = new Vector(bound.x + size.x * Math.random(), bound.y + size.y * Math.random());
      if (items.length === 0) {
        return p;
      } else {
        nearest = _nearest(p);
        if (nearest > bestDist) {
          best = p;
          bestDist = nearest;
        }
      }
    }
    return best;
  };

  return SamplePoints;

})(PointSet);

this.SamplePoints = SamplePoints;

StripeBound = (function(superClass) {
  extend(StripeBound, superClass);

  function StripeBound() {
    StripeBound.__super__.constructor.apply(this, arguments);
    this.frequency = new Point();
    this.stripes = new Point();
    this.method = 'frequency';
    this.mask = null;
  }

  StripeBound.prototype.setFrequency = function(x, y) {
    this.frequency = new Vector(x, y);
    return this.method = 'frequency';
  };

  StripeBound.prototype.setStripes = function(x, y) {
    this.stripes = new Point(x, y);
    return this.method = 'stripes';
  };

  StripeBound.prototype.getStripes = function() {
    var d, diff, dx, dy, freq, l, p, ref, ref1, result, size, u;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = l = 0, ref = freq.y - 1; 0 <= ref ? l <= ref : l >= ref; d = 0 <= ref ? ++l : --l) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy + diff.y).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = u = 0, ref1 = freq.x - 1; 0 <= ref1 ? u <= ref1 : u >= ref1; d = 0 <= ref1 ? ++u : --u) {
      dx = diff.x * d;
      p = new Pair(dx, 0).to(dx + diff.x + 0.5, size.y).add(this);
      p.p1.add(this);
      result.columns.push(p);
    }
    return result;
  };

  StripeBound.prototype.getStripeLines = function() {
    var d, diff, dx, dy, freq, l, p, ref, ref1, result, size, u;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = l = 0, ref = freq.y; 0 <= ref ? l <= ref : l >= ref; d = 0 <= ref ? ++l : --l) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = u = 0, ref1 = freq.x; 0 <= ref1 ? u <= ref1 : u >= ref1; d = 0 <= ref1 ? ++u : --u) {
      dx = diff.x * d;
      p = new Pair(dx, 0).to(dx, size.y).add(this);
      p.p1.add(this);
      result.columns.push(p);
    }
    return result;
  };

  StripeBound.prototype.setMask = function(w, h, anchor) {
    var diff, sz;
    if (anchor == null) {
      anchor = false;
    }
    this.mask = new Rectangle(this.x, this.y);
    sz = this.size();
    if (!anchor) {
      diff = sz.$subtract(w, h).divide(2);
      anchor = new Point(this.x + diff.x, this.y + diff.y);
    } else {
      anchor = this.$add(anchor);
    }
    return this.mask.set(anchor.x, anchor.y).size(w, h);
  };

  StripeBound.prototype.anchorMask = function() {
    var d;
    d = this.$subtract(this.mask);
    this.moveBy(d);
    return this.mask.moveBy(d);
  };

  return StripeBound;

})(Rectangle);

this.StripeBound = StripeBound;

UI = (function(superClass) {
  extend(UI, superClass);

  UI.dragTarget = null;

  function UI() {
    UI.__super__.constructor.apply(this, arguments);
    this.dragging = false;
  }

  UI.prototype.animate = function(time, frame, ctx) {
    ctx.fillStyle = '#f00';
    return Form.rect(ctx, this);
  };

  UI.prototype.onMouseAction = function(type, x, y, evt) {
    if (this.intersectPoint(x, y)) {
      if (type === 'drag' && !UI.dragTarget) {
        this.dragging = true;
        UI.dragTarget = this;
      }
    }
    if (this.dragging && type === 'move') {
      this.moveTo(x, y).moveBy(this.size().multiply(-0.5));
    }
    if (type === 'drop') {
      this.dragging = false;
      return UI.dragTarget = null;
    }
  };

  return UI;

})(Rectangle);

this.UI = UI;

Noise = (function(superClass) {
  extend(Noise, superClass);

  Noise.prototype.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

  Noise.prototype.simplex = [[0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0], [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0], [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0], [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]];

  function Noise() {
    var i;
    Noise.__super__.constructor.apply(this, arguments);
    this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 9, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    this.perm = (function() {
      var l, results;
      results = [];
      for (i = l = 0; l < 512; i = ++l) {
        results.push(this.p[i & 255]);
      }
      return results;
    }).call(this);
  }

  Noise.prototype.seed = function(seed) {
    var i, l, results, v;
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }
    results = [];
    for (i = l = 0; l <= 255; i = ++l) {
      v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      results.push(this.perm[i] = this.perm[i + 256] = v);
    }
    return results;
  };

  Noise.prototype._dot = function(g, x, y) {
    return g[0] * x + g[1] * y;
  };

  Noise.prototype.perlin2d = function(xin, yin) {
    var _fade, i, j, n00, n01, n10, n11, tx, x, y;
    if (xin == null) {
      xin = this.x;
    }
    if (yin == null) {
      yin = this.y;
    }
    _fade = function(f) {
      return f * f * f * (f * (f * 6 - 15) + 10);
    };
    i = Math.floor(xin) % 255;
    j = Math.floor(yin) % 255;
    x = xin - i;
    y = yin - j;
    n00 = this._dot(this.grad3[(i + this.perm[j]) % 12], x, y);
    n01 = this._dot(this.grad3[(i + this.perm[j + 1]) % 12], x, y - 1);
    n10 = this._dot(this.grad3[(i + 1 + this.perm[j]) % 12], x - 1, y);
    n11 = this._dot(this.grad3[(i + 1 + this.perm[j + 1]) % 12], x - 1, y - 1);
    tx = _fade(x);
    return Util.lerp(Util.lerp(n00, n10, tx), Util.lerp(n01, n11, tx), _fade(y));
  };

  Noise.prototype.simplex2d = function(xin, yin) {
    var F2, G2, X0, Y0, gi0, gi1, gi2, i, i1, ii, j, j1, jj, n0, n1, n2, s, t, t0, t1, t2, x0, x1, x2, y0, y1, y2;
    if (xin == null) {
      xin = this.x;
    }
    if (yin == null) {
      yin = this.y;
    }
    F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    s = (xin + yin) * F2;
    i = Math.floor(xin + s);
    j = Math.floor(yin + s);
    G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    t = (i + j) * G2;
    X0 = i - t;
    Y0 = j - t;
    x0 = xin - X0;
    y0 = yin - Y0;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    x1 = x0 - i1 + G2;
    y1 = y0 - j1 + G2;
    x2 = x0 - 1.0 + 2.0 * G2;
    y2 = y0 - 1.0 + 2.0 * G2;
    ii = i & 255;
    jj = j & 255;
    gi0 = this.perm[ii + this.perm[jj]] % 12;
    gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
    t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) {
      n0 = 0.0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * this._dot(this.grad3[gi0], x0, y0);
    }
    t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) {
      n1 = 0.0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * this._dot(this.grad3[gi1], x1, y1);
    }
    t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) {
      n2 = 0.0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * this._dot(this.grad3[gi2], x2, y2);
    }
    return 70.0 * (n0 + n1 + n2);
  };

  return Noise;

})(Vector);

Delaunay = (function(superClass) {
  extend(Delaunay, superClass);

  function Delaunay() {
    Delaunay.__super__.constructor.apply(this, arguments);
    this.mesh = [];
  }

  Delaunay.prototype.generate = function() {
    var c, circum, closed, dx, dy, edges, i, indices, j, l, len, len1, n, open, opened, pts, ref, st, u, z;
    if (this.points.length < 3) {
      return;
    }
    n = this.points.length;
    indices = [];
    for (i = l = 0, ref = n; l < ref; i = l += 1) {
      indices[i] = i;
    }
    indices.sort((function(_this) {
      return function(i, j) {
        return _this.points[j].x - _this.points[i].x;
      };
    })(this));
    pts = this.points.slice();
    st = this._supertriangle();
    pts.push(new Vector(st), new Vector(st.p1), new Vector(st.p2));
    opened = [this._circum(n, n + 1, n + 2, st)];
    closed = [];
    edges = [];
    for (u = 0, len = indices.length; u < len; u++) {
      c = indices[u];
      edges = [];
      j = opened.length;
      while (j--) {
        circum = opened[j];
        dx = pts[c].x - circum.circle.x;
        dy = pts[c].y - circum.circle.y;
        if (dx > 0 && dx * dx > circum.circle.radius * circum.circle.radius) {
          closed.push(circum);
          opened.splice(j, 1);
          continue;
        }
        if (dx * dx + dy * dy - circum.circle.radius * circum.circle.radius > Const.epsilon) {
          continue;
        }
        edges.push(circum.i, circum.j, circum.j, circum.k, circum.k, circum.i);
        opened.splice(j, 1);
      }
      this._dedupe(edges);
      j = edges.length;
      while (j > 1) {
        opened.push(this._circum(edges[--j], edges[--j], c, null, pts));
      }
    }
    for (z = 0, len1 = opened.length; z < len1; z++) {
      open = opened[z];
      if (open.i < n && open.j < n && open.k < n) {
        closed.push(open);
      }
    }
    this.mesh = closed;
    return this.mesh;
  };

  Delaunay.prototype._supertriangle = function() {
    var d, dmax, l, len, maxPt, mid, minPt, p, ref;
    minPt = new Vector();
    maxPt = new Vector();
    ref = this.points;
    for (l = 0, len = ref.length; l < len; l++) {
      p = ref[l];
      minPt.min(p);
      maxPt.max(p);
    }
    d = maxPt.$subtract(minPt);
    mid = minPt.$add(maxPt).divide(2);
    dmax = Math.max(d.x, d.y);
    return new Triangle(mid.$subtract(20 * dmax, dmax)).to(mid.$add(0, 20 * dmax), mid.$add(20 * dmax, -dmax));
  };

  Delaunay.prototype._triangle = function(i, j, k, pts) {
    if (pts == null) {
      pts = this.points;
    }
    return new Triangle(pts[i]).to(pts[j], pts[k]);
  };

  Delaunay.prototype._circum = function(i, j, k, tri, pts) {
    if (tri == null) {
      tri = null;
    }
    if (pts == null) {
      pts = this.points;
    }
    tri = tri || this._triangle(i, j, k, pts);
    return {
      i: i,
      j: j,
      k: k,
      triangle: tri,
      circle: tri.circumcircle()
    };
  };

  Delaunay.prototype._dedupe = function(edges) {
    var a, b, i, j, m, n;
    j = edges.length;
    while (j > 1) {
      b = edges[--j];
      a = edges[--j];
      i = j;
      while (i > 1) {
        n = edges[--i];
        m = edges[--i];
        if ((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
    return edges;
  };

  return Delaunay;

})(PointSet);

this.Delaunay = Delaunay;

//# sourceMappingURL=pt-extend.js.map