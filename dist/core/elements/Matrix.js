var Matrix;

Matrix = (function() {
  function Matrix() {}

  Matrix.rotateAnchor2D = function(radian, anchor, axis) {
    var a, cosA, sinA;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    cosA = Math.cos(radian);
    sinA = Math.sin(radian);
    return [cosA, sinA, 0, -sinA, cosA, 0, a.x * (1 - cosA) + a.y * sinA, a.y * (1 - cosA) - a.x * sinA, 1];
  };

  Matrix.reflectAnchor2D = function(line, axis) {
    var ang2, cosA, inc, sinA;
    if (axis == null) {
      axis = Const.xy;
    }
    inc = line.intercept(axis);
    ang2 = Math.atan(inc.slope) * 2;
    cosA = Math.cos(ang2);
    sinA = Math.sin(ang2);
    return [cosA, sinA, 0, sinA, -cosA, 0, -inc.yi * sinA, inc.yi + inc.yi * cosA, 1];
  };

  Matrix.shearAnchor2D = function(sx, sy, anchor, axis) {
    var a, tx, ty;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    tx = Math.tan(sx);
    ty = Math.tan(sy);
    return [1, tx, 0, ty, 1, 0, -a.y * ty, -a.x * tx, 1];
  };

  Matrix.scaleAnchor2D = function(sx, sy, anchor, axis) {
    var a;
    if (axis == null) {
      axis = Const.xy;
    }
    a = anchor.get2D(axis);
    return [sx, 0, 0, 0, sy, 0, -a.x * sx + a.x, -a.y * sy + a.y, 1];
  };

  Matrix.scale2D = function(x, y) {
    return [x, 0, 0, 0, y, 0, 0, 0, 1];
  };

  Matrix.shear2D = function(x, y) {
    return [1, Math.tan(x), 0, Math.tan(y), 1, 0, 0, 0, 1];
  };

  Matrix.rotate2D = function(cosA, sinA) {
    return [cosA, sinA, 0, -sinA, cosA, 0, 0, 0, 1];
  };

  Matrix.translate2D = function(x, y) {
    return [1, 0, 0, 0, 1, 0, x, y, 1];
  };

  Matrix.transform2D = function(pt, m, axis, byValue) {
    var v, x, y;
    if (axis == null) {
      axis = Const.xy;
    }
    if (byValue == null) {
      byValue = false;
    }
    v = pt.get2D(axis);
    x = v.x * m[0] + v.y * m[3] + m[6];
    y = v.x * m[1] + v.y * m[4] + m[7];
    v.x = x;
    v.y = y;
    v = v.get2D(axis, true);
    if (!byValue) {
      pt.set(v);
      return pt;
    }
    return v;
  };

  return Matrix;

})();

this.Matrix = Matrix;

//# sourceMappingURL=.map/Matrix.js.map