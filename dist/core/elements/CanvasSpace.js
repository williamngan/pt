var CanvasSpace,
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
    CanvasSpace.__super__.constructor.apply(this, arguments);
    this.canvas = document.querySelector("#" + this.id);
    this.appended = true;
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", this.id);
      this.appended = false;
    }
    this._mdown = false;
    this._mdrag = false;
    this.bgcolor = bgcolor;
    this.ctx = this.canvas.getContext(context);
  }

  CanvasSpace.prototype.display = function(parent_id, readyCallback) {
    var frame, frame_rect;
    if (parent_id == null) {
      parent_id = "#pt";
    }
    if (!this.appended) {
      frame = document.querySelector(parent_id);
      frame_rect = frame.getBoundingClientRect();
      if (frame) {
        this.resize(frame_rect.width, frame_rect.height);
        window.addEventListener('resize', (function(evt) {
          frame_rect = frame.getBoundingClientRect();
          return this.resize(frame_rect.width, frame_rect.height, evt);
        }).bind(this));
        if (this.canvas.parentNode !== frame) {
          frame.appendChild(this.canvas);
        }
        this.appended = true;
        setTimeout((function() {
          this.canvas.dispatchEvent(new Event('ready'));
          if (readyCallback) {
            return readyCallback(frame_rect.width, frame_rect.height, this.canvas);
          }
        }).bind(this));
      } else {
        throw 'Cannot add canvas to element ' + parent_id;
      }
    }
    return this;
  };

  CanvasSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    this.size.set(w, h);
    this.center = new Vector(w / 2, h / 2);
    this.canvas.setAttribute('width', Math.floor(w));
    this.canvas.setAttribute('height', Math.floor(h));
    ref = this.items;
    for (k in ref) {
      p = ref[k];
      if (p.onSpaceResize != null) {
        p.onSpaceResize(w, h, evt);
      }
    }
    this.renderer(this.ctx);
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

  CanvasSpace.prototype.bindCanvas = function(evt, callback) {
    return this.canvas.addEventListener(evt, callback);
  };

  CanvasSpace.prototype.bindMouse = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
    if (_bind) {
      this.canvas.addEventListener("mousedown", this._mouseDown.bind(this));
      this.canvas.addEventListener("mouseup", this._mouseUp.bind(this));
      this.canvas.addEventListener("mouseover", this._mouseOver.bind(this));
      this.canvas.addEventListener("mouseout", this._mouseOut.bind(this));
      return this.canvas.addEventListener("mousemove", this._mouseMove.bind(this));
    } else {
      this.canvas.removeEventListener("mousedown", this._mouseDown.bind(this));
      this.canvas.removeEventListener("mouseup", this._mouseUp.bind(this));
      this.canvas.removeEventListener("mouseover", this._mouseOver.bind(this));
      this.canvas.removeEventListener("mouseout", this._mouseOut.bind(this));
      return this.canvas.removeEventListener("mousemove", this._mouseMove.bind(this));
    }
  };

  CanvasSpace.prototype._mouseAction = function(type, evt) {
    var k, ref, results, v;
    ref = this.items;
    results = [];
    for (k in ref) {
      v = ref[k];
      if (v.onMouseAction != null) {
        results.push(v.onMouseAction(type, evt.offsetX, evt.offsetY, evt));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  CanvasSpace.prototype._mouseDown = function(evt) {
    this._mouseAction("down", evt);
    return this._mdown = true;
  };

  CanvasSpace.prototype._mouseUp = function(evt) {
    this._mouseAction("up", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    this._mdown = false;
    return this._mdrag = false;
  };

  CanvasSpace.prototype._mouseMove = function(evt) {
    this._mouseAction("move", evt);
    if (this._mdown) {
      this._mdrag = true;
      return this._mouseAction("drag", evt);
    }
  };

  CanvasSpace.prototype._mouseOver = function(evt) {
    return this._mouseAction("over", evt);
  };

  CanvasSpace.prototype._mouseOut = function(evt) {
    this._mouseAction("out", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    return this._mdrag = false;
  };

  return CanvasSpace;

})(Space);

this.CanvasSpace = CanvasSpace;

//# sourceMappingURL=.map/CanvasSpace.js.map