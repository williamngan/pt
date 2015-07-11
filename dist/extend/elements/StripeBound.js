var StripeBound,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    var d, diff, dx, dy, freq, i, j, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = i = 0, ref = freq.y - 1; 0 <= ref ? i <= ref : i >= ref; d = 0 <= ref ? ++i : --i) {
      dy = diff.y * d;
      p = new Pair(0, dy).connect(size.x, dy + diff.y).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = j = 0, ref1 = freq.x - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; d = 0 <= ref1 ? ++j : --j) {
      dx = diff.x * d;
      p = new Pair(dx, 0).connect(dx + diff.x + 0.5, size.y).add(this);
      p.p1.add(this);
      result.columns.push(p);
    }
    return result;
  };

  StripeBound.prototype.getStripeLines = function() {
    var d, diff, dx, dy, freq, i, j, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = i = 0, ref = freq.y; 0 <= ref ? i <= ref : i >= ref; d = 0 <= ref ? ++i : --i) {
      dy = diff.y * d;
      p = new Pair(0, dy).connect(size.x, dy).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = j = 0, ref1 = freq.x; 0 <= ref1 ? j <= ref1 : j >= ref1; d = 0 <= ref1 ? ++j : --j) {
      dx = diff.x * d;
      p = new Pair(dx, 0).connect(dx, size.y).add(this);
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

//# sourceMappingURL=map/StripeBound.js.map