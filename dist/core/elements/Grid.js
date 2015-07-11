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
  }

  Grid.prototype.toString = function() {
    var s;
    s = this.size();
    return ("Grid width " + s.x + ", height " + s.y + ", columns " + this.columns + ", rows " + this.rows + ", ") + ("cell (" + this.cell.size.x + ", " + this.cell.size.y + "), type " + this.cell.type);
  };

  Grid.prototype.create = function(x, y, xtype, ytype) {
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
      this.columns = Math.ceil(size.x / this.cell.size.x);
    }
    if (ytype === 'stretch') {
      this.cell.size.y = size.y / y;
      this.rows = y;
    } else if (ytype === 'flex') {
      this.rows = Math.round(size.y / y);
      this.cell.size.y = size.y / this.rows;
    } else {
      this.cell.size.y = y;
      this.rows = Math.ceil(size.y / this.cell.size.y);
    }
    return this;
  };

  Grid.prototype.generate = function(callback) {
    var c, cell, i, j, pos, r, ref, ref1;
    for (c = i = 0, ref = this.columns; 0 <= ref ? i < ref : i > ref; c = 0 <= ref ? ++i : --i) {
      for (r = j = 0, ref1 = this.rows; 0 <= ref1 ? j < ref1 : j > ref1; r = 0 <= ref1 ? ++j : --j) {
        cell = this.cell.size.clone();
        pos = this.$add(cell.$multiply(c, r));
        callback(this, cell, pos, r, c, this.cell.type);
      }
    }
    return this;
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

  Grid.prototype.occupy = function(x, y, w, h) {
    var c, i, j, r, ref, ref1;
    for (c = i = 0, ref = w; 0 <= ref ? i < ref : i > ref; c = 0 <= ref ? ++i : --i) {
      for (r = j = 0, ref1 = h; 0 <= ref1 ? j < ref1 : j > ref1; r = 0 <= ref1 ? ++j : --j) {
        this.layout[Math.min(this.layout.length - 1, y + r)][x + c] = 1;
      }
    }
    return this;
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

  return Grid;

})(Rectangle);

this.Grid = Grid;

//# sourceMappingURL=.map/Grid.js.map