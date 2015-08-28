var Form;

Form = (function() {
  function Form(space) {
    this.cc = space.ctx;
    this.cc.fillStyle = '#999';
    this.cc.strokeStyle = '#666';
    this.cc.lineWidth = 1;
    this.cc.font = "11px sans-serif";
    this.filled = true;
    this.stroked = true;
    this.fontSize = 11;
    this.fontFace = "sans-serif";
  }

  Form.context = function(canvas_id) {
    var cc, elem;
    elem = document.getElementById(canvas_id);
    cc = elem && elem.getContext ? elem.getContext('2d') : false;
    if (!cc) {
      throw "Cannot initiate canvas 2d context";
    }
    return cc;
  };

  Form.line = function(ctx, pair) {
    if (!pair.p1) {
      throw (pair.toString()) + " is not a Pair";
    }
    ctx.beginPath();
    ctx.moveTo(pair.x, pair.y);
    ctx.lineTo(pair.p1.x, pair.p1.y);
    return ctx.stroke();
  };

  Form.lines = function(ctx, pairs) {
    var j, len, ln, results;
    results = [];
    for (j = 0, len = pairs.length; j < len; j++) {
      ln = pairs[j];
      results.push(Form.line(ctx, ln));
    }
    return results;
  };

  Form.rect = function(ctx, pair, fill, stroke) {
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    if (!pair.p1) {
      throw "" + (pair.toString() === !a(Pair));
    }
    ctx.beginPath();
    ctx.moveTo(pair.x, pair.y);
    ctx.lineTo(pair.x, pair.p1.y);
    ctx.lineTo(pair.p1.x, pair.p1.y);
    ctx.lineTo(pair.p1.x, pair.y);
    ctx.closePath();
    if (stroke) {
      ctx.stroke();
    }
    if (fill) {
      return ctx.fill();
    }
  };

  Form.circle = function(ctx, c, fill, stroke) {
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Const.two_pi, false);
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  };

  Form.triangle = function(ctx, tri, fill, stroke) {
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    ctx.beginPath();
    ctx.moveTo(tri.x, tri.y);
    ctx.lineTo(tri.p1.x, tri.p1.y);
    ctx.lineTo(tri.p2.x, tri.p2.y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  };

  Form.point = function(ctx, pt, halfsize, fill, stroke, circle) {
    var x1, x2, y1, y2;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    if (circle == null) {
      circle = false;
    }
    if (circle) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, halfsize, 0, Const.two_pi, false);
    } else {
      x1 = pt.x - halfsize;
      y1 = pt.y - halfsize;
      x2 = pt.x + halfsize;
      y2 = pt.y + halfsize;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1, y2);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y1);
      ctx.closePath();
    }
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
    return pt;
  };

  Form.points = function(ctx, pts, halfsize, fill, stroke, circle) {
    var j, len, p, results;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = false;
    }
    if (circle == null) {
      circle = false;
    }
    results = [];
    for (j = 0, len = pts.length; j < len; j++) {
      p = pts[j];
      results.push(Form.point(ctx, p, halfsize, fill, stroke, circle));
    }
    return results;
  };

  Form.polygon = function(ctx, pts, closePath, fill, stroke) {
    var i, j, ref;
    if (closePath == null) {
      closePath = true;
    }
    if (fill == null) {
      fill = true;
    }
    if (stroke == null) {
      stroke = true;
    }
    if (pts.length <= 1) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (i = j = 1, ref = pts.length; j < ref; i = j += 1) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    if (closePath) {
      ctx.closePath();
    }
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  };

  Form.curve = function(ctx, pts) {
    return Form.polygon(ctx, pts, false, false, true);
  };

  Form.text = function(ctx, pt, txt, maxWidth) {
    return ctx.fillText(txt, pt.x, pt.y, maxWidth);
  };

  Form.prototype.fill = function(c) {
    this.cc.fillStyle = c ? c : "transparent";
    this.filled = !!c;
    return this;
  };

  Form.prototype.stroke = function(c, width, joint) {
    this.cc.strokeStyle = c ? c : "transparent";
    this.stroked = !!c;
    if (width) {
      this.cc.lineWidth = width;
    }
    if (joint) {
      this.cc.lineJoin = joint;
    }
    return this;
  };

  Form.prototype.font = function(size, face) {
    if (face == null) {
      face = this.fontFace;
    }
    this.fontSize = size;
    this.cc.font = size + "px " + face;
    return this;
  };

  Form.prototype.draw = function(shape) {
    return this.sketch(shape);
  };

  Form.prototype.sketch = function(shape) {
    shape.floor();
    if (shape instanceof Circle) {
      Form.circle(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Rectangle) {
      Form.rect(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Triangle) {
      Form.triangle(this.cc, shape, this.filled, this.stroked);
    } else if (shape instanceof Line || shape instanceof Pair) {
      Form.line(this.cc, shape);
    } else if (shape instanceof PointSet) {
      Form.polygon(this.cc, shape.points);
    } else if (shape instanceof Vector || shape instanceof Point) {
      Form.point(this.cc, shape);
    }
    return this;
  };

  Form.prototype.point = function(p, halfsize, isCircle) {
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    Form.point(this.cc, p, halfsize, this.filled, this.stroked, isCircle);
    return this;
  };

  Form.prototype.points = function(ps, halfsize, isCircle) {
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    Form.points(this.cc, ps, halfsize, this.filled, this.stroked, isCircle);
    return this;
  };

  Form.prototype.line = function(p) {
    Form.line(this.cc, p);
    return this;
  };

  Form.prototype.lines = function(ps) {
    Form.lines(this.cc, ps);
    return this;
  };

  Form.prototype.rect = function(p) {
    Form.rect(this.cc, p, this.filled, this.stroked);
    return this;
  };

  Form.prototype.circle = function(p) {
    Form.circle(this.cc, p, this.filled, this.stroked);
    return this;
  };

  Form.prototype.triangle = function(p) {
    Form.triangle(this.cc, p, this.filled, this.stroked);
    return this;
  };

  Form.prototype.polygon = function(ps, closePath) {
    Form.polygon(this.cc, ps, closePath, this.filled, this.stroked);
    return this;
  };

  Form.prototype.curve = function(ps) {
    Form.curve(this.cc, ps);
    return this;
  };

  Form.prototype.text = function(p, txt, maxWidth, xoff, yoff) {
    var pos;
    if (maxWidth == null) {
      maxWidth = 1000;
    }
    pos = new Vector(p);
    if (xoff) {
      pos.add(xoff, 0);
    }
    if (yoff) {
      pos.add(0, yoff);
    }
    this.cc.fillText(txt, pos.x, pos.y, maxWidth);
    return this;
  };

  return Form;

})();

this.Form = Form;

//# sourceMappingURL=.map/Form.js.map