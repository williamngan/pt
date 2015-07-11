var Timer;

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

//# sourceMappingURL=.map/Timer.js.map