var Pt = {}; (function() {
/* Licensed under the Apache License, Version 2.0. (http://www.apache.org/licenses/LICENSE-2.0). Copyright 2015-2016 William Ngan. (https://github.com/williamngan/pt/) */
var CanvasSpace, Circle, Color, Const, Curve, DOMSpace, Delaunay, Form, Grid, GridCascade, Line, Matrix, Noise, Pair, Particle, ParticleEmitter, ParticleField, ParticleSystem, Point, PointSet, QuadTree, Rectangle, SVGForm, SVGSpace, SamplePoints, Shaping, Space, StripeBound, Timer, Triangle, UI, Util, Vector,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

Const = (function() {
  function Const() {}

  Const.xy = 'xy';

  Const.yz = 'yz';

  Const.xz = 'xz';

  Const.xyz = 'xyz';

  Const.identical = -1;

  Const.right = 3;

  Const.bottom_right = 4;

  Const.bottom = 5;

  Const.bottom_left = 6;

  Const.left = 7;

  Const.top_left = 0;

  Const.top = 1;

  Const.top_right = 2;

  Const.sideLabels = ["identical", "right", "bottom right", "bottom", "bottom left", "left", "top left", "top", "top right"];

  Const.epsilon = 0.0001;

  Const.pi = Math.PI;

  Const.two_pi = 6.283185307179586;

  Const.half_pi = 1.5707963267948966;

  Const.quarter_pi = 0.7853981633974483;

  Const.one_degree = 0.017453292519943295;

  Const.rad_to_deg = 57.29577951308232;

  Const.deg_to_rad = 0.017453292519943295;

  Const.gravity = 9.81;

  Const.newton = 0.10197;

  Const.gaussian = 0.3989422804014327;

  return Const;

})();

this.Const = Const;

Matrix = (function() {
  function Matrix() {}

  Matrix.rotateAnchor2D = function(radian, anchor, axis) {
    var a, cosA, sinA;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    cosA = Math.cos(radian);
    sinA = Math.sin(radian);
    return [cosA, sinA, 0, -sinA, cosA, 0, a.x * (1 - cosA) + a.y * sinA, a.y * (1 - cosA) - a.x * sinA, 1];
  };

  Matrix.reflectAnchor2D = function(line, axis) {
    var ang2, cosA, inc, sinA;
    if (axis == null) {
      axis = Const.xy;
    }
    inc = line.intercept(axis);
    ang2 = Math.atan(inc.slope) * 2;
    cosA = Math.cos(ang2);
    sinA = Math.sin(ang2);
    return [cosA, sinA, 0, sinA, -cosA, 0, -inc.yi * sinA, inc.yi + inc.yi * cosA, 1];
  };

  Matrix.shearAnchor2D = function(sx, sy, anchor, axis) {
    var a, tx, ty;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    tx = Math.tan(sx);
    ty = Math.tan(sy);
    return [1, tx, 0, ty, 1, 0, -a.y * ty, -a.x * tx, 1];
  };

  Matrix.scaleAnchor2D = function(sx, sy, anchor, axis) {
    var a;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    return [sx, 0, 0, 0, sy, 0, -a.x * sx + a.x, -a.y * sy + a.y, 1];
  };

  Matrix.scale2D = function(x, y) {
    return [x, 0, 0, 0, y, 0, 0, 0, 1];
  };

  Matrix.shear2D = function(x, y) {
    return [1, Math.tan(x), 0, Math.tan(y), 1, 0, 0, 0, 1];
  };

  Matrix.rotate2D = function(cosA, sinA) {
    return [cosA, sinA, 0, -sinA, cosA, 0, 0, 0, 1];
  };

  Matrix.translate2D = function(x, y) {
    return [1, 0, 0, 0, 1, 0, x, y, 1];
  };

  Matrix.transform2D = function(pt, m, axis, byValue) {
    var v, x, y;
    if (axis == null) {
      axis = Const.xy;
    }
    if (byValue == null) {
      byValue = false;
    }
    v = pt.get2D(axis);
    x = v.x * m[0] + v.y * m[3] + m[6];
    y = v.x * m[1] + v.y * m[4] + m[7];
    v.x = x;
    v.y = y;
    v = v.get2D(axis, true);
    if (!byValue) {
      pt.set(v);
      return pt;
    }
    return v;
  };

  return Matrix;

})();

this.Matrix = Matrix;

Util = (function() {
  function Util() {}

  Util.toRadian = function(angle) {
    return angle * Const.deg_to_rad;
  };

  Util.toDegree = function(radian) {
    return radian * Const.rad_to_deg;
  };

  Util.toHexColor = function(number) {
    var h;
    h = Math.floor(number).toString(16);
    if (h.length === 1) {
      return "0" + h;
    } else {
      return h;
    }
  };

  Util.toRGBColor = function(hexString, asRGBA, opacity) {
    var b, g, r;
    if (asRGBA == null) {
      asRGBA = false;
    }
    if (opacity == null) {
      opacity = 1;
    }
    if (hexString[0] === "#") {
      hexString = hexString.substr(1);
    }
    if (hexString.length === 3) {
      r = parseInt(hexString[0] + hexString[0], 16);
      g = parseInt(hexString[1] + hexString[1], 16);
      b = parseInt(hexString[2] + hexString[2], 16);
    } else if (hexString.length >= 6) {
      r = parseInt(hexString[0] + hexString[1], 16);
      g = parseInt(hexString[2] + hexString[3], 16);
      b = parseInt(hexString[4] + hexString[5], 16);
    } else {
      r = 0;
      g = 0;
      b = 0;
    }
    if (asRGBA) {
      return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
    } else {
      return [r, g, b, opacity];
    }
  };

  Util.bound = function(val, max, positive) {
    var a, half;
    if (positive == null) {
      positive = false;
    }
    a = val % max;
    half = max / 2;
    if (a > half) {
      a -= max;
    } else if (a < -half) {
      a += max;
    }
    if (positive) {
      if (a < 0) {
        return a + max;
      } else {
        return a;
      }
    } else {
      return a;
    }
  };

  Util.boundAngle = function(ang, positive) {
    return Util.bound(ang, 360, positive);
  };

  Util.boundRadian = function(radian, positive) {
    return Util.bound(radian, Const.two_pi, positive);
  };

  Util.boundingBox = function(points, is3D) {
    var aa, len1, maxPt, minPt, p;
    if (is3D == null) {
      is3D = false;
    }
    minPt = new Point(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    maxPt = new Point(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    for (aa = 0, len1 = points.length; aa < len1; aa++) {
      p = points[aa];
      if (p.x < minPt.x) {
        minPt.x = p.x;
      }
      if (p.y < minPt.y) {
        minPt.y = p.y;
      }
      if (p.x > maxPt.x) {
        maxPt.x = p.x;
      }
      if (p.y > maxPt.y) {
        maxPt.y = p.y;
      }
      if (is3D) {
        if (p.z < minPt.z) {
          minPt.z = p.z;
        }
        if (p.z > maxPt.z) {
          maxPt.z = p.z;
        }
      }
    }
    return new Rectangle(minPt).to(maxPt);
  };

  Util.lerp = function(a, b, t) {
    return (1 - t) * a + t * b;
  };

  Util.centroid = function(points) {
    var aa, c, len1, p;
    c = new Vector();
    for (aa = 0, len1 = points.length; aa < len1; aa++) {
      p = points[aa];
      c.add(p);
    }
    return c.divide(points.length);
  };

  Util.same = function(a, b, threshold) {
    if (threshold == null) {
      threshold = Const.epsilon;
    }
    return Math.abs(a - b) < threshold;
  };

  Util.within = function(p, a, b) {
    return p >= Math.min(a, b) && p <= Math.max(a, b);
  };

  Util.randomRange = function(a, b) {
    var r;
    if (b == null) {
      b = 0;
    }
    r = a > b ? a - b : b - a;
    return a + Math.random() * r;
  };

  Util.mixin = function(klass, mix) {
    var k, v;
    for (k in mix) {
      v = mix[k];
      if (mix.hasOwnProperty(k)) {
        klass.prototype[k] = mix[k];
      }
    }
    return klass;
  };

  Util.extend = function(klass, parent) {
    klass.prototype = Object.create(parent.prototype);
    klass.prototype.constructor = klass;
    return klass;
  };

  Util.clonePoints = function(array) {
    var aa, len1, p, results;
    results = [];
    for (aa = 0, len1 = array.length; aa < len1; aa++) {
      p = array[aa];
      results.push(p.clone());
    }
    return results;
  };

  Util.contextRotateOrigin = function(ctx, bound, radian, origin, mask) {
    var msz, size;
    if (origin == null) {
      origin = false;
    }
    size = bound.size();
    if (!origin) {
      origin = size.$multiply(0.5);
      origin.add(bound);
    }
    if (mask) {
      msz = mask.size();
      Form.rect(ctx, mask);
      ctx.clip();
    }
    ctx.translate(origin.x, origin.y);
    ctx.rotate(radian);
    return ctx.translate(-origin.x, -origin.y);
  };

  Util.sinCosTable = function() {
    var aa, cos, i, sin;
    cos = [];
    sin = [];
    for (i = aa = 0; aa <= 360; i = aa += 1) {
      cos[i] = Math.cos(i * Math.PI / 180);
      sin[i] = Math.sin(i * Math.PI / 180);
    }
    return {
      sin: sin,
      cos: cos
    };
  };

  Util.chance = function(p) {
    return Math.random() < p;
  };

  Util.gaussian = function(x, mean, sigma) {
    if (mean == null) {
      mean = 0;
    }
    if (sigma == null) {
      sigma = 1;
    }
    x = (x - mean) / sigma;
    return Const.gaussian * Math.exp(-0.5 * x * x) / sigma;
  };

  Util.mapToRange = function(n, min1, max1, min2, max2) {
    if (min1 === max1) {
      throw "[min1, max1] must be a non-degenerate interval (that is, min1 != max1)";
    }
    return ((n - min1) / (max1 - min1)) * (max2 - min2) + min2;
  };

  return Util;

})();

this.Util = Util;

Timer = (function() {
  function Timer(d) {
    if (d == null) {
      d = 1000;
    }
    this.duration = d;
    this._time = 0;
    this._ease = function(t, b, c, d) {
      return t / d;
    };
    this._intervalID = -1;
  }

  Timer.prototype.start = function(reset) {
    var diff;
    diff = Math.min(Date.now() - this._time, this.duration);
    if (reset || diff >= this.duration) {
      return this._time = Date.now();
    }
  };

  Timer.prototype.setEasing = function(ease) {
    return this._ease = ease;
  };

  Timer.prototype.check = function() {
    var diff;
    diff = Math.min(Date.now() - this._time, this.duration);
    return this._ease(diff, 0, 1, this.duration);
  };

  Timer.prototype.track = function(callback) {
    var me;
    clearInterval(this._intervalID);
    this.start(true);
    me = this;
    this._intervalID = setInterval((function() {
      var t;
      t = me.check();
      callback(t);
      if (t >= 1) {
        return clearInterval(me._intervalID);
      }
    }), 25);
    return this._intervalID;
  };

  return Timer;

})();

this.Timer = Timer;

Space = (function() {
  function Space(id) {
    if (typeof id !== 'string' || id.length === 0) {
      throw "id parameter is not valid";
      return false;
    }
    this.id = id;
    this.size = new Vector();
    this.center = new Vector();
    this._timePrev = 0;
    this._timeDiff = 0;
    this._timeEnd = -1;
    this.items = {};
    this._animID = -1;
    this._animCount = 0;
    this._animPause = false;
    this._refresh = true;
  }

  Space.prototype.refresh = function(b) {
    this._refresh = b;
    return this;
  };

  Space.prototype.render = function(context) {
    return this;
  };

  Space.prototype.resize = function(w, h) {};

  Space.prototype.clear = function() {};

  Space.prototype.add = function(item) {
    var k;
    if ((item.animate != null) && typeof item.animate === 'function') {
      k = this._animCount++;
      this.items[k] = item;
      item.animateID = k;
      if (item.onSpaceResize != null) {
        item.onSpaceResize(this.size.x, this.size.y);
      }
    } else {
      throw "a player object for Space.add must define animate()";
    }
    return this;
  };

  Space.prototype.remove = function(item) {
    delete this.items[item.animateID];
    return this;
  };

  Space.prototype.removeAll = function() {
    this.items = {};
    return this;
  };

  Space.prototype.play = function(time) {
    var err;
    if (time == null) {
      time = 0;
    }
    this._animID = requestAnimationFrame((function(_this) {
      return function(t) {
        return _this.play(t);
      };
    })(this));
    if (this._animPause) {
      return;
    }
    this._timeDiff = time - this._timePrev;
    try {
      this._playItems(time);
    } catch (_error) {
      err = _error;
      cancelAnimationFrame(this._animID);
      console.error(err.stack);
      throw err;
    }
    this._timePrev = time;
    return this;
  };

  Space.prototype._playItems = function(time) {
    var k, ref, v;
    if (this._refresh) {
      this.clear();
    }
    ref = this.items;
    for (k in ref) {
      v = ref[k];
      v.animate(time, this._timeDiff, this.ctx);
    }
    if (this._timeEnd >= 0 && time > this._timeEnd) {
      cancelAnimationFrame(this._animID);
    }
    return this;
  };

  Space.prototype.pause = function(toggle) {
    if (toggle == null) {
      toggle = false;
    }
    this._animPause = toggle ? !this._animPause : true;
    return this;
  };

  Space.prototype.resume = function() {
    this._animPause = false;
    return this;
  };

  Space.prototype.stop = function(t) {
    if (t == null) {
      t = 0;
    }
    this._timeEnd = t;
    return this;
  };

  Space.prototype.playTime = function(duration) {
    if (duration == null) {
      duration = 5000;
    }
    this.play();
    return this.stop(duration);
  };

  Space.prototype.bindCanvas = function(evt, callback) {
    if (this.space.addEventListener) {
      return this.space.addEventListener(evt, callback);
    }
  };

  Space.prototype.bindMouse = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
    if (this.space.addEventListener && this.space.removeEventListener) {
      if (_bind) {
        this.space.addEventListener("mousedown", this._mouseDown.bind(this));
        this.space.addEventListener("mouseup", this._mouseUp.bind(this));
        this.space.addEventListener("mouseover", this._mouseOver.bind(this));
        this.space.addEventListener("mouseout", this._mouseOut.bind(this));
        return this.space.addEventListener("mousemove", this._mouseMove.bind(this));
      } else {
        this.space.removeEventListener("mousedown", this._mouseDown.bind(this));
        this.space.removeEventListener("mouseup", this._mouseUp.bind(this));
        this.space.removeEventListener("mouseover", this._mouseOver.bind(this));
        this.space.removeEventListener("mouseout", this._mouseOut.bind(this));
        return this.space.removeEventListener("mousemove", this._mouseMove.bind(this));
      }
    }
  };

  Space.prototype.bindTouch = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
    if (this.space.addEventListener && this.space.removeEventListener) {
      if (_bind) {
        this.space.addEventListener("touchstart", this._mouseDown.bind(this));
        this.space.addEventListener("touchend", this._mouseUp.bind(this));
        this.space.addEventListener("touchmove", ((function(_this) {
          return function(evt) {
            evt.preventDefault();
            return _this._mouseMove(evt);
          };
        })(this)));
        return this.space.addEventListener("touchcancel", this._mouseOut.bind(this));
      } else {
        this.space.removeEventListener("touchstart", this._mouseDown.bind(this));
        this.space.removeEventListener("touchend", this._mouseUp.bind(this));
        this.space.removeEventListener("touchmove", this._mouseMove.bind(this));
        return this.space.removeEventListener("touchcancel", this._mouseOut.bind(this));
      }
    }
  };

  Space.prototype.touchesToPoints = function(evt, which) {
    var t;
    if (which == null) {
      which = "touches";
    }
    if (!evt || !evt[which]) {
      return [];
    }
    return (function() {
      var aa, len1, ref, results;
      ref = evt[which];
      results = [];
      for (aa = 0, len1 = ref.length; aa < len1; aa++) {
        t = ref[aa];
        results.push(new Vector(t.pageX - this.boundRect.left, t.pageY - this.boundRect.top));
      }
      return results;
    }).call(this);
  };

  Space.prototype._mouseAction = function(type, evt) {
    var _c, k, px, py, ref, ref1, results, results1, v;
    if (evt.touches || evt.changedTouches) {
      ref = this.items;
      results = [];
      for (k in ref) {
        v = ref[k];
        if (v.onTouchAction != null) {
          _c = evt.changedTouches && evt.changedTouches.length > 0;
          px = _c ? evt.changedTouches.item(0).pageX : 0;
          py = _c ? evt.changedTouches.item(0).pageY : 0;
          results.push(v.onTouchAction(type, px, py, evt));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {
      ref1 = this.items;
      results1 = [];
      for (k in ref1) {
        v = ref1[k];
        if (v.onMouseAction != null) {
          px = evt.offsetX || evt.layerX;
          py = evt.offsetY || evt.layerY;
          results1.push(v.onMouseAction(type, px, py, evt));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    }
  };

  Space.prototype._mouseDown = function(evt) {
    this._mouseAction("down", evt);
    return this._mdown = true;
  };

  Space.prototype._mouseUp = function(evt) {
    this._mouseAction("up", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    this._mdown = false;
    return this._mdrag = false;
  };

  Space.prototype._mouseMove = function(evt) {
    this._mouseAction("move", evt);
    if (this._mdown) {
      this._mdrag = true;
      return this._mouseAction("drag", evt);
    }
  };

  Space.prototype._mouseOver = function(evt) {
    return this._mouseAction("over", evt);
  };

  Space.prototype._mouseOut = function(evt) {
    this._mouseAction("out", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    return this._mdrag = false;
  };

  return Space;

})();

this.Space = Space;

CanvasSpace = (function(superClass) {
  extend(CanvasSpace, superClass);

  function CanvasSpace(elem, callback) {
    this._resizeHandler = bind(this._resizeHandler, this);
    var _existed, _selector, b, isElement;
    if (!elem) {
      elem = 'pt';
    }
    isElement = elem instanceof Element;
    CanvasSpace.__super__.constructor.call(this, isElement ? "pt_custom_space" : elem);
    this.space = null;
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.pixelScale = 1;
    this._autoResize = true;
    _selector = null;
    if (isElement) {
      _selector = elem;
    } else {
      this.id = this.id[0] === "#" ? this.id.substr(1) : this.id;
      _selector = document.querySelector("#" + this.id);
      _existed = true;
    }
    if (!_selector) {
      this.bound = this._createElement("div", this.id + "_container");
      this.space = this._createElement("canvas", this.id);
      this.bound.appendChild(this.space);
      document.body.appendChild(this.bound);
      _existed = false;
    } else if (_selector.nodeName.toLowerCase() !== "canvas") {
      this.bound = _selector;
      this.space = this._createElement("canvas", this.id + "_canvas");
      this.bound.appendChild(this.space);
    } else {
      this.space = _selector;
      this.bound = this.space.parentElement;
    }
    if (_existed) {
      b = this.bound.getBoundingClientRect();
      this.resize(b.width, b.height);
    }
    this._mdown = false;
    this._mdrag = false;
    setTimeout(this._ready.bind(this, callback), 50);
    this.bgcolor = "#F3F7FA";
    this.ctx = this.space.getContext('2d');
  }

  CanvasSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "div";
    }
    d = document.createElement(elem);
    d.setAttribute("id", id);
    return d;
  };

  CanvasSpace.prototype._ready = function(callback) {
    if (this.bound) {
      this.boundRect = this.bound.getBoundingClientRect();
      this.resize(this.boundRect.width, this.boundRect.height);
      this.autoResize(this._autoResize);
      if (this.bgcolor) {
        this.clear(this.bgcolor);
      }
      this.space.dispatchEvent(new Event('ready'));
      if (callback && typeof callback === "function") {
        return callback(this.boundRect, this.space);
      }
    } else {
      throw "Cannot initiate #" + this.id + " element";
    }
  };

  CanvasSpace.prototype.display = function() {
    console.warn("space.display(...) function is deprecated as of version 0.2.0. You can now set the canvas element in the constructor. Please see the release note for details.");
    return this;
  };

  CanvasSpace.prototype.setup = function(opt) {
    var r1, r2;
    if (opt.bgcolor !== void 0) {
      this.bgcolor = opt.bgcolor;
    }
    this._autoResize = opt.resize !== false ? true : false;
    this.pixelScale = 1;
    if (opt.retina !== false) {
      r1 = window.devicePixelRatio || 1;
      r2 = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
      this.pixelScale = r1 / r2;
    }
    return this;
  };

  CanvasSpace.prototype._resizeHandler = function(evt) {
    this.boundRect = this.bound.getBoundingClientRect();
    return this.resize(this.boundRect.width, this.boundRect.height, evt);
  };

  CanvasSpace.prototype.autoResize = function(auto) {
    if (auto == null) {
      auto = true;
    }
    if (auto) {
      window.addEventListener('resize', this._resizeHandler);
    } else {
      window.removeEventListener('resize', this._resizeHandler);
    }
    return this;
  };

  CanvasSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    w = Math.floor(w);
    h = Math.floor(h);
    this.size.set(w, h);
    this.center = new Vector(w / 2, h / 2);
    this.boundRect.width = w;
    this.boundRect.height = h;
    this.space.width = w * this.pixelScale;
    this.space.height = h * this.pixelScale;
    this.space.style.width = w + "px";
    this.space.style.height = h + "px";
    if (this.pixelScale !== 1) {
      this.ctx.scale(this.pixelScale, this.pixelScale);
    }
    ref = this.items;
    for (k in ref) {
      p = ref[k];
      if (p.onSpaceResize != null) {
        p.onSpaceResize(w, h, evt);
      }
    }
    this.render(this.ctx);
    return this;
  };

  CanvasSpace.prototype.clear = function(bg) {
    var lastColor;
    if (bg) {
      this.bgcolor = bg;
    }
    lastColor = this.ctx.fillStyle;
    if (this.bgcolor && this.bgcolor !== "transparent") {
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, this.size.x, this.size.y);
    } else {
      this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    this.ctx.fillStyle = lastColor;
    return this;
  };

  CanvasSpace.prototype.animate = function(time) {
    var k, ref, v;
    this.ctx.save();
    if (this._refresh) {
      this.clear();
    }
    ref = this.items;
    for (k in ref) {
      v = ref[k];
      v.animate(time, this._timeDiff, this.ctx);
    }
    if (this._timeEnd >= 0 && time > this._timeEnd) {
      cancelAnimationFrame(this._animID);
    }
    this.ctx.restore();
    return this;
  };

  return CanvasSpace;

})(Space);

this.CanvasSpace = CanvasSpace;

DOMSpace = (function(superClass) {
  extend(DOMSpace, superClass);

  function DOMSpace(elem, callback, spaceElement) {
    var _selector, isElement;
    if (spaceElement == null) {
      spaceElement = "div";
    }
    this._resizeHandler = bind(this._resizeHandler, this);
    if (!elem) {
      elem = 'pt';
    }
    isElement = elem instanceof Element;
    DOMSpace.__super__.constructor.call(this, isElement ? "pt_custom_space" : elem);
    this.space = null;
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.css = {};
    _selector = null;
    if (isElement) {
      _selector = elem;
    } else {
      this.id = this.id[0] === "#" ? this.id.substr(1) : this.id;
      _selector = document.querySelector("#" + this.id);
    }
    if (!_selector) {
      this.space = this._createElement(spaceElement, this.id);
      document.body.appendChild(this.space);
      this.bound = this.space.parentElement;
    } else {
      this.space = _selector;
      this.bound = this.space.parentElement;
    }
    this._mdown = false;
    this._mdrag = false;
    setTimeout(this._ready.bind(this, callback), 50);
    this.bgcolor = false;
    this.ctx = {};
  }

  DOMSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "div";
    }
    d = document.createElement(elem);
    d.setAttribute("id", id);
    return d;
  };

  DOMSpace.prototype._ready = function(callback) {
    if (this.bound) {
      this.boundRect = this.bound.getBoundingClientRect();
      this.resize(this.boundRect.width, this.boundRect.height);
      this.autoResize(this._autoResize);
      if (this.bgcolor) {
        this.setCSS("backgroundColor", this.bgcolor);
      }
      this.updateCSS();
      this.space.dispatchEvent(new Event('ready'));
      if (callback) {
        return callback(this.boundRect, this.space);
      }
    } else {
      throw "Cannot initiate #" + this.id + " element";
    }
  };

  DOMSpace.prototype.setCSS = function(key, val, isPx) {
    if (isPx == null) {
      isPx = false;
    }
    this.css[key] = (isPx ? val + "px" : val);
    return this;
  };

  DOMSpace.prototype.updateCSS = function() {
    var k, ref, results, v;
    ref = this.css;
    results = [];
    for (k in ref) {
      v = ref[k];
      results.push(this.space.style[k] = v);
    }
    return results;
  };

  DOMSpace.prototype.display = function() {
    console.warn("space.display(...) function is deprecated as of version 0.2.0. You can now set the DOM element in the constructor. Please see the release note for details.");
    return this;
  };

  DOMSpace.prototype.setup = function(opt) {
    if (opt.bgcolor !== void 0) {
      this.bgcolor = opt.bgcolor;
    }
    this._autoResize = opt.resize !== false ? true : false;
    return this;
  };

  DOMSpace.prototype._resizeHandler = function(evt) {
    this.boundRect = this.bound.getBoundingClientRect();
    return this.resize(this.boundRect.width, this.boundRect.height, evt);
  };

  DOMSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    this.size.set(w, h);
    this.center = new Vector(w / 2, h / 2);
    ref = this.items;
    for (k in ref) {
      p = ref[k];
      if (p.onSpaceResize != null) {
        p.onSpaceResize(w, h, evt);
      }
    }
    return this;
  };

  DOMSpace.prototype.autoResize = function(auto) {
    if (auto == null) {
      auto = true;
    }
    if (auto) {
      this.css['width'] = '100%';
      this.css['height'] = '100%';
      window.addEventListener('resize', this._resizeHandler);
    } else {
      delete this.css['width'];
      delete this.css['height'];
      window.removeEventListener('resize', this._resizeHandler);
    }
    return this;
  };

  DOMSpace.prototype.clear = function(bg) {
    this.setBackground(bg);
    this.space.innerHML = "";
    return this;
  };

  DOMSpace.prototype.setBackground = function(bg) {
    if (bg) {
      this.bgcolor = bg;
      this.setCSS("backgroundColor", this.bgcolor);
      return this.space.style["backgroundColor"] = this.bgcolor;
    }
  };

  DOMSpace.prototype.animate = function(time) {
    var k, ref, v;
    ref = this.items;
    for (k in ref) {
      v = ref[k];
      v.animate(time, this._timeDiff, this.ctx);
    }
    if (this._timeEnd >= 0 && time > this._timeEnd) {
      cancelAnimationFrame(this._animID);
    }
    return this;
  };

  DOMSpace.attr = function(elem, data) {
    var k, results, v;
    results = [];
    for (k in data) {
      v = data[k];
      results.push(elem.setAttribute(k, v));
    }
    return results;
  };

  DOMSpace.css = function(data) {
    var k, str, v;
    str = "";
    for (k in data) {
      v = data[k];
      if (v) {
        str += k + ": " + v + "; ";
      }
    }
    return str;
  };

  return DOMSpace;

})(Space);

this.DOMSpace = DOMSpace;

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
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = pts.length; aa < len1; aa++) {
        p = pts[aa];
        results.push(SVGForm.point(ctx, p, halfsize, fill, stroke, circle));
      }
      return results;
    })();
  };

  SVGForm.prototype.points = function(ps, halfsize, isCircle) {
    var aa, len1, p;
    if (halfsize == null) {
      halfsize = 2;
    }
    if (isCircle == null) {
      isCircle = false;
    }
    for (aa = 0, len1 = ps.length; aa < len1; aa++) {
      p = ps[aa];
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
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = pairs.length; aa < len1; aa++) {
        ln = pairs[aa];
        results.push(SVGForm.line(ctx, ln));
      }
      return results;
    })();
  };

  SVGForm.prototype.lines = function(ps) {
    var aa, len1, p;
    for (aa = 0, len1 = ps.length; aa < len1; aa++) {
      p = ps[aa];
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
      var aa, ref, results;
      results = [];
      for (i = aa = 0, ref = pts.length; aa < ref; i = aa += 1) {
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

  function SVGSpace(id, callback) {
    var b, s;
    SVGSpace.__super__.constructor.call(this, id, callback, 'svg');
    if (this.space.nodeName.toLowerCase() !== "svg") {
      s = this._createElement("svg", this.id + "_svg");
      this.space.appendChild(s);
      this.bound = this.space;
      this.space = s;
      b = this.bound.getBoundingClientRect();
      this.resize(b.width, b.height);
    }
  }

  SVGSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "svg";
    }
    d = document.createElementNS("http://www.w3.org/2000/svg", elem);
    if (id) {
      d.setAttribute("id", id);
    }
    return d;
  };

  SVGSpace.svgElement = function(parent, name, id) {
    var elem;
    if (!parent || !parent.appendChild) {
      parent = this.space;
      if (!parent) {
        throw "parent parameter needs to be a DOM node";
      }
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

  SVGSpace.prototype.remove = function(item) {
    var aa, len1, t, temp;
    temp = this.space.querySelectorAll("." + SVGForm._scopeID(item));
    for (aa = 0, len1 = temp.length; aa < len1; aa++) {
      t = temp[aa];
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

Form = (function() {
  function Form(space) {
    this.space = space;
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
    var aa, len1, ln, results;
    results = [];
    for (aa = 0, len1 = pairs.length; aa < len1; aa++) {
      ln = pairs[aa];
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

  Form.arc = function(ctx, pt, radius, start, end) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, start, end);
    return ctx.stroke();
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
    var aa, len1, p, results;
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
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      results.push(Form.point(ctx, p, halfsize, fill, stroke, circle));
    }
    return results;
  };

  Form.polygon = function(ctx, pts, closePath, fill, stroke) {
    var aa, i, ref;
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
    for (i = aa = 1, ref = pts.length; aa < ref; i = aa += 1) {
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

  Form.prototype.stroke = function(c, width, joint, cap) {
    this.cc.strokeStyle = c ? c : "transparent";
    this.stroked = !!c;
    if (width) {
      this.cc.lineWidth = width;
    }
    if (joint) {
      this.cc.lineJoin = joint;
    }
    if (cap) {
      this.cc.lineCap = cap;
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

  Form.prototype.arc = function(p, start, end) {
    Form.arc(this.cc, p, p.radius, start, end);
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

  Form.prototype.scope = function() {
    return this.cc;
  };

  Form.prototype.enterScope = function() {
    return this.cc;
  };

  return Form;

})();

this.Form = Form;

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
    this.x = Math.min(this.x, _p.x);
    this.y = Math.min(this.y, _p.y);
    this.z = Math.min(this.z, _p.z);
    return this;
  };

  Point.prototype.$min = function(args) {
    var _p;
    _p = Point.get(arguments);
    return new this.__proto__.constructor(Math.min(this.x, _p.x), Math.min(this.y, _p.y), Math.min(this.z, _p.z));
  };

  Point.prototype.max = function(args) {
    var _p;
    _p = Point.get(arguments);
    this.x = Math.max(this.x, _p.x);
    this.y = Math.max(this.y, _p.y);
    this.z = Math.max(this.z, _p.z);
    return this;
  };

  Point.prototype.$max = function(args) {
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

  Point.prototype.ceil = function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);
    return this;
  };

  return Point;

})();

this.Point = Point;

Vector = (function(superClass) {
  extend(Vector, superClass);

  function Vector() {
    Vector.__super__.constructor.apply(this, arguments);
  }

  Vector.prototype._getArgs = function(args) {
    if (typeof args[0] === 'number' && args.length > 1) {
      return args;
    } else {
      return args[0];
    }
  };

  Vector.prototype.add = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x += arguments[0];
      this.y += arguments[0];
      this.z += arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x += _p.x;
      this.y += _p.y;
      this.z += _p.z;
    }
    return this;
  };

  Vector.prototype.$add = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).add(a);
  };

  Vector.prototype.subtract = function(args) {
    var _p;
    if (typeof arguments[0] === 'number' && arguments.length === 1) {
      this.x -= arguments[0];
      this.y -= arguments[0];
      this.z -= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x -= _p.x;
      this.y -= _p.y;
      this.z -= _p.z;
    }
    return this;
  };

  Vector.prototype.$subtract = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).subtract(a);
  };

  Vector.prototype.multiply = function(args) {
    var _p;
    if (arguments.length === 1 && (typeof arguments[0] === 'number' || (typeof arguments[0] === 'object' && arguments[0].length === 1))) {
      this.x *= arguments[0];
      this.y *= arguments[0];
      this.z *= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x *= _p.x;
      this.y *= _p.y;
      this.z *= _p.z;
    }
    return this;
  };

  Vector.prototype.$multiply = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).multiply(a);
  };

  Vector.prototype.divide = function(args) {
    var _p;
    if (arguments.length === 1 && (typeof arguments[0] === 'number' || (typeof arguments[0] === 'object' && arguments[0].length === 1))) {
      this.x /= arguments[0];
      this.y /= arguments[0];
      this.z /= arguments[0];
    } else {
      _p = Point.get(arguments);
      this.x /= _p.x;
      this.y /= _p.y;
      this.z /= _p.z;
    }
    return this;
  };

  Vector.prototype.$divide = function(args) {
    var a;
    a = this._getArgs(arguments);
    return new Vector(this).divide(a);
  };

  Vector.prototype.op = function() {
    var aa, args, len1, name, p, pts;
    name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      p[name].apply(p, args);
    }
    return this;
  };

  Vector.prototype.$op = function() {
    var aa, args, instance, len1, name, p, pts;
    name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    instance = this.clone();
    pts = instance.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      p[name].apply(p, args);
    }
    return instance;
  };

  Vector.prototype.angle = function(args) {
    var axis, p;
    if (arguments.length === 0) {
      return Math.atan2(this.y, this.x);
    }
    if (typeof arguments[0] === 'string') {
      axis = arguments[0];
      p = arguments.length > 1 ? this.$subtract(arguments[1]).multiply(-1) : void 0;
    } else {
      p = this.$subtract(arguments[0]).multiply(-1);
      axis = false;
    }
    if (p && !axis) {
      return Math.atan2(p.y, p.x);
    } else if (axis === Const.xy) {
      if (p) {
        return Math.atan2(p.y, p.x);
      } else {
        return Math.atan2(this.y, this.x);
      }
    } else if (axis === Const.yz) {
      if (p) {
        return Math.atan2(p.z, p.y);
      } else {
        return Math.atan2(this.z, this.y);
      }
    } else if (axis === Const.xz) {
      if (p) {
        return Math.atan2(p.z, p.x);
      } else {
        return Math.atan2(this.z, this.x);
      }
    }
  };

  Vector.prototype.angleBetween = function(vec, axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return Util.boundRadian(this.angle(axis), true) - Util.boundRadian(vec.angle(axis), true);
  };

  Vector.prototype.magnitude = function(args) {
    var _sq, axis, m, mag, p, useSq;
    m = {
      x: this.x * this.x,
      y: this.y * this.y,
      z: this.z * this.z
    };
    useSq = arguments.length >= 1 && !arguments[arguments.length - 1];
    _sq = useSq ? (function(x) {
      return x;
    }) : Math.sqrt;
    if (arguments.length === 0) {
      return _sq(m.x + m.y + m.z);
    }
    if (typeof arguments[0] === 'string') {
      axis = arguments[0];
      if (arguments.length > 1 && arguments[1]) {
        p = this.$subtract(arguments[1]);
      } else {
        p = void 0;
      }
    } else {
      p = this.$subtract(arguments[0]);
      axis = false;
    }
    mag = p ? {
      x: p.x * p.x,
      y: p.y * p.y,
      z: p.z * p.z
    } : m;
    if (p && !axis) {
      return _sq(mag.x + mag.y + mag.z);
    } else if (axis === Const.xy) {
      return _sq(mag.x + mag.y);
    } else if (axis === Const.yz) {
      return _sq(mag.y + mag.z);
    } else if (axis === Const.xz) {
      return _sq(mag.x + mag.z);
    }
  };

  Vector.prototype.distance = function(pt, axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    return this.magnitude(axis, pt);
  };

  Vector.prototype.normalize = function() {
    this.set(this.$normalize());
    return this;
  };

  Vector.prototype.$normalize = function() {
    var m;
    m = this.magnitude();
    if (m === 0) {
      return new Vector();
    } else {
      return new Vector(this.x / m, this.y / m, this.z / m);
    }
  };

  Vector.prototype.abs = function() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  };

  Vector.prototype.dot = function(p, axis) {
    if (axis == null) {
      axis = Const.xyz;
    }
    if (axis === Const.xyz) {
      return this.x * p.x + this.y * p.y + this.z * p.z;
    } else if (axis === Const.xy) {
      return this.x * p.x + this.y * p.y;
    } else if (axis === Const.yz) {
      return this.y * p.y + this.z * p.z;
    } else if (axis === Const.xz) {
      return this.x * p.x + this.z * p.z;
    } else {
      return this.x * p.x + this.y * p.y + this.z * p.z;
    }
  };

  Vector.prototype.projection = function(vec, axis) {
    var a, b, dot, m;
    if (axis == null) {
      axis = Const.xyz;
    }
    m = vec.magnitude();
    a = this.$normalize();
    b = new Vector(vec.x / m, vec.y / m, vec.z / m);
    dot = a.dot(b, axis);
    return a.$multiply(m * dot);
  };

  Vector.prototype.cross = function(p) {
    return new Vector(this.y * p.z - this.z * p.y, this.z * p.x - this.x * p.z, this.x * p.y - this.y * p.x);
  };

  Vector.prototype.bisect = function(vec, isNormalized) {
    if (isNormalized == null) {
      isNormalized = false;
    }
    if (isNormalized) {
      return this.$add(vec).divide(2);
    } else {
      return this.$normalize().add(vec.$normalize()).divide(2);
    }
  };

  Vector.prototype.perpendicular = function(axis) {
    if (axis == null) {
      axis = Const.xy;
    }
    switch (axis) {
      case Const.xy:
        return [new Vector(-this.y, this.x, this.z), new Vector(this.y, -this.x, this.z)];
      case Const.yz:
        return [new Vector(this.x, -this.z, this.y), new Vector(this.x, this.z, -this.y)];
      case Const.xz:
        return [new Vector(-this.z, this.y, this.x), new Vector(this.z, -this.y, this.x)];
      default:
        return [new Vector(-this.y, this.x, this.z), new Vector(this.y, -this.x, this.z)];
    }
  };

  Vector.prototype.isPerpendicular = function(p, axis) {
    if (axis == null) {
      axis = Const.xyz;
    }
    return this.dot(p, axis) === 0;
  };

  Vector.prototype.surfaceNormal = function(p) {
    return this.cross(p).normalize(true);
  };

  Vector.prototype.moveTo = function(args) {
    var aa, d, len1, p, pts, target;
    target = Point.get(arguments);
    d = this.$subtract(target);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      p.subtract(d);
    }
    return this;
  };

  Vector.prototype.moveBy = function(args) {
    var aa, inc, len1, p, pts;
    inc = Point.get(arguments);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      p.add(inc);
    }
    return this;
  };

  Vector.prototype.rotate2D = function(radian, anchor, axis) {
    var aa, len1, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.rotateAnchor2D(radian, anchor, axis);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.reflect2D = function(line, axis) {
    var aa, len1, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    mx = Matrix.reflectAnchor2D(line, axis);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.scale2D = function(sx, sy, anchor, axis) {
    var aa, len1, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.scaleAnchor2D(sx, sy, anchor, axis);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.shear2D = function(sx, sy, anchor, axis) {
    var aa, len1, mx, p, pts;
    if (axis == null) {
      axis = Const.xy;
    }
    if (!anchor) {
      anchor = new Point(0, 0, 0);
    }
    mx = Matrix.shearAnchor2D(sx, sy, anchor, axis);
    pts = this.toArray();
    for (aa = 0, len1 = pts.length; aa < len1; aa++) {
      p = pts[aa];
      Matrix.transform2D(p, mx, axis);
    }
    return this;
  };

  Vector.prototype.clone = function() {
    return new Vector(this);
  };

  Vector.prototype.toString = function() {
    return "Vector " + this.x + ", " + this.y + ", " + this.z;
  };

  return Vector;

})(Point);

this.Vector = Vector;

Color = (function(superClass) {
  extend(Color, superClass);

  function Color(args) {
    var _args;
    Color.__super__.constructor.apply(this, arguments);
    _args = Array.isArray(arguments[0]) && arguments[0][3] !== void 0 ? arguments[0] : arguments;
    this.alpha = _args.length >= 4 ? Math.min(1, Math.max(_args[3], 0)) : 1;
    this.mode = 'rgb';
    if (arguments.length >= 5) {
      this.mode = arguments[4];
    }
    if (typeof arguments[1] === "string") {
      this.mode = arguments[1];
    }
  }

  Color.XYZ = {
    D65: {
      x: 95.047,
      y: 100,
      z: 108.883
    }
  };

  Color.parseHex = function(hex, asColor) {
    var hexValue, rgb;
    if (asColor == null) {
      asColor = false;
    }
    if (hex.indexOf('#') === 0) {
      hex = hex.substr(1);
    }
    if (hex.length === 3) {
      hex = "" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 8) {
      this.alpha = hex.substr(6) & 0xFF / 255;
      hex = hex.substring(0, 6);
    }
    hexValue = parseInt(hex, 16);
    rgb = [hexValue >> 16, hexValue >> 8 & 0xFF, hexValue & 0xFF];
    if (asColor) {
      return new Color(rgb[0], rgb[1], rgb[2]);
    } else {
      return rgb;
    }
  };

  Color.prototype.setMode = function(m) {
    m = m.toLowerCase();
    if (m !== this.mode) {
      switch (this.mode) {
        case 'hsl':
          this.copy(Point.get(Color.HSLtoRGB(this.x, this.y, this.z)));
          break;
        case 'hsb':
          this.copy(Point.get(Color.HSBtoRGB(this.x, this.y, this.z)));
          break;
        case 'lab':
          this.copy(Point.get(Color.LABtoRGB(this.x, this.y, this.z)));
          break;
        case 'lch':
          this.copy(Point.get(Color.LCHtoRGB(this.x, this.y, this.z)));
          break;
        case 'xyz':
          this.copy(Point.get(Color.XYZtoRGB(this.x, this.y, this.z)));
      }
      switch (m) {
        case 'hsl':
          this.copy(Point.get(Color.RGBtoHSL(this.x, this.y, this.z)));
          break;
        case 'hsb':
          this.copy(Point.get(Color.RGBtoHSB(this.x, this.y, this.z)));
          break;
        case 'lab':
          this.copy(Point.get(Color.RGBtoLAB(this.x, this.y, this.z)));
          break;
        case 'lch':
          this.copy(Point.get(Color.RGBtoLCH(this.x, this.y, this.z)));
          break;
        case 'xyz':
          this.copy(Point.get(Color.RGBtoXYZ(this.x, this.y, this.z)));
      }
    }
    this.mode = m;
    return this;
  };

  Color.prototype.hex = function() {
    var _hexstring, cs, ct, n;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    _hexstring = function(n) {
      n = n.toString(16);
      if (n.length < 2) {
        return '0' + n;
      } else {
        return n;
      }
    };
    ct = (function() {
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = cs.length; aa < len1; aa++) {
        n = cs[aa];
        results.push(_hexstring(n));
      }
      return results;
    })();
    return '#' + ct[0] + ct[1] + ct[2];
  };

  Color.prototype.rgb = function() {
    var cs;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    return "rgb(" + cs[0] + ", " + cs[1] + ", " + cs[2] + ")";
  };

  Color.prototype.rgba = function() {
    var cs;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    return "rgba(" + cs[0] + ", " + cs[1] + ", " + cs[2] + ", " + this.alpha + ")";
  };

  Color.prototype.values = function(toRGB) {
    var cs, v;
    if (toRGB == null) {
      toRGB = false;
    }
    cs = [this.x, this.y, this.z];
    if (toRGB && this.mode !== 'rgb') {
      switch (this.mode) {
        case 'hsl':
          cs = Color.HSLtoRGB(this.x, this.y, this.z);
          break;
        case 'hsb':
          cs = Color.HSBtoRGB(this.x, this.y, this.z);
          break;
        case 'lab':
          cs = Color.LABtoRGB(this.x, this.y, this.z);
          break;
        case 'lch':
          cs = Color.LCHtoRGB(this.x, this.y, this.z);
          break;
        case 'xyz':
          cs = Color.XYZtoRGB(this.x, this.y, this.z);
      }
    }
    return (function() {
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = cs.length; aa < len1; aa++) {
        v = cs[aa];
        results.push(Math.floor(v));
      }
      return results;
    })();
  };

  Color.prototype.clone = function() {
    var c;
    c = new Color(this.x, this.y, this.z, this.alpha);
    c.mode = this.mode;
    return c;
  };

  Color.prototype.toString = function() {
    return "Color (" + this.mode + " mode): " + this.x + ", " + this.y + ", " + this.z + " " + this.alpha;
  };

  Color.RGBtoHSL = function(r, g, b, normalizedInput, normalizedOutput) {
    var d, h, l, max, min, s;
    if (!normalizedInput) {
      r /= 255;
      g /= 255;
      b /= 255;
    }
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = (max + min) / 2;
    s = h;
    l = h;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
    }
    if (normalizedOutput) {
      return [h / 60, s, l];
    } else {
      return [h * 60, s, l];
    }
  };

  Color.HSLtoRGB = function(h, s, l, normalizedInput, normalizedOutput) {
    var b, g, hue2rgb, p, q, r;
    if (s === 0) {
      if (normalizedOutput) {
        return [1, 1, 1];
      } else {
        return [255, 255, 255];
      }
    } else {
      if (!normalizedInput) {
        h /= 360;
      }
      q = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
      p = 2 * l - q;
      hue2rgb = function(p, q, t) {
        if (t < 0) {
          t += 1;
        } else if (t > 1) {
          t -= 1;
        }
        if (t * 6 < 1) {
          return p + (q - p) * t * 6;
        } else if (t * 2 < 1) {
          return q;
        } else if (t * 3 < 2) {
          return p + (q - p) * ((2 / 3) - t) * 6;
        } else {
          return p;
        }
      };
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
      if (normalizedOutput) {
        return [r, g, b];
      } else {
        return [r * 255, g * 255, b * 255];
      }
    }
  };

  Color.RGBtoHSB = function(r, g, b, normalizedInput, normalizedOutput) {
    var d, h, max, min, s, v;
    if (!normalizedInput) {
      r /= 255;
      g /= 255;
      b /= 255;
    }
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    d = max - min;
    s = max === 0 ? 0 : d / max;
    v = max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
    }
    if (normalizedOutput) {
      return [h / 60, s, v];
    } else {
      return [h * 60, s, v];
    }
  };

  Color.HSBtoRGB = function(h, s, v, normalizedInput, normalizedOutput) {
    var f, i, p, q, rgb, t;
    if (!normalizedInput) {
      h /= 360;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      case 5:
        rgb = [v, p, q];
        break;
      default:
        rgb = [0, 0, 0];
    }
    if (normalizedOutput) {
      return rgb;
    } else {
      return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255];
    }
  };

  Color.RGBtoLAB = function(r, g, b, normalizedInput, normalizedOutput) {
    var xyz;
    if (normalizedInput) {
      r *= 255;
      g *= 255;
      b *= 255;
    }
    xyz = Color.RGBtoXYZ(r, g, b);
    return Color.XYZtoLAB(xyz[0], xyz[1], xyz[2]);
  };

  Color.LABtoRGB = function(L, a, b, normalizedInput, normalizedOutput) {
    var rgb, xyz;
    if (normalizedInput) {
      L *= 100;
      a = (a - 0.5) * 127;
      b = (b - 0.5) * 127;
    }
    xyz = Color.LABtoXYZ(L, a, b);
    rgb = Color.XYZtoRGB(xyz[0], xyz[1], xyz[2]);
    if (normalizedOutput) {
      return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    } else {
      return rgb;
    }
  };

  Color.RGBtoLCH = function(r, g, b, normalizedInput, normalizedOutput) {
    var lab, lch;
    if (normalizedInput) {
      r *= 255;
      g *= 255;
      b *= 255;
    }
    lab = Color.RGBtoLAB(r, g, b);
    lch = Color.LABtoLCH(lab[0], lab[1], lab[2]);
    if (normalizedOutput) {
      return [lch[0] / 100, lch[1] / 100, lch[2] / 360];
    } else {
      return lch;
    }
  };

  Color.LCHtoRGB = function(L, c, h, normalizedInput, normalizedOutput) {
    var lab, rgb, xyz;
    if (normalizedInput) {
      L *= 100;
      c *= 100;
      h *= 360;
    }
    lab = Color.LCHtoLAB(L, c, h);
    xyz = Color.LABtoXYZ(lab[0], lab[1], lab[2]);
    rgb = Color.XYZtoRGB(xyz[0], xyz[1], xyz[2]);
    if (normalizedOutput) {
      return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    } else {
      return rgb;
    }
  };

  Color.XYZtoRGB = function(x, y, z, normalizedInput, normalizedOutput) {
    var aa, c, i, len1, rgb;
    if (!normalizedInput) {
      x = x / 100;
      y = y / 100;
      z = z / 100;
    }
    rgb = [x * 3.2404542 + y * -1.5371385 + z * -0.4985314, x * -0.9692660 + y * 1.8760108 + z * 0.0415560, x * 0.0556434 + y * -0.2040259 + z * 1.0572252];
    for (i = aa = 0, len1 = rgb.length; aa < len1; i = ++aa) {
      c = rgb[i];
      if (c < 0) {
        rgb[i] = 0;
      } else {
        rgb[i] = Math.min(1, c > 0.0031308 ? 1.055 * (Math.pow(c, 1 / 2.4)) - 0.055 : 12.92 * c);
      }
    }
    if (normalizedOutput) {
      return rgb;
    } else {
      return [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)];
    }
  };

  Color.RGBtoXYZ = function(r, g, b, normalizedInput, normalizedOutput) {
    if (!normalizedInput) {
      r = r / 255;
      g = g / 255;
      b = b / 255;
    }
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    if (!normalizedOutput) {
      r = r * 100;
      g = g * 100;
      b = b * 100;
    }
    return [r * 0.4124564 + g * 0.3575761 + b * 0.1804375, r * 0.2126729 + g * 0.7151522 + b * 0.0721750, r * 0.0193339 + g * 0.1191920 + b * 0.9503041];
  };

  Color.XYZtoLAB = function(x, y, z) {
    var calc, cy;
    x = x / Color.XYZ.D65.x;
    y = y / Color.XYZ.D65.y;
    z = z / Color.XYZ.D65.z;
    calc = function(n) {
      if (n > 0.008856) {
        return Math.pow(n, 1 / 3);
      } else {
        return (7.787 * n) + 16 / 116;
      }
    };
    cy = calc(y);
    return [(116 * cy) - 16, 500 * (calc(x) - cy), 200 * (cy - calc(z))];
  };

  Color.LABtoXYZ = function(L, a, b) {
    var calc, x, xyz, y, z;
    y = (L + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    calc = function(n) {
      var nnn;
      nnn = Math.pow(n, 3);
      if (nnn > 0.008856) {
        return nnn;
      } else {
        return (n - 16 / 116) / 7.787;
      }
    };
    xyz = [Math.min(Color.XYZ.D65.x, Color.XYZ.D65.x * calc(x)), Math.min(Color.XYZ.D65.y, Color.XYZ.D65.y * calc(y)), Math.min(Color.XYZ.D65.y, Color.XYZ.D65.z * calc(z))];
    return xyz;
  };

  Color.XYZtoLUV = function(x, y, z) {
    var L, refU, refV, u, v;
    u = (4 * x) / (x + (15 * y) + (3 * z));
    v = (9 * y) / (x + (15 * y) + (3 * z));
    y = y / 100;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    refU = (4 * Color.XYZ.D65.x) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    refV = (9 * Color.XYZ.D65.y) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    L = (116 * y) - 16;
    return [L, 13 * L * (u - refU), 13 * L * (v - refV)];
  };

  Color.LUVtoXYZ = function(L, u, v) {
    var cubeY, refU, refV, x, y;
    y = (L + 16) / 116;
    cubeY = y * y * y;
    y = cubeY > 0.008856 ? cubeY : (y - 16 / 116) / 7.787;
    refU = (4 * Color.XYZ.D65.x) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    refV = (9 * Color.XYZ.D65.y) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    u = u / (13 * L) + refU;
    v = v / (13 * L) + refV;
    y = y * 100;
    x = -1 * (9 * y * u) / ((u - 4) * v - u * v);
    return [x, y, (9 * y - (15 * v * y) - (v * x)) / (3 * v)];
  };

  Color.LABtoLCH = function(L, a, b) {
    var h;
    h = Math.atan2(b, a);
    h = h > 0 ? 180 * h / Math.PI : 360 - (180 * Math.abs(h) / Math.PI);
    return [L, Math.sqrt(a * a + b * b), h];
  };

  Color.LCHtoLAB = function(L, c, h) {
    var radH;
    radH = Math.PI * h / 180;
    return [L, Math.cos(radH) * c, Math.sin(radH) * c];
  };

  Color.LUVtoLCH = function(L, u, v) {
    return LABtoLCH(L, u, v);
  };

  Color.LCHtoLUV = function(L, c, h) {
    return LCHtoLAB(L, c, h);
  };

  return Color;

})(Vector);

this.Color = Color;

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
    var aa, bounds, len1, p, pi, pts;
    if (get_pts == null) {
      get_pts = true;
    }
    pts = this.intersectPath(line);
    if (pts && pts.length > 0) {
      pi = [];
      bounds = line.bounds();
      for (aa = 0, len1 = pts.length; aa < len1; aa++) {
        p = pts[aa];
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

  Circle.prototype.toString = function() {
    return "Circle of " + this.radius + " radius at center " + this.x + ", " + this.y + ", " + this.z;
  };

  return Circle;

})(Vector);

this.Circle = Circle;

Particle = (function(superClass) {
  extend(Particle, superClass);

  function Particle() {
    Particle.__super__.constructor.apply(this, arguments);
    this.id = 0;
    this.life = {
      age: 0,
      maxAge: 0,
      active: true,
      complete: false
    };
    this.momentum = new Vector();
    this.velocity = new Vector();
    this.mass = 2;
    this.friction = 0;
    this.frame_ms = 20;
  }

  Particle.prototype.play = function(time, timeDiff) {
    var dt, results, t;
    t = 0;
    results = [];
    while (timeDiff > 0) {
      dt = Math.min(timeDiff, this.frame_ms);
      this.integrate(t / 1000, dt / 1000);
      timeDiff -= dt;
      t += dt;
      results.push(this.life.age++);
    }
    return results;
  };

  Particle.prototype.integrate = function(t, dt) {
    return this.integrateRK4(t, dt);
  };

  Particle.prototype.forces = function(state, t) {
    return {
      force: new Vector()
    };
  };

  Particle.prototype.impulse = function(force_dt) {
    this.momentum.add(force_dt);
    return this.velocity = this.momentum.$divide(this.mass);
  };

  Particle.prototype._evaluate = function(t, dt, derivative) {
    var f, state;
    if (dt == null) {
      dt = 0;
    }
    if (derivative == null) {
      derivative = false;
    }
    if (dt !== 0 && derivative) {
      state = {
        position: this.$add(derivative.velocity.$multiply(dt)),
        momentum: this.momentum.$add(derivative.force.$multiply(dt))
      };
    } else {
      state = {
        position: new Vector(this),
        momentum: new Vector(this.momentum)
      };
    }
    state.velocity = state.momentum.$divide(this.mass);
    f = this.forces(state, t + dt);
    return {
      velocity: state.velocity,
      force: f.force
    };
  };

  Particle.prototype.integrateRK4 = function(t, dt) {
    var _map, a, b, c, d;
    _map = function(m1, m2, m3, m4) {
      var v;
      v = new Vector((m1.x + 2 * (m2.x + m3.x) + m4.x) / 6, (m1.y + 2 * (m2.y + m3.y) + m4.y) / 6, (m1.z + 2 * (m2.z + m3.z) + m4.z) / 6);
      return v;
    };
    a = this._evaluate(t, 0);
    b = this._evaluate(t, dt * 0.5, a);
    c = this._evaluate(t, dt * 0.5, b);
    d = this._evaluate(t, dt, c);
    this.add(_map(a.velocity, b.velocity, c.velocity, d.velocity));
    return this.momentum.add(_map(a.force, b.force, c.force, d.force));
  };

  Particle.prototype.integrateEuler = function(t, dt) {
    var f;
    f = this.forces({
      position: new Vector(this),
      momentum: new Vector(this.momentum)
    }, t + dt);
    this.add(this.velocity);
    this.momentum.add(f.force);
    return this.velocity = this.momentum.$divide(this.mass);
  };

  Particle.prototype.collideLine2d = function(wall, precise) {
    var collideEndPt, collided, crossed, curr_dist, curr_pos, dot, end_path, next_dist, next_pos, path, perpend, prev_pt_on_wall, proj, pt, pt2, pt_on_wall, pvec, r, tangent, wall_path;
    if (precise == null) {
      precise = true;
    }
    curr_pos = new Vector(this);
    curr_dist = Math.abs(wall.getDistanceFromPoint(curr_pos));
    collided = Math.abs(curr_dist) < this.radius;
    if (precise) {
      next_pos = this.$add(this.velocity);
      next_dist = Math.abs(wall.getDistanceFromPoint(next_pos));
      crossed = wall.intersectLine(new Line(curr_pos).to(next_pos));
      if (crossed) {
        next_pos = crossed.$add(this.velocity.$normalize().$multiply(-this.radius / 2));
        next_dist = Math.abs(wall.getDistanceFromPoint(next_pos));
        collided = true;
      }
    }
    if (collided) {
      pt_on_wall = wall.getPerpendicularFromPoint(curr_pos);
      wall_path = wall.$subtract(wall.p1);
      collideEndPt = false;
      if (!wall.withinBounds(pt_on_wall, Const.xy)) {
        if (this.intersectPoint(wall)) {
          collideEndPt = true;
          end_path = this.$subtract(wall);
        }
        if (this.intersectPoint(wall.p1)) {
          collideEndPt = true;
          end_path = this.$subtract(wall.p1);
        }
        if (collideEndPt) {
          wall_path = new Vector(-end_path.y, end_path.x);
        } else {
          return false;
        }
      }
      dot = wall_path.dot(this.velocity);
      proj = wall_path.$multiply(dot / wall_path.dot(wall_path));
      tangent = proj.$subtract(this.velocity);
      this.velocity = proj.$add(tangent);
      this.momentum = this.velocity.$multiply(this.mass);
      if (precise && !collideEndPt) {
        perpend = new Line(pt_on_wall).to(curr_pos);
        prev_pt_on_wall = wall.getPerpendicularFromPoint(next_pos);
        path = new Line(pt_on_wall).to(prev_pt_on_wall);
        pvec = path.direction();
        r = (this.radius - curr_dist) / (next_dist - curr_dist);
        pt = pvec.$multiply(r).$add(path);
        pt2 = pt.$add(perpend.direction().$normalize().$multiply(this.radius));
        this.set(pt2.$add(this.velocity.$normalize()));
      }
    }
    return collided;
  };

  Particle.prototype.collideWithinBounds = function(bound) {
    if (this.x - this.radius < bound.x || this.x + this.radius > bound.p1.x) {
      if (this.x - this.radius < bound.x) {
        this.x = bound.x + this.radius;
      } else if (this.x + this.radius > bound.p1.x) {
        this.x = bound.p1.x - this.radius;
      }
      this.velocity.x *= -1;
      this.momentum = this.velocity.$multiply(this.mass);
      return true;
    } else if (this.y - this.radius < bound.y || this.y + this.radius > bound.p1.y) {
      if (this.y - this.radius < bound.y) {
        this.y = bound.y + this.radius;
      } else if (this.y + this.radius > bound.p1.y) {
        this.y = bound.p1.y - this.radius;
      }
      this.velocity.y *= -1;
      this.momentum = this.velocity.$multiply(this.mass);
      return true;
    }
    return false;
  };

  Particle.prototype.collideParticle2d = function(pb) {
    if (this.hasIntersect(pb)) {
      return Particle.collideParticle2d(this, pb, true);
    } else {
      return false;
    }
  };

  Particle.collideParticle2d = function(pa, pb, update, checkOverlap) {
    var d1, d2, dir, dot1n, dot1t, dot2n, dot2t, mag, magDiff, normal, pav, pbv, tangent, v1n, v1t, v2n, v2t;
    if (update == null) {
      update = true;
    }
    if (checkOverlap == null) {
      checkOverlap = true;
    }
    normal = pa.$subtract(pb).normalize();
    tangent = new Vector(-normal.y, normal.x);
    dot1n = normal.dot(pa.velocity);
    dot1t = tangent.dot(pa.velocity);
    dot2n = normal.dot(pb.velocity);
    dot2t = tangent.dot(pb.velocity);
    d1 = (dot1n * (pa.mass - pb.mass) + 2 * pb.mass * dot2n) / (pa.mass + pb.mass);
    d2 = (dot2n * (pb.mass - pa.mass) + 2 * pa.mass * dot1n) / (pa.mass + pb.mass);
    v1n = normal.$multiply(d1);
    v1t = tangent.$multiply(dot1t);
    v2n = normal.$multiply(d2);
    v2t = tangent.$multiply(dot2t);
    pav = v1n.$add(v1t);
    pbv = v2n.$add(v2t);
    if (checkOverlap) {
      mag = pa.magnitude(pb);
      if (mag < pa.radius + pb.radius) {
        dir = pa.$subtract(pb).normalize();
        magDiff = Math.abs(mag - pa.radius - pb.radius) / 1.98;
        pa.add(dir.multiply(magDiff));
        pb.add(dir.multiply(-magDiff));
      }
    }
    if (update) {
      pa.velocity = pav;
      pb.velocity = pbv;
      pa.momentum = pa.velocity.$multiply(pa.mass);
      pb.momentum = pb.velocity.$multiply(pb.mass);
    }
    return [pav, pbv];
  };

  Particle.force_gravitation = function(state, t, pa, pb, g) {
    var d, force, mag, meterToPixel;
    if (g == null) {
      g = 0.0067;
    }
    meterToPixel = 30;
    d = pb.$subtract(state.position);
    mag = d.magnitude() / meterToPixel;
    force = mag === 0 ? 0 : t * g * pa.mass * pb.mass / (mag * mag);
    d.normalize().multiply(force);
    return {
      force: d
    };
  };

  Particle.RK4 = function(c, d, func, dt, t) {
    var a1, a2, a3, c1, c2, c3, c4, d1, d2, d3, d4, dc, dd;
    c1 = c;
    d1 = d;
    a1 = func(c1, d1, 0, t);
    c2 = c + 0.5 * d1 * dt;
    d2 = d + 0.5 * a1 * dt;
    a2 = func(c2, d2, dt / 2, t);
    c3 = c + 0.5 * d2 * dt;
    d3 = d + 0.5 * a2 * dt;
    a3 = func(c3, d3, dt / 2, t);
    c4 = c + d3 * dt;
    d4 = d + a3 * dt;
    dc = (c1 + 2 * (c2 + c3) + c4) / 6;
    dd = (d1 + 2 * (d2 + d3) + d4) / 6;
    return {
      c: c + dc * dt,
      d: d + dd * dt
    };
  };

  return Particle;

})(Circle);

this.Particle = Particle;

ParticleSystem = (function() {
  function ParticleSystem() {
    this.count = 0;
    this.particles = [];
    this.time = 0;
  }

  ParticleSystem.prototype.add = function(particle) {
    particle.id = this.count++;
    this.particles.push(particle);
    return this;
  };

  ParticleSystem.prototype.remove = function(particle) {
    if (particle && particle.life) {
      particle.life.complete = true;
    }
    return this;
  };

  ParticleSystem.prototype.animate = function(time, frame, ctx) {
    var _remove, aa, ab, i, index, len1, len2, p, ref, results;
    this.time++;
    _remove = [];
    ref = this.particles;
    for (i = aa = 0, len1 = ref.length; aa < len1; i = ++aa) {
      p = ref[i];
      if (p.life.complete) {
        _remove.push(i);
      } else if (p.life.active) {
        p.animate(time, frame, ctx);
      }
    }
    if (_remove.length > 0) {
      results = [];
      for (ab = 0, len2 = _remove.length; ab < len2; ab++) {
        index = _remove[ab];
        results.push(this.particles.splice(index, 1));
      }
      return results;
    }
  };

  return ParticleSystem;

})();

this.ParticleSystem = ParticleSystem;

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
    var aa, i, ins, len1, ln, p, pts;
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
          for (aa = 0, len1 = ins.length; aa < len1; aa++) {
            p = ins[aa];
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
    var aa, ref, results, t;
    results = [];
    for (t = aa = 0, ref = num; 0 <= ref ? aa <= ref : aa >= ref; t = 0 <= ref ? ++aa : --aa) {
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
    this.set(this.$min(rect));
    this.p1.set(this.p1.$max(rect.p1));
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
    var aa, len1, p, pts, s, sides;
    if (get_pts == null) {
      get_pts = true;
    }
    sides = this.sides();
    pts = [];
    for (aa = 0, len1 = sides.length; aa < len1; aa++) {
      s = sides[aa];
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
    var aa, ip1, ip2, lbound, len1, p, pts, s, sides;
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
    for (aa = 0, len1 = sides.length; aa < len1; aa++) {
      s = sides[aa];
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
    var aa, ab, intersected, len1, len2, p, pts, sa, sb, sidesA, sidesB, xi, yi, zi;
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
    for (aa = 0, len1 = sidesA.length; aa < len1; aa++) {
      sa = sidesA[aa];
      for (ab = 0, len2 = sidesB.length; ab < len2; ab++) {
        sb = sidesB[ab];
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

Grid = (function(superClass) {
  extend(Grid, superClass);

  function Grid() {
    Grid.__super__.constructor.apply(this, arguments);
    this.cell = {
      type: 'fix-fix',
      size: new Vector()
    };
    this.rows = 0;
    this.columns = 0;
    this.layout = [];
    this.cellCallback = null;
  }

  Grid.prototype.toString = function() {
    var s;
    s = this.size();
    return ("Grid width " + s.x + ", height " + s.y + ", columns " + this.columns + ", rows " + this.rows + ", ") + ("cell (" + this.cell.size.x + ", " + this.cell.size.y + "), type " + this.cell.type);
  };

  Grid.prototype.init = function(x, y, xtype, ytype) {
    var size;
    if (xtype == null) {
      xtype = 'fix';
    }
    if (ytype == null) {
      ytype = 'fix';
    }
    size = this.size();
    this.cell.type = xtype + '-' + ytype;
    this.rows = y;
    this.columns = x;
    if (xtype === 'stretch') {
      this.cell.size.x = size.x / x;
      this.columns = x;
    } else if (xtype === 'flex') {
      this.columns = Math.round(size.x / x);
      this.cell.size.x = size.x / this.columns;
    } else {
      this.cell.size.x = x;
      this.columns = Math.floor(size.x / this.cell.size.x);
    }
    if (ytype === 'stretch') {
      this.cell.size.y = size.y / y;
      this.rows = y;
    } else if (ytype === 'flex') {
      this.rows = Math.round(size.y / y);
      this.cell.size.y = size.y / this.rows;
    } else {
      this.cell.size.y = y;
      this.rows = Math.floor(size.y / this.cell.size.y);
    }
    if (this.layout.length < 1) {
      this.resetLayout();
    }
    return this;
  };

  Grid.prototype.generate = function(callback) {
    if (typeof callback === "function") {
      this.cellCallback = callback;
    }
    return this;
  };

  Grid.prototype.create = function() {
    var aa, ab, c, cell, isOccupied, pos, r, ref, ref1;
    if (!this.cellCallback) {
      return this;
    }
    for (c = aa = 0, ref = this.columns; 0 <= ref ? aa < ref : aa > ref; c = 0 <= ref ? ++aa : --aa) {
      for (r = ab = 0, ref1 = this.rows; 0 <= ref1 ? ab < ref1 : ab > ref1; r = 0 <= ref1 ? ++ab : --ab) {
        cell = this.cell.size.clone();
        pos = this.$add(cell.$multiply(c, r));
        isOccupied = this.layout.length > 0 && this.layout[0].length > 0 ? this.layout[r][c] === 1 : false;
        this.cellCallback(cell, pos, r, c, this.cell.type, isOccupied);
      }
    }
    return this;
  };

  Grid.prototype.getCellSize = function() {
    return this.cell.size.clone();
  };

  Grid.prototype.cellToRectangle = function(c, r, allowOutofBound) {
    var rect;
    if (allowOutofBound == null) {
      allowOutofBound = false;
    }
    if (allowOutofBound || (c >= 0 && c < this.columns && r >= 0 && r < this.rows)) {
      rect = new Rectangle(this.$add(this.cell.size.$multiply(c, r))).resizeTo(this.cell.size);
      return rect;
    } else {
      return false;
    }
  };

  Grid.prototype.positionToCell = function(args) {
    var cellpos, pos;
    pos = new Vector(this._getArgs(arguments));
    cellpos = pos.$subtract(this).$divide(this.cell.size).floor();
    cellpos.max(0, 0).min(this.columns - 1, this.rows - 1);
    return cellpos;
  };

  Grid.prototype.resetLayout = function(callback) {
    var aa, ab, c, r, ref, ref1;
    this.layout = [];
    for (r = aa = 0, ref = this.rows; 0 <= ref ? aa < ref : aa > ref; r = 0 <= ref ? ++aa : --aa) {
      this.layout[r] = [];
      for (c = ab = 0, ref1 = this.columns; 0 <= ref1 ? ab < ref1 : ab > ref1; c = 0 <= ref1 ? ++ab : --ab) {
        this.layout[r][c] = 0;
        if (callback) {
          callback(this, r, c);
        }
      }
    }
    return this;
  };

  Grid.prototype.occupy = function(x, y, w, h, occupy) {
    var aa, ab, c, r, ref, ref1;
    if (occupy == null) {
      occupy = true;
    }
    if (this.rows <= 0 || this.columns <= 0) {
      return this;
    }
    if (this.layout.length < 1) {
      this.resetLayout();
    }
    for (c = aa = 0, ref = w; 0 <= ref ? aa < ref : aa > ref; c = 0 <= ref ? ++aa : --aa) {
      for (r = ab = 0, ref1 = h; 0 <= ref1 ? ab < ref1 : ab > ref1; r = 0 <= ref1 ? ++ab : --ab) {
        this.layout[Math.min(this.layout.length - 1, y + r)][x + c] = (occupy ? 1 : 0);
      }
    }
    return this;
  };

  Grid.prototype.canFit = function(x, y, w, h) {
    var aa, ab, cell, currCol, currRow, ref, ref1, ref2, ref3;
    for (currRow = aa = ref = y, ref1 = Math.min(this.rows, y + h); ref <= ref1 ? aa < ref1 : aa > ref1; currRow = ref <= ref1 ? ++aa : --aa) {
      for (currCol = ab = ref2 = x, ref3 = Math.min(this.columns, x + w); ref2 <= ref3 ? ab < ref3 : ab > ref3; currCol = ref2 <= ref3 ? ++ab : --ab) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          return false;
        }
      }
    }
    return true;
  };

  Grid.prototype.fit = function(cols, rows) {
    var aa, ab, b, cell, colCount, colSize, currCol, currRow, freeCol, ref, ref1;
    colSize = Math.min(cols, this.columns);
    for (currRow = aa = 0, ref = this.rows; 0 <= ref ? aa < ref : aa > ref; currRow = 0 <= ref ? ++aa : --aa) {
      colCount = colSize;
      freeCol = 0;
      for (currCol = ab = 0, ref1 = this.columns; 0 <= ref1 ? ab < ref1 : ab > ref1; currCol = 0 <= ref1 ? ++ab : --ab) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol++;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount <= 0) {
            this.occupy(freeCol, currRow, colSize, rows);
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
    return false;
  };

  Grid.prototype.neighbors = function(c, r) {
    var aa, len1, n, ns, temp;
    temp = [[c - 1, r - 1], [c, r - 1], [c + 1, r - 1], [c + 1, r], [c + 1, r + 1], [c, r + 1], [c - 1, r + 1], [c - 1, r]];
    ns = [];
    for (aa = 0, len1 = temp.length; aa < len1; aa++) {
      n = temp[aa];
      if (n[0] >= 0 && n[0] < this.columns && n[1] >= 0 && n[1] < this.rows) {
        ns.push(new Vector(n[0], n[1], this.layout[n[1]][n[0]]));
      } else {
        ns.push(false);
      }
    }
    return ns;
  };

  return Grid;

})(Rectangle);

this.Grid = Grid;

PointSet = (function(superClass) {
  extend(PointSet, superClass);

  function PointSet() {
    PointSet.__super__.constructor.apply(this, arguments);
    this.points = [];
  }

  PointSet.prototype.toString = function() {
    var aa, len1, p, ref, str;
    str = "PointSet [ ";
    ref = this.points;
    for (aa = 0, len1 = ref.length; aa < len1; aa++) {
      p = ref[aa];
      str += p.x + "," + p.y + "," + p.z + ", ";
    }
    return str + " ]";
  };

  PointSet.prototype.toArray = function() {
    return this.points.slice();
  };

  PointSet.prototype.to = function(args) {
    var aa, len1, p, ref;
    if (arguments.length > 0) {
      if (Array.isArray(arguments[0]) && arguments[0].length > 0 && typeof arguments[0][0] === 'object') {
        ref = arguments[0];
        for (aa = 0, len1 = ref.length; aa < len1; aa++) {
          p = ref[aa];
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
    var aa, len1, p, ref;
    if (arguments.length > 0) {
      if (Array.isArray(arguments[0]) && arguments[0].length > 0) {
        ref = arguments[0];
        for (aa = 0, len1 = ref.length; aa < len1; aa++) {
          p = ref[aa];
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
    var aa, lastP, len1, p, ref, sides;
    if (close_path == null) {
      close_path = true;
    }
    lastP = null;
    sides = [];
    ref = this.points;
    for (aa = 0, len1 = ref.length; aa < len1; aa++) {
      p = ref[aa];
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
    var aa, angles, i, ref, v1, v2;
    if (axis == null) {
      axis = Const.xy;
    }
    angles = [];
    for (i = aa = 1, ref = this.points.length - 1; aa < ref; i = aa += 1) {
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

Curve = (function(superClass) {
  extend(Curve, superClass);

  function Curve() {
    Curve.__super__.constructor.apply(this, arguments);
    this.is3D = false;
  }

  Curve.prototype._getSteps = function(steps) {
    var aa, ref, s, t, ts;
    ts = [];
    for (s = aa = 0, ref = steps; aa <= ref; s = aa += 1) {
      t = s / steps;
      ts.push([t, t * t, t * t * t]);
    }
    return ts;
  };

  Curve.prototype.controlPoints = function(index, copyStart) {
    var _index, p0, p1, p2, p3;
    if (index == null) {
      index = 0;
    }
    if (copyStart == null) {
      copyStart = false;
    }
    _index = (function(_this) {
      return function(i) {
        var idx;
        idx = i < _this.points.length - 1 ? i : _this.points.length - 1;
        return idx;
      };
    })(this);
    p0 = this.points[index];
    if (p0.x == null) {
      return false;
    }
    index = copyStart ? index : index + 1;
    p1 = this.points[_index(index++)];
    p2 = this.points[_index(index++)];
    p3 = this.points[_index(index++)];
    return {
      p0: p0,
      p1: p1,
      p2: p2,
      p3: p3
    };
  };

  Curve.prototype.catmullRom = function(steps) {
    var aa, ab, c, i, k, ps, ref, ref1, ts;
    if (steps == null) {
      steps = 10;
    }
    if (this.points.length < 2) {
      return [];
    }
    ps = [];
    ts = this._getSteps(steps);
    c = this.controlPoints(0, true);
    for (i = aa = 0, ref = steps; aa <= ref; i = aa += 1) {
      ps.push(this.catmullRomPoint(ts[i], c));
    }
    k = 0;
    while (k < this.points.length - 2) {
      c = this.controlPoints(k);
      if (c) {
        for (i = ab = 0, ref1 = steps; ab <= ref1; i = ab += 1) {
          ps.push(this.catmullRomPoint(ts[i], c));
        }
        k++;
      }
    }
    return ps;
  };

  Curve.prototype.catmullRomPoint = function(step, ctrls) {
    var h1, h2, h3, h4, t, t2, t3, x, y, z;
    t = step[0];
    t2 = step[1];
    t3 = step[2];
    h1 = -0.5 * t3 + t2 - 0.5 * t;
    h2 = 1.5 * t3 - 2.5 * t2 + 1;
    h3 = -1.5 * t3 + 2 * t2 + 0.5 * t;
    h4 = 0.5 * t3 - 0.5 * t2;
    x = h1 * ctrls.p0.x + h2 * ctrls.p1.x + h3 * ctrls.p2.x + h4 * ctrls.p3.x;
    y = h1 * ctrls.p0.y + h2 * ctrls.p1.y + h3 * ctrls.p2.y + h4 * ctrls.p3.y;
    z = !this.is3D ? 0 : h1 * ctrls.p0.z + h2 * ctrls.p1.z + h3 * ctrls.p2.z + h4 * ctrls.p3.z;
    return new Point(x, y, z);
  };

  Curve.prototype.cardinal = function(steps, tension) {
    var aa, ab, c, i, k, ps, ref, ref1, ts;
    if (steps == null) {
      steps = 10;
    }
    if (tension == null) {
      tension = 0.5;
    }
    if (this.points.length < 2) {
      return [];
    }
    ps = [];
    ts = this._getSteps(steps);
    c = this.controlPoints(0, true);
    for (i = aa = 0, ref = steps; aa <= ref; i = aa += 1) {
      ps.push(this.cardinalPoint(ts[i], c, tension));
    }
    k = 0;
    while (k < this.points.length - 2) {
      c = this.controlPoints(k);
      if (c) {
        for (i = ab = 0, ref1 = steps; ab <= ref1; i = ab += 1) {
          ps.push(this.cardinalPoint(ts[i], c, tension));
        }
        k++;
      }
    }
    return ps;
  };

  Curve.prototype.cardinalPoint = function(step, ctrls, tension) {
    var h1, h2, h2a, h3, h3a, h4, t, t2, t3, x, y, z;
    if (tension == null) {
      tension = 0.5;
    }
    t = step[0];
    t2 = step[1];
    t3 = step[2];
    h1 = tension * (-1 * t3 + 2 * t2 - t);
    h2 = tension * (-1 * t3 + t2);
    h2a = 2 * t3 - 3 * t2 + 1;
    h3 = tension * (t3 - 2 * t2 + t);
    h3a = -2 * t3 + 3 * t2;
    h4 = tension * (t3 - t2);
    x = ctrls.p0.x * h1 + ctrls.p1.x * h2 + h2a * ctrls.p1.x + ctrls.p2.x * h3 + h3a * ctrls.p2.x + ctrls.p3.x * h4;
    y = ctrls.p0.y * h1 + ctrls.p1.y * h2 + h2a * ctrls.p1.y + ctrls.p2.y * h3 + h3a * ctrls.p2.y + ctrls.p3.y * h4;
    z = !this.is3D ? 0 : ctrls.p0.z * h1 + ctrls.p1.z * h2 + h2a * ctrls.p1.z + ctrls.p2.z * h3 + h3a * ctrls.p2.z + ctrls.p3.z * h4;
    return new Point(x, y, z);
  };

  Curve.prototype.bezier = function(steps) {
    var aa, c, i, k, ps, ref, ts;
    if (steps == null) {
      steps = 10;
    }
    if (this.points.length < 4) {
      return [];
    }
    ps = [];
    ts = this._getSteps(steps);
    k = 0;
    while (k <= this.points.length - 3) {
      c = this.controlPoints(k);
      if (c) {
        for (i = aa = 0, ref = steps; aa <= ref; i = aa += 1) {
          ps.push(this.bezierPoint(ts[i], c));
        }
        k += 3;
      }
    }
    return ps;
  };

  Curve.prototype.bezierPoint = function(step, ctrls) {
    var h1, h2, h3, h4, t, t2, t3, x, y, z;
    t = step[0];
    t2 = step[1];
    t3 = step[2];
    h1 = -1 * t3 + 3 * t2 - 3 * t + 1;
    h2 = 3 * t3 - 6 * t2 + 3 * t;
    h3 = -3 * t3 + 3 * t2;
    h4 = t3;
    x = h1 * ctrls.p0.x + h2 * ctrls.p1.x + h3 * ctrls.p2.x + h4 * ctrls.p3.x;
    y = h1 * ctrls.p0.y + h2 * ctrls.p1.y + h3 * ctrls.p2.y + h4 * ctrls.p3.y;
    z = !this.is3D ? 0 : h1 * ctrls.p0.z + h2 * ctrls.p1.z + h3 * ctrls.p2.z + h4 * ctrls.p3.z;
    return new Point(x, y, z);
  };

  Curve.prototype.bspline = function(steps, tension) {
    var aa, ab, c, i, k, ps, ref, ref1, ts;
    if (steps == null) {
      steps = 10;
    }
    if (tension == null) {
      tension = false;
    }
    if (this.points.length < 2) {
      return [];
    }
    ps = [];
    ts = this._getSteps(steps);
    k = 0;
    while (k < this.points.length - 2) {
      c = this.controlPoints(k);
      if (c) {
        if (!tension) {
          for (i = aa = 0, ref = steps; aa <= ref; i = aa += 1) {
            ps.push(this.bsplinePoint(ts[i], c));
          }
        } else {
          for (i = ab = 0, ref1 = steps; ab <= ref1; i = ab += 1) {
            ps.push(this.bsplineTensionPoint(ts[i], c, tension));
          }
        }
        k++;
      }
    }
    return ps;
  };

  Curve.prototype.bsplinePoint = function(step, ctrls) {
    var h1, h2, h3, h4, t, t2, t3, x, y, z;
    t = step[0];
    t2 = step[1];
    t3 = step[2];
    h1 = -0.16666666666 * t3 + 0.5 * t2 - 0.5 * t + 0.16666666666;
    h2 = 0.5 * t3 - t2 + 0.66666666666;
    h3 = -0.5 * t3 + 0.5 * t2 + 0.5 * t + 0.16666666666;
    h4 = 0.16666666666 * t3;
    x = h1 * ctrls.p0.x + h2 * ctrls.p1.x + h3 * ctrls.p2.x + h4 * ctrls.p3.x;
    y = h1 * ctrls.p0.y + h2 * ctrls.p1.y + h3 * ctrls.p2.y + h4 * ctrls.p3.y;
    z = !this.is3D ? 0 : h1 * ctrls.p0.z + h2 * ctrls.p1.z + h3 * ctrls.p2.z + h4 * ctrls.p3.z;
    return new Point(x, y, z);
  };

  Curve.prototype.bsplineTensionPoint = function(step, ctrls, tension) {
    var h1, h2, h2a, h3, h3a, h4, t, t2, t3, x, y, z;
    if (tension == null) {
      tension = 1;
    }
    t = step[0];
    t2 = step[1];
    t3 = step[2];
    h1 = tension * (-0.16666666666 * t3 + 0.5 * t2 - 0.5 * t + 0.16666666666);
    h2 = tension * (-1.5 * t3 + 2 * t2 - 0.33333333333);
    h2a = 2 * t3 - 3 * t2 + 1;
    h3 = tension * (1.5 * t3 - 2.5 * t2 + 0.5 * t + 0.16666666666);
    h3a = -2 * t3 + 3 * t2;
    h4 = tension * (0.16666666666 * t3);
    x = h1 * ctrls.p0.x + h2 * ctrls.p1.x + h2a * ctrls.p1.x + h3 * ctrls.p2.x + h3a * ctrls.p2.x + h4 * ctrls.p3.x;
    y = h1 * ctrls.p0.y + h2 * ctrls.p1.y + h2a * ctrls.p1.y + h3 * ctrls.p2.y + h3a * ctrls.p2.y + h4 * ctrls.p3.y;
    z = !this.is3D ? 0 : h1 * ctrls.p0.z + h2 * ctrls.p1.z + h2a * ctrls.p1.y + h3 * ctrls.p2.z + h3a * ctrls.p2.z + h4 * ctrls.p3.z;
    return new Point(x, y, z);
  };

  return Curve;

})(PointSet);

this.Curve = Curve;

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

  Triangle.prototype.getAt = function(index) {
    if (index === 1 || index === "p1") {
      return this.p1;
    }
    if (index === 2 || index === "p2") {
      return this.p2;
    }
    return this;
  };

  Triangle.prototype.$getAt = function(index) {
    return new Vector(this.getAt(index));
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
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = sides.length; aa < len1; aa++) {
        side = sides[aa];
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
      var aa, len1, results;
      results = [];
      for (aa = 0, len1 = sides.length; aa < len1; aa++) {
        s = sides[aa];
        results.push(s.collinear(p) > 0);
      }
      return results;
    })();
    return hp[0] === hp[1] && hp[1] === hp[2];
  };

  Triangle.prototype.intersectPath = function(path, get_pts, axis) {
    var aa, len1, p, pts, s, sides;
    if (get_pts == null) {
      get_pts = true;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    sides = this.sides();
    pts = [];
    for (aa = 0, len1 = sides.length; aa < len1; aa++) {
      s = sides[aa];
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
    var aa, ins, len1, p, pts;
    if (get_pts == null) {
      get_pts = true;
    }
    if (axis == null) {
      axis = Const.xy;
    }
    ins = this.intersectPath(line, true, axis);
    pts = [];
    for (aa = 0, len1 = ins.length; aa < len1; aa++) {
      p = ins[aa];
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
    var aa, ab, c, r, ref, ref1, ref2, ref3;
    for (c = aa = ref = x, ref1 = w + x; ref <= ref1 ? aa < ref1 : aa > ref1; c = ref <= ref1 ? ++aa : --aa) {
      for (r = ab = ref2 = y, ref3 = h + y; ref2 <= ref3 ? ab < ref3 : ab > ref3; r = ref2 <= ref3 ? ++ab : --ab) {
        if (this.layout[r] == null) {
          this.layout[r] = [];
        }
        this.layout[r][c] = 1;
      }
    }
    return this;
  };

  GridCascade.prototype.findStartRow = function() {
    var aa, ab, c, index, r, ref, ref1, ref2;
    index = this.startRow;
    for (r = aa = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? aa < ref1 : aa > ref1; r = ref <= ref1 ? ++aa : --aa) {
      index = r;
      for (c = ab = 0, ref2 = this.columns; 0 <= ref2 ? ab < ref2 : ab > ref2; c = 0 <= ref2 ? ++ab : --ab) {
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
    var aa, ab, ac, allRowsFree, b, cell, colCount, colSize, currCol, currRow, freeCol, rc, ref, ref1, ref2, ref3, ref4;
    colSize = Math.min(cols, this.columns);
    for (currRow = aa = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? aa < ref1 : aa > ref1; currRow = ref <= ref1 ? ++aa : --aa) {
      colCount = colSize;
      freeCol = 0;
      if (currRow + rows >= this.rows) {
        this.rows += rows;
      }
      if (this.layout[currRow] == null) {
        this.layout[currRow] = [];
      }
      for (currCol = ab = 0, ref2 = this.columns; 0 <= ref2 ? ab < ref2 : ab > ref2; currCol = 0 <= ref2 ? ++ab : --ab) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol = currCol + 1;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount === 0) {
            allRowsFree = true;
            if (rows > 1) {
              for (rc = ac = ref3 = currRow, ref4 = currRow + rows; ref3 <= ref4 ? ac < ref4 : ac > ref4; rc = ref3 <= ref4 ? ++ac : --ac) {
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
    var aa, len1, p, temp;
    if (removal == null) {
      removal = false;
    }
    temp = [];
    for (aa = 0, len1 = particles.length; aa < len1; aa++) {
      p = particles[aa];
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
    var _depth, aa, ab, i, item, k, len1, len2, q, ref, ref1, ref2, results, t;
    this.quads = this.quadrants();
    ref = this.quads;
    for (k in ref) {
      q = ref[k];
      q.depth = this.depth + 1;
    }
    ref1 = this.items;
    for (i = aa = 0, len1 = ref1.length; aa < len1; i = ++aa) {
      item = ref1[i];
      _depth = this.addToQuad(item);
      if (_depth > this.depth) {
        this.items[i] = null;
      }
    }
    ref2 = this.items;
    results = [];
    for (ab = 0, len2 = ref2.length; ab < len2; ab++) {
      t = ref2[ab];
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
    var a, aa, ab, best, bestDist, i, j, nearest, p, r, ref, ref1, s, x, y;
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
        for (j = aa = 0, ref = numSamples; aa < ref; j = aa += 1) {
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
      for (i = ab = 0, ref1 = numSamples; ab < ref1; i = ab += 1) {
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
    var _dist, aa, dist, dx, dy, halfbound, it, len1, matches, w;
    _dist = this.bestcandidate.maxDist;
    halfbound = new Rectangle(p.x - this.bestcandidate.quartersize.x, p.y - this.bestcandidate.quartersize.y).size(this.bestcandidate.halfsize.x, this.bestcandidate.halfsize.y);
    matches = (function() {
      var aa, len1, ref, results;
      ref = this.points;
      results = [];
      for (aa = 0, len1 = ref.length; aa < len1; aa++) {
        it = ref[aa];
        if (halfbound.intersectPoint(it)) {
          results.push(it);
        }
      }
      return results;
    }).call(this);
    for (aa = 0, len1 = matches.length; aa < len1; aa++) {
      w = matches[aa];
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
    var aa, ab, dx, dy, i, i0, i1, j, j0, j1, o, ref, ref1, ref2, ref3, s;
    i = Math.floor(x / this.poisson.cellSize);
    j = Math.floor(y / this.poisson.cellSize);
    i0 = Math.max(i - 2, 0);
    j0 = Math.max(j - 2, 0);
    i1 = Math.min(i + 3, this.poisson.gridWidth);
    j1 = Math.min(j + 3, this.poisson.gridHeight);
    for (j = aa = ref = j0, ref1 = j1; aa < ref1; j = aa += 1) {
      o = j * this.poisson.gridWidth;
      for (i = ab = ref2 = i0, ref3 = i1; ab < ref3; i = ab += 1) {
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
    var _nearest, aa, best, bestDist, halfsize, i, maxDist, nearest, p, quartersize, ref, size;
    if (samples == null) {
      samples = 10;
    }
    size = bound.size();
    halfsize = size.$divide(2);
    quartersize = size.$divide(4);
    maxDist = size.x * size.x + size.y * size.y;
    _nearest = function(p) {
      var _dist, aa, dist, dx, dy, halfbound, it, len1, matches, w;
      _dist = maxDist;
      halfbound = new Rectangle(p.x - quartersize.x, p.y - quartersize.y).size(halfsize.x, halfsize.y);
      matches = (function() {
        var aa, len1, results;
        results = [];
        for (aa = 0, len1 = items.length; aa < len1; aa++) {
          it = items[aa];
          if (halfbound.intersetPoint(it)) {
            results.push(it);
          }
        }
        return results;
      })();
      for (aa = 0, len1 = matches.length; aa < len1; aa++) {
        w = matches[aa];
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
    for (i = aa = 0, ref = samples; 0 <= ref ? aa < ref : aa > ref; i = 0 <= ref ? ++aa : --aa) {
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
    var aa, ab, d, diff, dx, dy, freq, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = aa = 0, ref = freq.y - 1; 0 <= ref ? aa <= ref : aa >= ref; d = 0 <= ref ? ++aa : --aa) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy + diff.y).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = ab = 0, ref1 = freq.x - 1; 0 <= ref1 ? ab <= ref1 : ab >= ref1; d = 0 <= ref1 ? ++ab : --ab) {
      dx = diff.x * d;
      p = new Pair(dx, 0).to(dx + diff.x + 0.5, size.y).add(this);
      p.p1.add(this);
      result.columns.push(p);
    }
    return result;
  };

  StripeBound.prototype.getStripeLines = function() {
    var aa, ab, d, diff, dx, dy, freq, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = aa = 0, ref = freq.y; 0 <= ref ? aa <= ref : aa >= ref; d = 0 <= ref ? ++aa : --aa) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = ab = 0, ref1 = freq.x; 0 <= ref1 ? ab <= ref1 : ab >= ref1; d = 0 <= ref1 ? ++ab : --ab) {
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
      var aa, results;
      results = [];
      for (i = aa = 0; aa < 512; i = ++aa) {
        results.push(this.p[i & 255]);
      }
      return results;
    }).call(this);
  }

  Noise.prototype.seed = function(seed) {
    var aa, i, results, v;
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }
    results = [];
    for (i = aa = 0; aa <= 255; i = ++aa) {
      v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      results.push(this.perm[i] = this.perm[i + 256] = v);
    }
    return results;
  };

  Noise.prototype._dot = function(g, x, y) {
    return g[0] * x + g[1] * y;
  };

  Noise.prototype.perlin2D = function(xin, yin) {
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

  Noise.prototype.simplex2D = function(xin, yin) {
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

this.Noise = Noise;

Delaunay = (function(superClass) {
  extend(Delaunay, superClass);

  function Delaunay() {
    Delaunay.__super__.constructor.apply(this, arguments);
    this.mesh = [];
  }

  Delaunay.prototype.generate = function() {
    var aa, ab, ac, c, circum, closed, dx, dy, edges, i, indices, j, len1, len2, n, open, opened, pts, ref, st;
    if (this.points.length < 3) {
      return;
    }
    n = this.points.length;
    indices = [];
    for (i = aa = 0, ref = n; aa < ref; i = aa += 1) {
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
    for (ab = 0, len1 = indices.length; ab < len1; ab++) {
      c = indices[ab];
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
    for (ac = 0, len2 = opened.length; ac < len2; ac++) {
      open = opened[ac];
      if (open.i < n && open.j < n && open.k < n) {
        closed.push(open);
      }
    }
    this.mesh = closed;
    return this.mesh;
  };

  Delaunay.prototype._supertriangle = function() {
    var aa, d, dmax, len1, maxPt, mid, minPt, p, ref;
    minPt = new Vector();
    maxPt = new Vector();
    ref = this.points;
    for (aa = 0, len1 = ref.length; aa < len1; aa++) {
      p = ref[aa];
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

Shaping = (function() {
  function Shaping() {}

  Shaping.linear = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return c * t;
  };

  Shaping.quadraticIn = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return c * t * t;
  };

  Shaping.quadraticOut = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return -c * t * (t - 2);
  };

  Shaping.quadraticInOut = function(t, c) {
    var dt;
    if (c == null) {
      c = 1;
    }
    dt = t * 2;
    if (t < 0.5) {
      return c / 2 * t * t * 4;
    } else {
      return -c / 2 * ((dt - 1) * (dt - 3) - 1);
    }
  };

  Shaping.cubicIn = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return c * t * t * t;
  };

  Shaping.cubicOut = function(t, c) {
    var dt;
    if (c == null) {
      c = 1;
    }
    dt = t - 1;
    return c * (dt * dt * dt + 1);
  };

  Shaping.cubicInOut = function(t, c) {
    var dt;
    if (c == null) {
      c = 1;
    }
    dt = t * 2;
    if (t < 0.5) {
      return c / 2 * dt * dt * dt;
    } else {
      return c / 2 * ((dt - 2) * (dt - 2) * (dt - 2) + 2);
    }
  };

  Shaping.exponentialIn = function(t, c, p) {
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.25;
    }
    return c * Math.pow(t, 1 / p);
  };

  Shaping.exponentialOut = function(t, c, p) {
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.25;
    }
    return c * Math.pow(t, p);
  };

  Shaping.sineIn = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return -c * Math.cos(t * Const.half_pi) + c;
  };

  Shaping.sineOut = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return c * Math.sin(t * Const.half_pi);
  };

  Shaping.sineInOut = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return -c / 2 * (Math.cos(Math.PI * t) - 1);
  };

  Shaping.cosineApprox = function(t, c) {
    var t2, t4, t6;
    if (c == null) {
      c = 1;
    }
    t2 = t * t;
    t4 = t2 * t2;
    t6 = t4 * t2;
    return c * (4 * t6 / 9 - 17 * t4 / 9 + 22 * t2 / 9);
  };

  Shaping.circularIn = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return -c * (Math.sqrt(1 - t * t) - 1);
  };

  Shaping.circularOut = function(t, c) {
    var dt;
    if (c == null) {
      c = 1;
    }
    dt = t - 1;
    return c * Math.sqrt(1 - dt * dt);
  };

  Shaping.circularInOut = function(t, c) {
    var dt;
    if (c == null) {
      c = 1;
    }
    dt = t * 2;
    if (t < 0.5) {
      return -c / 2 * (Math.sqrt(1 - dt * dt) - 1);
    } else {
      return c / 2 * (Math.sqrt(1 - (dt - 2) * (dt - 2)) + 1);
    }
  };

  Shaping.elasticIn = function(t, c, p) {
    var dt, s;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.7;
    }
    dt = t - 1;
    s = (p / Const.two_pi) * 1.5707963267948966;
    return c * (-Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p));
  };

  Shaping.elasticOut = function(t, c, p) {
    var s;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.7;
    }
    s = (p / Const.two_pi) * 1.5707963267948966;
    return c * (Math.pow(2, -10 * t) * Math.sin((t - s) * Const.two_pi / p)) + c;
  };

  Shaping.elasticInOut = function(t, c, p) {
    var dt, s;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.6;
    }
    dt = t * 2;
    s = (p / Const.two_pi) * 1.5707963267948966;
    if (t < 0.5) {
      dt -= 1;
      return c * (-0.5 * (Math.pow(2, 10 * dt) * Math.sin((dt - s) * Const.two_pi / p)));
    } else {
      dt -= 1;
      return c * (0.5 * (Math.pow(2, -10 * dt) * Math.sin((dt - s) * Const.two_pi / p))) + c;
    }
  };

  Shaping.bounceIn = function(t, c) {
    if (c == null) {
      c = 1;
    }
    return c - Shaping.bounceOut(1 - t, c);
  };

  Shaping.bounceOut = function(t, c) {
    if (c == null) {
      c = 1;
    }
    if (t < (1 / 2.75)) {
      return c * (7.5625 * t * t);
    } else if (t < (2 / 2.75)) {
      t -= 1.5 / 2.75;
      return c * (7.5625 * t * t + 0.75);
    } else if (t < (2.5 / 2.75)) {
      t -= 2.25 / 2.75;
      return c * (7.5625 * t * t + 0.9375);
    } else {
      t -= 2.625 / 2.75;
      return c * (7.5625 * t * t + 0.984375);
    }
  };

  Shaping.bounceInOut = function(t, c) {
    if (c == null) {
      c = 1;
    }
    if (t < 0.5) {
      return Shaping.bounceIn(t * 2, c) / 2;
    } else {
      return Shaping.bounceOut(t * 2 - 1, c) / 2 + c / 2;
    }
  };

  Shaping.sigmoid = function(t, c, p) {
    var d;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 10;
    }
    d = p * (t - 0.5);
    return c / (1 + Math.exp(-d));
  };

  Shaping.logSigmoid = function(t, c, p) {
    var A, B, C;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.7;
    }
    p = Math.max(Const.epsilon, Math.min(1 - Const.epsilon, p));
    p = 1 / (1 - p);
    A = 1 / (1 + Math.exp((t - 0.5) * p * -2));
    B = 1 / (1 + Math.exp(p));
    C = 1 / (1 + Math.exp(-p));
    return c * (A - B) / (C - B);
  };

  Shaping.seat = function(t, c, p) {
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.5;
    }
    if (t < 0.5) {
      return c * (Math.pow(2 * t, 1 - p)) / 2;
    } else {
      return c * (1 - (Math.pow(2 * (1 - t), 1 - p)) / 2);
    }
  };

  Shaping.quadraticBezier = function(t, c, p) {
    var a, b, d, om2a;
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = new Point(0.05, 0.95);
    }
    a = p.x ? p.x : p;
    b = p.y ? p.y : 0.5;
    om2a = 1 - 2 * a;
    if (om2a === 0) {
      om2a = Const.epsilon;
    }
    d = (Math.sqrt(a * a + om2a * t) - a) / om2a;
    return c * ((1 - 2 * b) * (d * d) + (2 * b) * d);
  };

  Shaping.cubicBezier = function(t, c, p1, p2) {
    var curve;
    if (c == null) {
      c = 1;
    }
    if (p1 == null) {
      p1 = new Point(0.1, 0.7);
    }
    if (p2 == null) {
      p2 = new Point(0.9, 0.2);
    }
    curve = new Curve().to([new Point(0, 0), p1, p2, new Point(1, 1)]);
    return c * curve.bezierPoint([t, t * t, t * t * t], curve.controlPoints()).y;
  };

  Shaping.quadraticTarget = function(t, c, p1) {
    var A, B, a, b, y;
    if (c == null) {
      c = 1;
    }
    if (p1 == null) {
      p1 = new Point(0.2, 0.35);
    }
    a = Math.min(1 - Const.epsilon, Math.max(Const.epsilon, p1.x));
    b = Math.min(1, Math.max(0, p1.y));
    A = (1 - b) / (1 - a) - (b / a);
    B = (A * (a * a) - b) / a;
    y = A * (t * t) - B * t;
    return c * Math.min(1, Math.max(0, y));
  };

  Shaping.cliff = function(t, c, p) {
    if (c == null) {
      c = 1;
    }
    if (p == null) {
      p = 0.5;
    }
    if (t > p) {
      return c;
    } else {
      return 0;
    }
  };

  Shaping.step = function(fn, steps, t, c, p1, p2) {
    var s, tt;
    s = 1 / steps;
    tt = Math.floor(t / s) * s;
    return fn(tt, c, p1, p2);
  };

  return Shaping;

})();

this.Shaping = Shaping;

//# sourceMappingURL=pt.js.map
}).call(Pt); module.exports = Pt;