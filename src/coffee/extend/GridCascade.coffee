# ### (In progress) Like Grid, but expand the rows as needed to fit more items.
class GridCascade extends Grid
  constructor : () ->
    super

    @startRow = 0

  # ## Clear the layout and re-make the initial grid
  # simplified because rows are auto-expanded in fit()
  resetLayout : () ->
    @layout = []
    @startRow = 0


  # ## Mark a certain area in the grid as occupied. This also checks for new rows, which is not checked in Grid
  # @param `x` column index
  # @param `y` row index
  # @param `W` column width
  # @param `h` row size
  # @return this grid
  occupy : ( x, y, w, h ) ->
    for c in [x...(w+x)]
      for r in [y...(h+y)]
        if not @layout[r]? then @layout[r] = []
        @layout[ r ][ c ] = 1

    return @

  # ## optimize the iteration by starting at a row that has free cells
  findStartRow : () ->
    index = @startRow
    for r in [@startRow...@rows]
      index = r
      for c in [0...@columns]
        if @layout[r]?
          if !@layout[r][c]? or @layout[r][c] <= 0 then return index

    return index

  # ## fit this area within the grid. This expands new rows to fit more items as needed.
  # @param `width` number of columns
  # @param `height` number of rows
  # @return an object with properties `row` and `column` to specify the top left position, `columnSize` and `rowSize` to specify the resulting size in grid units, and `bound` which is the actual area as a Rectangle object.
  fit : ( cols, rows ) ->

    # find column size, bound by maximum columns in the grid
    colSize = Math.min( cols, @columns )

    # go through each grid cell
    # each row
    for currRow in [@startRow...@rows]

      colCount = colSize # counter to find available columns
      freeCol = 0 # start position of first free column

      # if this is the last row, create more rows to fit
      if currRow+rows >= @rows then @rows += (rows)

      # create new row if it does not exist
      if not @layout[currRow]? then @layout[currRow] = []

      # each column
      for currCol in [0...@columns]
        cell = @layout[currRow][currCol]

        # if cell is filled
        if cell? and cell > 0
          freeCol = currCol+1 # this column is not free
          colCount = colSize # reset colCount if it's counting

        # if cell is not filled
        else

          # see if the next one fits
          colCount--

          # can fit all
          if colCount is 0

            # check for the edge case where subsequent rows are already occupied
            allRowsFree = true
            if rows > 1
              for rc in [currRow...(currRow+rows)]
                if rc <= @rows and @layout[rc]? and @layout[rc][freeCol] > 0
                  allRowsFree = false
                  break

            # return cell only when rows and columns are free
            if allRowsFree

              # mark this area as occupied
              @occupy( freeCol,  currRow, colSize, rows )

              # optimize looping by finding next start row
              if currRow > @startRow then @startRow = @findStartRow()

              # calculate the bounding box
              b = new Rectangle( @$add( @cell.size.$multiply( freeCol, currRow ) ) ) # top left
              b.resizeTo( @cell.size.$multiply( colSize, rows ) ) # size

              return {
                row: currRow
                column: freeCol
                columnSize: colSize
                rowSize: rows
                bound: b
              }

    # cannot fit
    console.error( "cannot fit #{currRow} #{freeCol} #{cols} #{rows}" )
    return false


# namespace
this.GridCascade = GridCascade