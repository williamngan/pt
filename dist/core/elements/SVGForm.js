var SVGForm;

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
      this.cc.style["stroke-linecap"] = cap;
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

  SVGForm.prototype.enterScope = function(item) {
    if (!item || item.animateID === null) {
      throw "getScope()'s item must be added to a Space, and has an animateID property. Otherwise, use scope() instead.";
    }
    return this.scope(SVGForm._scopeID(item));
  };

  SVGForm.prototype.getScope = function(item) {
    if (!this._warn1) {
      console.warn("form.getScope(...) function is deprecated as of version 0.2.0. It is renamed as `enterScope()`.");
      this._warn1 = true;
    }
    return this.enterScope(item);
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
    return "item-" + item.animateID;
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
      var j, len, results;
      results = [];
      for (j = 0, len = pts.length; j < len; j++) {
        p = pts[j];
        results.push(SVGForm.point(ctx, p, halfsize, fill, stroke, circle));
      }
      return results;
    })();
  };

  SVGForm.prototype.points = function(ps, halfsize, isCircle) {
    var j, len, p;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    for (j = 0, len = ps.length; j < len; j++) {
      p = ps[j];
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
      var j, len, results;
      results = [];
      for (j = 0, len = pairs.length; j < len; j++) {
        ln = pairs[j];
        results.push(SVGForm.line(ctx, ln));
      }
      return results;
    })();
  };

  SVGForm.prototype.lines = function(ps) {
    var j, len, p;
    for (j = 0, len = ps.length; j < len; j++) {
      p = ps[j];
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
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = pts.length; j < ref; i = j += 1) {
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

//# sourceMappingURL=.map/SVGForm.js.map