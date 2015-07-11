# # A Bound subdivided in horizontal and vertical stripes
class StripeBound extends Rectangle

  constructor: () ->
    super

    @frequency = new Point()
    @stripes = new Point()
    @method = 'frequency'

    @mask = null

  # ## Determines the number of stripes by frequency, and change method to frequency
  setFrequency: (x, y) ->
    @frequency = new Vector(x, y)
    @method = 'frequency'

  # ## Set number of strips by number, and change method to stripes
  setStripes: (x, y) ->
    @stripes = new Point(x,y)
    @method = 'stripes'

  # ## get stripes as boxes of {columns:[Pairs], rows:[Pairs]}
  getStripes: () ->
    size = @size()
    result = {columns: [], rows: []}

    # calculate frequency and spacing
    freq = if @method == 'frequency' then @frequency.clone() else size.$divide( @stripes ).floor()
    diff = size.$divide( freq )

    # rows
    for d in [0..freq.y-1]
      dy = diff.y*d
      p = new Pair(0, dy).connect(size.x, dy+diff.y).add(@)
      p.p1.add(@)
      result.rows.push( p )

    # columns
    for d in [0..freq.x-1]
      dx = diff.x*d
      p = new Pair(dx, 0).connect(dx+diff.x+0.5, size.y).add(@)
      p.p1.add(@)
      result.columns.push( p )

    return result

  # ## get stripes as lines {columns:[Pairs], rows:[Pairs]}
  getStripeLines: () ->
    size = @size()
    result = {columns: [], rows: []}

    # calculate frequency and spaci   ng
    freq = if @method == 'frequency' then @frequency.clone() else size.$divide( @stripes ).floor()
    diff = size.$divide( freq )

    # rows
    for d in [0..freq.y]
      dy = diff.y*d
      p = new Pair(0, dy).connect(size.x, dy).add(@)
      p.p1.add(@)
      result.rows.push( p )

    # columns
    for d in [0..freq.x]
      dx = diff.x*d
      p = new Pair(dx, 0).connect(dx, size.y).add(@)
      p.p1.add(@)
      result.columns.push( p )

    return result


  # ## create a masking area for canvas clipping
  # defaults to position in the center of the bound, unless anchor paramater is set
  setMask: (w, h, anchor=false) ->
    @mask = new Rectangle(@x, @y)
    sz = @size()

    # center it if no anchor point is set
    if !anchor
      diff = sz.$subtract( w, h ).divide(2)
      anchor = new Point(@x+diff.x, @y+diff.y)
    else
      anchor = @.$add(anchor)

    # position and set size
    @mask.set( anchor.x, anchor.y).size(w, h)


  # ## anchor mask to bound's origin position
  anchorMask: () ->
    d = @.$subtract( @mask)
    @.moveBy(d)
    @mask.moveBy(d)

# namespace
this.StripeBound = StripeBound