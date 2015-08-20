var Space;

Space = (function() {
  function Space(id) {
    if (id == null) {
      id = 'space';
    }
    this.id = id;
    this.renderer = (function(_this) {
      return function(ctx) {};
    })(this);
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

  Space.prototype.render = function(func) {
    this.renderer = func;
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

  return Space;

})();

this.Space = Space;

//# sourceMappingURL=.map/Space.js.map