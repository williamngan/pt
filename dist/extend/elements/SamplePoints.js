var SamplePoints,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    return this.bound = new Rectangle(this).size(b.size());
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
    var a, best, bestDist, i, j, k, l, nearest, p, r, ref, ref1, s, x, y;
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
        for (j = k = 0, ref = numSamples; k < ref; j = k += 1) {
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
      for (i = l = 0, ref1 = numSamples; l < ref1; i = l += 1) {
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
    var _dist, dist, dx, dy, halfbound, it, k, len, matches, w;
    _dist = this.bestcandidate.maxDist;
    halfbound = new Rectangle(p.x - this.bestcandidate.quartersize.x, p.y - this.bestcandidate.quartersize.y).size(this.bestcandidate.halfsize.x, this.bestcandidate.halfsize.y);
    matches = (function() {
      var k, len, ref, results;
      ref = this.points;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        it = ref[k];
        if (halfbound.intersectPoint(it)) {
          results.push(it);
        }
      }
      return results;
    }).call(this);
    for (k = 0, len = matches.length; k < len; k++) {
      w = matches[k];
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
    var dx, dy, i, i0, i1, j, j0, j1, k, l, o, ref, ref1, ref2, ref3, s;
    i = Math.floor(x / this.poisson.cellSize);
    j = Math.floor(y / this.poisson.cellSize);
    i0 = Math.max(i - 2, 0);
    j0 = Math.max(j - 2, 0);
    i1 = Math.min(i + 3, this.poisson.gridWidth);
    j1 = Math.min(j + 3, this.poisson.gridHeight);
    for (j = k = ref = j0, ref1 = j1; k < ref1; j = k += 1) {
      o = j * this.poisson.gridWidth;
      for (i = l = ref2 = i0, ref3 = i1; l < ref3; i = l += 1) {
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
    var _nearest, best, bestDist, halfsize, i, k, maxDist, nearest, p, quartersize, ref, size;
    if (samples == null) {
      samples = 10;
    }
    size = bound.size();
    halfsize = size.$divide(2);
    quartersize = size.$divide(4);
    maxDist = size.x * size.x + size.y * size.y;
    _nearest = function(p) {
      var _dist, dist, dx, dy, halfbound, it, k, len, matches, w;
      _dist = maxDist;
      halfbound = new Rectangle(p.x - quartersize.x, p.y - quartersize.y).size(halfsize.x, halfsize.y);
      matches = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = items.length; k < len; k++) {
          it = items[k];
          if (halfbound.intersetPoint(it)) {
            results.push(it);
          }
        }
        return results;
      })();
      for (k = 0, len = matches.length; k < len; k++) {
        w = matches[k];
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
    for (i = k = 0, ref = samples; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
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

//# sourceMappingURL=map/SamplePoints.js.map