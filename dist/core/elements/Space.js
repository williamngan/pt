var Space;

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
      var i, len, ref, results;
      ref = evt[which];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        t = ref[i];
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

//# sourceMappingURL=.map/Space.js.map