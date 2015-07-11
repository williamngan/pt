var GridCascade,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
    var c, i, j, r, ref, ref1, ref2, ref3;
    for (c = i = ref = x, ref1 = w + x; ref <= ref1 ? i < ref1 : i > ref1; c = ref <= ref1 ? ++i : --i) {
      for (r = j = ref2 = y, ref3 = h + y; ref2 <= ref3 ? j < ref3 : j > ref3; r = ref2 <= ref3 ? ++j : --j) {
        if (this.layout[r] == null) {
          this.layout[r] = [];
        }
        this.layout[r][c] = 1;
      }
    }
    return this;
  };

  GridCascade.prototype.findStartRow = function() {
    var c, i, index, j, r, ref, ref1, ref2;
    index = this.startRow;
    for (r = i = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? i < ref1 : i > ref1; r = ref <= ref1 ? ++i : --i) {
      index = r;
      for (c = j = 0, ref2 = this.columns; 0 <= ref2 ? j < ref2 : j > ref2; c = 0 <= ref2 ? ++j : --j) {
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
    var allRowsFree, b, cell, colCount, colSize, currCol, currRow, freeCol, i, j, k, rc, ref, ref1, ref2, ref3, ref4;
    colSize = Math.min(cols, this.columns);
    for (currRow = i = ref = this.startRow, ref1 = this.rows; ref <= ref1 ? i < ref1 : i > ref1; currRow = ref <= ref1 ? ++i : --i) {
      colCount = colSize;
      freeCol = 0;
      if (currRow + rows >= this.rows) {
        this.rows += rows;
      }
      if (this.layout[currRow] == null) {
        this.layout[currRow] = [];
      }
      for (currCol = j = 0, ref2 = this.columns; 0 <= ref2 ? j < ref2 : j > ref2; currCol = 0 <= ref2 ? ++j : --j) {
        cell = this.layout[currRow][currCol];
        if ((cell != null) && cell > 0) {
          freeCol = currCol + 1;
          colCount = colSize;
        } else {
          colCount--;
          if (colCount === 0) {
            allRowsFree = true;
            if (rows > 1) {
              for (rc = k = ref3 = currRow, ref4 = currRow + rows; ref3 <= ref4 ? k < ref4 : k > ref4; rc = ref3 <= ref4 ? ++k : --k) {
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

//# sourceMappingURL=map/GridCascade.js.map