var Easing, GridCascade, Noise, ParticleEmitter, ParticleField, QuadTree, SamplePoints, StripeBound, UI,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Easing = (function() {
  function Easing() {}

  Easing.linear = function(t, b, c, d) {
    return c * (t /= d) + b;
  };

  Easing._linear = function(t) {
    return Easing.linear(t, 0, 1, 1);
  };

  Easing.quadIn = function(t, b, c, d) {
    return c * (t /= d) * t + b;
  };

  Easing._quadIn = function(t) {
    return Easing.quadIn(t, 0, 1, 1);
  };

  Easing.quadOut = function(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  };

  Easing._quadOut = function(t) {
    return Easing.quadOut(t, 0, 1, 1);
  };

  Easing.cubicIn = function(t, b, c, d) {
    t = t / d;
    return c * t * t * t + b;
  };

  Easing._cubicIn = function(t) {
    return Easing.cubicIn(t, 0, 1, 1);
  };

  Easing.cubicOut = function(t, b, c, d) {
    t = t / d;
    return c * ((t - 1) * t * t + 1) + b;
  };

  Easing._cubicOut = function(t) {
    return Easing.cubicOut(t, 0, 1, 1);
  };

  Easing.elastic = function(t, b, c, d, el) {
    var a, p, s;
    if (el == null) {
      el = 0.3;
    }
    s = 1.70158;
    p = d * el;
    a = c;
    if (t === 0) {
      return b;
    }
    t = t / d;
    if (t === 1) {
      return b + c;
    }
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else if (a !== 0) {
      s = p / Const.two_pi * Math.asin(c / a);
    } else {
      s = 0;
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * Const.two_pi / p) + c + b;
  };

  Easing._elastic = function(t) {
    return Easing.elastic(t, 0, 1, 1);
  };

  Easing.bounce = function(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  };

  Easing._bounce = function(t) {
    return Easing.bounce(t, 0, 1, 1);
  };

  return Easing;

})();

this.Easing = Easing;

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
    var c, l, m, r, ref, ref1, ref2, ref3;
    for (c = l = ref = x, ref1 = w + x; ref <= ref1 ? l < ref1 : l > ref1; c = ref <= ref1 ? ++l : --l) {
      for (r = m = ref2 = y, ref3 = h + y; ref2 <= ref3 ? m < ref3 : m > ref3; r = ref2 <= ref3 ? ++m : --m) {
        if (this.layout[r] == null) {
          this.layout[r] = [];
        }
        this.layout[r][c] = 1;
      }
    }
    return this;
  };

  GridCascade.prototype.findStartRow = function() {
    var c, index, l, m, r, ref, ref1, ref2;
    index = this.startRow;
    for (r = l = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? l < ref1 : l > ref1; r = ref <= ref1 ? ++l : --l) {
      index = r;
      for (c = m = 0, ref2 = this.columns; 0 <= ref2 ? m < ref2 : m > ref2; c = 0 <= ref2 ? ++m : --m) {
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
    var allRowsFree, b, cell, colCount, colSize, currCol, currRow, freeCol, l, m, n, rc, ref, ref1, ref2, ref3, ref4;
    colSize = Math.min(cols, this.columns);
    for (currRow = l = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? l < ref1 : l > ref1; currRow = ref <= ref1 ? ++l : --l) {
      colCount = colSize;
      freeCol = 0;
      if (currRow + rows >= this.rows) {
        this.rows += rows;
      }
      if (this.layout[currRow] == null) {
        this.layout[currRow] = [];
      }
      for (currCol = m = 0, ref2 = this.columns; 0 <= ref2 ? m < ref2 : m > ref2; currCol = 0 <= ref2 ? ++m : --m) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol = currCol + 1;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount === 0) {
            allRowsFree = true;
            if (rows > 1) {
              for (rc = n = ref3 = currRow, ref4 = currRow + rows; ref3 <= ref4 ? n < ref4 : n > ref4; rc = ref3 <= ref4 ? ++n : --n) {
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
    this.animateID = -1;
  }

  ParticleEmitter.prototype.frequency = function(f) {
    return this.period = 1000 / f;
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
    var l, len, p, temp;
    if (removal == null) {
      removal = false;
    }
    temp = [];
    for (l = 0, len = particles.length; l < len; l++) {
      p = particles[l];
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
    var _depth, i, item, k, l, len, len1, m, q, ref, ref1, ref2, results, t;
    this.quads = this.quadrants();
    ref = this.quads;
    for (k in ref) {
      q = ref[k];
      q.depth = this.depth + 1;
    }
    ref1 = this.items;
    for (i = l = 0, len = ref1.length; l < len; i = ++l) {
      item = ref1[i];
      _depth = this.addToQuad(item);
      if (_depth > this.depth) {
        this.items[i] = null;
      }
    }
    ref2 = this.items;
    results = [];
    for (m = 0, len1 = ref2.length; m < len1; m++) {
      t = ref2[m];
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
    var a, best, bestDist, i, j, l, m, nearest, p, r, ref, ref1, s, x, y;
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
        for (j = l = 0, ref = numSamples; l < ref; j = l += 1) {
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
      for (i = m = 0, ref1 = numSamples; m < ref1; i = m += 1) {
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
    var _dist, dist, dx, dy, halfbound, it, l, len, matches, w;
    _dist = this.bestcandidate.maxDist;
    halfbound = new Rectangle(p.x - this.bestcandidate.quartersize.x, p.y - this.bestcandidate.quartersize.y).size(this.bestcandidate.halfsize.x, this.bestcandidate.halfsize.y);
    matches = (function() {
      var l, len, ref, results;
      ref = this.points;
      results = [];
      for (l = 0, len = ref.length; l < len; l++) {
        it = ref[l];
        if (halfbound.intersectPoint(it)) {
          results.push(it);
        }
      }
      return results;
    }).call(this);
    for (l = 0, len = matches.length; l < len; l++) {
      w = matches[l];
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
    var dx, dy, i, i0, i1, j, j0, j1, l, m, o, ref, ref1, ref2, ref3, s;
    i = Math.floor(x / this.poisson.cellSize);
    j = Math.floor(y / this.poisson.cellSize);
    i0 = Math.max(i - 2, 0);
    j0 = Math.max(j - 2, 0);
    i1 = Math.min(i + 3, this.poisson.gridWidth);
    j1 = Math.min(j + 3, this.poisson.gridHeight);
    for (j = l = ref = j0, ref1 = j1; l < ref1; j = l += 1) {
      o = j * this.poisson.gridWidth;
      for (i = m = ref2 = i0, ref3 = i1; m < ref3; i = m += 1) {
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
    var _nearest, best, bestDist, halfsize, i, l, maxDist, nearest, p, quartersize, ref, size;
    if (samples == null) {
      samples = 10;
    }
    size = bound.size();
    halfsize = size.$divide(2);
    quartersize = size.$divide(4);
    maxDist = size.x * size.x + size.y * size.y;
    _nearest = function(p) {
      var _dist, dist, dx, dy, halfbound, it, l, len, matches, w;
      _dist = maxDist;
      halfbound = new Rectangle(p.x - quartersize.x, p.y - quartersize.y).size(halfsize.x, halfsize.y);
      matches = (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = items.length; l < len; l++) {
          it = items[l];
          if (halfbound.intersetPoint(it)) {
            results.push(it);
          }
        }
        return results;
      })();
      for (l = 0, len = matches.length; l < len; l++) {
        w = matches[l];
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
    for (i = l = 0, ref = samples; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
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
    var d, diff, dx, dy, freq, l, m, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = l = 0, ref = freq.y - 1; 0 <= ref ? l <= ref : l >= ref; d = 0 <= ref ? ++l : --l) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy + diff.y).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = m = 0, ref1 = freq.x - 1; 0 <= ref1 ? m <= ref1 : m >= ref1; d = 0 <= ref1 ? ++m : --m) {
      dx = diff.x * d;
      p = new Pair(dx, 0).to(dx + diff.x + 0.5, size.y).add(this);
      p.p1.add(this);
      result.columns.push(p);
    }
    return result;
  };

  StripeBound.prototype.getStripeLines = function() {
    var d, diff, dx, dy, freq, l, m, p, ref, ref1, result, size;
    size = this.size();
    result = {
      columns: [],
      rows: []
    };
    freq = this.method === 'frequency' ? this.frequency.clone() : size.$divide(this.stripes).floor();
    diff = size.$divide(freq);
    for (d = l = 0, ref = freq.y; 0 <= ref ? l <= ref : l >= ref; d = 0 <= ref ? ++l : --l) {
      dy = diff.y * d;
      p = new Pair(0, dy).to(size.x, dy).add(this);
      p.p1.add(this);
      result.rows.push(p);
    }
    for (d = m = 0, ref1 = freq.x; 0 <= ref1 ? m <= ref1 : m >= ref1; d = 0 <= ref1 ? ++m : --m) {
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
      var l, results;
      results = [];
      for (i = l = 0; l < 512; i = ++l) {
        results.push(this.p[i & 255]);
      }
      return results;
    }).call(this);
  }

  Noise.prototype.seed = function(seed) {
    var i, l, results, v;
    if (seed > 0 && seed < 1) {
      seed *= 65536;
    }
    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }
    results = [];
    for (i = l = 0; l <= 255; i = ++l) {
      v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      results.push(this.perm[i] = this.perm[i + 256] = v);
    }
    return results;
  };

  Noise.prototype._dot = function(g, x, y) {
    return g[0] * x + g[1] * y;
  };

  Noise.prototype.perlin2d = function(xin, yin) {
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

  Noise.prototype.simplex2d = function(xin, yin) {
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

//# sourceMappingURL=pt-extend.js.map