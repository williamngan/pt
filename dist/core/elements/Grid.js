var Grid,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Grid = (function(superClass) {
  extend(Grid, superClass);

  function Grid() {
    Grid.__super__.constructor.apply(this, arguments);
    this.cell = {
      type: 'fix-fix',
      size: new Vector()
    };
    this.rows = 0;
    this.columns = 0;
    this.layout = [];
    this.cellCallback = null;
  }

  Grid.prototype.toString = function() {
    var s;
    s = this.size();
    return ("Grid width " + s.x + ", height " + s.y + ", columns " + this.columns + ", rows " + this.rows + ", ") + ("cell (" + this.cell.size.x + ", " + this.cell.size.y + "), type " + this.cell.type);
  };

  Grid.prototype.init = function(x, y, xtype, ytype) {
    var size;
    if (xtype == null) {
      xtype = 'fix';
    }
    if (ytype == null) {
      ytype = 'fix';
    }
    size = this.size();
    this.cell.type = xtype + '-' + ytype;
    this.rows = y;
    this.columns = x;
    if (xtype === 'stretch') {
      this.cell.size.x = size.x / x;
      this.columns = x;
    } else if (xtype === 'flex') {
      this.columns = Math.round(size.x / x);
      this.cell.size.x = size.x / this.columns;
    } else {
      this.cell.size.x = x;
      this.columns = Math.floor(size.x / this.cell.size.x);
    }
    if (ytype === 'stretch') {
      this.cell.size.y = size.y / y;
      this.rows = y;
    } else if (ytype === 'flex') {
      this.rows = Math.round(size.y / y);
      this.cell.size.y = size.y / this.rows;
    } else {
      this.cell.size.y = y;
      this.rows = Math.floor(size.y / this.cell.size.y);
    }
    if (this.layout.length < 1) {
      this.resetLayout();
    }
    return this;
  };

  Grid.prototype.generate = function(callback) {
    if (typeof callback === "function") {
      this.cellCallback = callback;
    }
    return this;
  };

  Grid.prototype.create = function() {
    var c, cell, i, isOccupied, j, pos, r, ref, ref1;
    if (!this.cellCallback) {
      return this;
    }
    for (c = i = 0, ref = this.columns; 0 <= ref ? i < ref : i > ref; c = 0 <= ref ? ++i : --i) {
      for (r = j = 0, ref1 = this.rows; 0 <= ref1 ? j < ref1 : j > ref1; r = 0 <= ref1 ? ++j : --j) {
        cell = this.cell.size.clone();
        pos = this.$add(cell.$multiply(c, r));
        isOccupied = this.layout.length > 0 && this.layout[0].length > 0 ? this.layout[r][c] === 1 : false;
        this.cellCallback(cell, pos, r, c, this.cell.type, isOccupied);
      }
    }
    return this;
  };

  Grid.prototype.getCellSize = function() {
    return this.cell.size.clone();
  };

  Grid.prototype.cellToRectangle = function(c, r, allowOutofBound) {
    var rect;
    if (allowOutofBound == null) {
      allowOutofBound = false;
    }
    if (allowOutofBound || (c >= 0 && c < this.columns && r >= 0 && r < this.rows)) {
      rect = new Rectangle(this.$add(this.cell.size.$multiply(c, r))).resizeTo(this.cell.size);
      return rect;
    } else {
      return false;
    }
  };

  Grid.prototype.positionToCell = function(args) {
    var cellpos, pos;
    pos = new Vector(this._getArgs(arguments));
    cellpos = pos.$subtract(this).$divide(this.cell.size).floor();
    cellpos.max(0, 0).min(this.columns - 1, this.rows - 1);
    return cellpos;
  };

  Grid.prototype.resetLayout = function(callback) {
    var c, i, j, r, ref, ref1;
    this.layout = [];
    for (r = i = 0, ref = this.rows; 0 <= ref ? i < ref : i > ref; r = 0 <= ref ? ++i : --i) {
      this.layout[r] = [];
      for (c = j = 0, ref1 = this.columns; 0 <= ref1 ? j < ref1 : j > ref1; c = 0 <= ref1 ? ++j : --j) {
        this.layout[r][c] = 0;
        if (callback) {
          callback(this, r, c);
        }
      }
    }
    return this;
  };

  Grid.prototype.occupy = function(x, y, w, h, occupy) {
    var c, i, j, r, ref, ref1;
    if (occupy == null) {
      occupy = true;
    }
    if (this.rows <= 0 || this.columns <= 0) {
      return this;
    }
    if (this.layout.length < 1) {
      this.resetLayout();
    }
    for (c = i = 0, ref = w; 0 <= ref ? i < ref : i > ref; c = 0 <= ref ? ++i : --i) {
      for (r = j = 0, ref1 = h; 0 <= ref1 ? j < ref1 : j > ref1; r = 0 <= ref1 ? ++j : --j) {
        this.layout[Math.min(this.layout.length - 1, y + r)][x + c] = (occupy ? 1 : 0);
      }
    }
    return this;
  };

  Grid.prototype.canFit = function(x, y, w, h) {
    var cell, currCol, currRow, i, j, ref, ref1, ref2, ref3;
    for (currRow = i = ref = y, ref1 = Math.min(this.rows, y + h); ref <= ref1 ? i < ref1 : i > ref1; currRow = ref <= ref1 ? ++i : --i) {
      for (currCol = j = ref2 = x, ref3 = Math.min(this.columns, x + w); ref2 <= ref3 ? j < ref3 : j > ref3; currCol = ref2 <= ref3 ? ++j : --j) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          return false;
        }
      }
    }
    return true;
  };

  Grid.prototype.fit = function(cols, rows) {
    var b, cell, colCount, colSize, currCol, currRow, freeCol, i, j, ref, ref1;
    colSize = Math.min(cols, this.columns);
    for (currRow = i = 0, ref = this.rows; 0 <= ref ? i < ref : i > ref; currRow = 0 <= ref ? ++i : --i) {
      colCount = colSize;
      freeCol = 0;
      for (currCol = j = 0, ref1 = this.columns; 0 <= ref1 ? j < ref1 : j > ref1; currCol = 0 <= ref1 ? ++j : --j) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol++;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount <= 0) {
            this.occupy(freeCol, currRow, colSize, rows);
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
    return false;
  };

  Grid.prototype.neighbors = function(c, r) {
    var i, len, n, ns, temp;
    temp = [[c - 1, r - 1], [c, r - 1], [c + 1, r - 1], [c + 1, r], [c + 1, r + 1], [c, r + 1], [c - 1, r + 1], [c - 1, r]];
    ns = [];
    for (i = 0, len = temp.length; i < len; i++) {
      n = temp[i];
      if (n[0] >= 0 && n[0] < this.columns && n[1] >= 0 && n[1] < this.rows) {
        ns.push(new Vector(n[0], n[1], this.layout[n[1]][n[0]]));
      } else {
        ns.push(false);
      }
    }
    return ns;
  };

  return Grid;

})(Rectangle);

this.Grid = Grid;

//# sourceMappingURL=.map/Grid.js.map