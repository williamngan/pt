# ### Basic Grid implementation
class Grid extends Rectangle

  # ## Create a new Grid. Like a Rectangle, a Grid's area are defined by two Vectors.
  # @param `args` Similar to Pair constructor, use comma-separated values, an array, or an object as parameters to specify the first point. As a shortcut to `to()`, you can also pass 4 or 6 values to set both anchor and `p1` points directly as a 2d or 3d vector.
  # @eg `new Grid()` `new Grid(1,2,3)` `new Grid([2,4])` `new Grid({x:3, y:6, z:9}).to(1,2,3)`
  # @return a new Grid object
  constructor: () ->
    super

    # ## grid cell settings as an object with `.type` property which defines the grid type such as "fix-fix", and `.size` property which stores the cell size as a Vector object.
    @cell = {
      type : 'fix-fix'
      size: new Vector()
    }

    # ## property to specify number of rows in the grid
    @rows = 0

    # ## property to specify number of columns in the grid
    @columns = 0

    # ## property to store layout and cell states
    @layout = []

    # callback from cell generation
    @cellCallback = null


  # ## Describe this grid as a text string
  # @return "Grid width, height, columns, rows, cell" text
  toString: ->
    s = @size()
    "Grid width #{s.x}, height #{s.y}, columns #{@columns}, rows #{@rows}, " +
    "cell (#{@cell.size.x}, #{@cell.size.y}), type #{@cell.type}"


  # ## Initiate a grid
  # @param `x` a value to specify cell width (if `xtype` parameter is "fix" or "flex") or column count  (if `xtype` parameter is "stretch")
  # @param `y` a value to specify cell height (if `ytype` parameter is "fix" or "flex") or row count (if `ytype` parameter is "stretch")
  # @param `xtype, ytype` a string to specify how columns and rows should be calculated. Use "fix" to specify exact cell width or height in pixels, "flex" to specify ideal cell width or height in pixels (which allows for flexible rounding to rows or columns), "stretch" to specify number of rows or columns only
  # @eg `grid.create(100,50)` `grid.create( 10,10, "stretch","stretch")` `grid.create( 20,20, "flex","fix")`
  # @return this grid
  init : ( x, y, xtype='fix', ytype='fix' ) ->

    size = @size()

    @cell.type = xtype + '-' + ytype
    @rows = y
    @columns = x

    # calculate x and columns
    # stretch: always fit number of columns
    if xtype is 'stretch'
      @cell.size.x = size.x / x
      @columns = x
    # flex: fit as many as possible
    else if xtype is 'flex'
      @columns = Math.round( size.x / x )
      @cell.size.x =size.x / @columns
    # fix: cell width is fixed
    else # fix
      @cell.size.x = x
      @columns = Math.floor( size.x / @cell.size.x )

    # calculate y and rows
    # stretch: always fit number of rows
    if ytype is 'stretch'
      @cell.size.y = size.y / y
      @rows = y
    # flex: fit as many as possible
    else if ytype is 'flex'
      @rows = Math.round( size.y / y )
      @cell.size.y = size.y / @rows
    # fix: cell height is fixed
    else # fix
      @cell.size.y = y
      @rows = Math.floor( size.y / @cell.size.y )

    return @


  # ##  Define a callback function for cell creation. This will loop through each cell in the grid and call the callback function.
  # @param `callback` a callback function with these parameters `( cell_size, cell_position, cell_row, cell_column, cell_type )`
  # @return this grid
  generate : ( callback ) ->
    if (typeof callback == "function")
      @cellCallback = callback
    return @


  # ## Generate the grid by looping through each cell
  create : () ->
    if !@cellCallback then return @

    for c in [0...@columns]
      for r in [0...@rows]
        cell = @cell.size.clone()
        pos = @$add( cell.$multiply( c, r ) ) # cellsize * row-column + grid-position
        @cellCallback( cell, pos, r, c, @cell.type, @layout[r][c]==1 )

    return @


  # ## Get the cell's size as a Vector
  # @return a cloned `cell.size` property as Vector
  getCellSize: () -> return @cell.size.clone()

  # ## Give a column and a row, get a rectangle which indicates the cell position and size
  # @param `c, r` column and row index, respectively
  # @param `allowOutofBound` a boolean value to set if the returned rectangle can be outside of the grid
  # @eg `grid.cellToRectangle(2, 3)`, `grid.cellToRectangle(2, 5, true)`
  # @return a Rectangle
  cellToRectangle : (c, r, allowOutofBound=false) ->
    # cellsize * row-column + grid-position
    if allowOutofBound or (c >= 0 and c < @columns and r >= 0 and r < @rows)
      rect = new Rectangle( @$add( @cell.size.$multiply( c, r ) ) ).resizeTo( @cell.size )
      return rect
    else
      return false


  # ## Give a x,y position, get the corresponding cell on the grid.
  # @param `args` 0-3 comma-separated values, or as an array, or a Point object.
  # @eg `grid.positionToCell( 100, 50 )`, `grid.positionToCell( [100, 50] )`, `grid.positionToCell( pt )`,
  # @return a Vector object whose `x` is the column index and `y` is the row index
  positionToCell : (args) ->
    pos = new Vector( @_getArgs( arguments ) )
    cellpos = pos.$subtract( @ ).$divide( @cell.size ).floor()
    cellpos.max( 0, 0 ).min( @columns-1, @rows-1 );
    return cellpos


  # ## Reset the layout and its cell states
  # @param `callback` a function with these parameters ( this_grid, cell_row, cell_column ). This will get called after each cell's reset.
  # @return this grid
  resetLayout : ( callback ) ->
    @layout = []
    for r in [0...@rows]
      @layout[r] = []
      for c in [0...@columns]
        @layout[r][c] = 0
        if callback then callback( @, r, c )

    return @


  # ## Mark a certain area in the grid layout as occupied
  # @param `x, y` column and row index
  # @param `w` column width
  # @param `h` row size
  # @param `occupy` a boolean value to set if this cell should be occupied. Defaults to `true`
  # @eg `grid.occupy(0,0, 5,3)`
  # @return this grid
  occupy : ( x, y, w, h, occupy=true ) ->
    if (@rows <= 0 or @columns <=0) then return @
    if (@layout.length < 1) then @resetLayout()
    for c in [0...w]
      for r in [0...h]
        @layout[ Math.min( @layout.length-1, y+r) ][ x+c] = (if (occupy) then 1 else 0)

    return @


  # ## Check a certain area in the grid is unoccupied
  # @param `x, y` column and row index
  # @param `w` column width
  # @param `h` row size
  # @eg `grid.canFit(0,0, 5,3)`
  # @return a boolean value where `true` means the area is unoccupied
  canFit : ( x, y, w, h ) ->

    # each cell in specific rows and columns
    for currRow in [y...Math.min(@rows, y+h)]
      for currCol in [x...Math.min(@columns, x+w)]
        cell = @layout[currRow][currCol]
        # if cell is filled
        if cell? and cell > 0
          return false

    return true


  # ## Fit this area as much as possible within the grid's free ceels
  # @param `cols` number of columns
  # @param `rows` number of rows
  # @return an object with properties `row` and `column` to specify the top left position, `columnSize` and `rowSize` to specify the resulting size in grid units, and `bound` which is the actual area as a Rectangle object.
  fit : ( cols, rows ) ->

    # find column size, bound by maximum columns in the grid
    # maxColumns = @layout[0].length
    colSize = Math.min( cols, @columns )

    # go through each grid cell
    # each row
    for currRow in [0...@rows]
      colCount = colSize # counter to find available columns
      freeCol = 0 # start position of first free column

      # each column
      for currCol in [0...@columns]
        cell = @layout[currRow][currCol]

        # if cell is filled
        if cell? and cell > 0
          freeCol++ # this column is not free
          colCount = colSize # reset colCount if it's counting

        # if cell is not filled
        else
          # see if the next one fits
          colCount--

          # can fit all
          if colCount <= 0

            # mark this area as occupied
            @occupy( freeCol,  currRow, colSize, rows )

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
    return false


  # ## Given a cell's position, get an array of the neighboring cells that surround it
  # @param `c` column index
  # @param `r` row index
  # @eg `grid.neighbors( 3, 2 )`, `(grid.neighbors(3, 2))[Const.top_right]`
  # @return an array of neighbors starting from top-left going clockwise. The array values can be Vectors whose `x` is column index and `y` is row index, or `false` if the neighbor cell is out of bounds. You may access the cells semantically by using Const.top_right etc.
  neighbors: (c, r) ->
    temp = [ [c-1, r-1], [c, r-1], [c+1, r-1], [c+1, r], [c+1, r+1], [c, r+1], [c-1, r+1], [c-1, r] ];
    ns = []
    for n in temp
      if n[0] >= 0 and n[0] < @columns and n[1] >= 0 and n[1] < @rows
        ns.push( new Vector( n[0], n[1], @layout[ n[1] ][ n[0] ] ) )
      else
        ns.push( false )
    return ns;



# namespace
this.Grid = Grid