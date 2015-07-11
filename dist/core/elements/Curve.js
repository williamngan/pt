var Curve,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Curve = (function(superClass) {
  extend(Curve, superClass);

  function Curve() {
    Curve.__super__.constructor.apply(this, arguments);
    this.is3D = false;
  }

  Curve.prototype._getSteps = function(steps) {
    var j, ref, s, t, ts;
    ts = [];
    for (s = j = 0, ref = steps; j <= ref; s = j += 1) {
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
    var c, i, j, k, l, ps, ref, ref1, ts;
    if (steps == null) {
      steps = 10;
    }
    if (this.points.length < 2) {
      return [];
    }
    ps = [];
    ts = this._getSteps(steps);
    c = this.controlPoints(0, true);
    for (i = j = 0, ref = steps; j <= ref; i = j += 1) {
      ps.push(this.catmullRomPoint(ts[i], c));
    }
    k = 0;
    while (k < this.points.length - 2) {
      c = this.controlPoints(k);
      if (c) {
        for (i = l = 0, ref1 = steps; l <= ref1; i = l += 1) {
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
    var c, i, j, k, l, ps, ref, ref1, ts;
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
    for (i = j = 0, ref = steps; j <= ref; i = j += 1) {
      ps.push(this.cardinalPoint(ts[i], c, tension));
    }
    k = 0;
    while (k < this.points.length - 2) {
      c = this.controlPoints(k);
      if (c) {
        for (i = l = 0, ref1 = steps; l <= ref1; i = l += 1) {
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
    var c, i, j, k, ps, ref, ts;
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
        for (i = j = 0, ref = steps; j <= ref; i = j += 1) {
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
    var c, i, j, k, l, ps, ref, ref1, ts;
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
          for (i = j = 0, ref = steps; j <= ref; i = j += 1) {
            ps.push(this.bsplinePoint(ts[i], c));
          }
        } else {
          for (i = l = 0, ref1 = steps; l <= ref1; i = l += 1) {
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

//# sourceMappingURL=.map/Curve.js.map