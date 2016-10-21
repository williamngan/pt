var CanvasSpace,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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

//# sourceMappingURL=.map/CanvasSpace.js.map