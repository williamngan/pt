var CanvasSpace,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CanvasSpace = (function(superClass) {
  extend(CanvasSpace, superClass);

  function CanvasSpace(id, bgcolor, context) {
    if (id == null) {
      id = 'pt_space';
    }
    if (bgcolor == null) {
      bgcolor = false;
    }
    if (context == null) {
      context = '2d';
    }
    this._resizeHandler = bind(this._resizeHandler, this);
    CanvasSpace.__super__.constructor.apply(this, arguments);
    this.space = document.querySelector("#" + this.id);
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.pixelScale = 1;
    this.appended = true;
    if (!this.space) {
      this.space = document.createElement("canvas");
      this.space.setAttribute("id", this.id);
      this.appended = false;
    }
    this._mdown = false;
    this._mdrag = false;
    this.bgcolor = bgcolor;
    this.ctx = this.space.getContext(context);
  }

  CanvasSpace.prototype.display = function(parent_id, readyCallback, devicePixelSupport) {
    var r1, r2;
    if (parent_id == null) {
      parent_id = "#pt";
    }
    if (devicePixelSupport == null) {
      devicePixelSupport = true;
    }
    if (!this.appended) {
      this.bound = document.querySelector(parent_id);
      this.boundRect = this.bound.getBoundingClientRect();
      this.pixelScale = 1;
      if (devicePixelSupport) {
        r1 = window.devicePixelRatio || 1;
        r2 = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
        this.pixelScale = r1 / r2;
      }
      if (this.bound) {
        this.resize(this.boundRect.width, this.boundRect.height);
        this.autoResize(true);
        if (this.space.parentNode !== this.bound) {
          this.bound.appendChild(this.space);
        }
        this.appended = true;
        setTimeout((function() {
          this.space.dispatchEvent(new Event('ready'));
          if (readyCallback) {
            return readyCallback(this.boundRect.width, this.boundRect.height, this.space);
          }
        }).bind(this));
      } else {
        throw 'Cannot add canvas to element ' + parent_id;
      }
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
    if (this.bgcolor) {
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