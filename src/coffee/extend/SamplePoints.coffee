
class SamplePoints extends PointSet

  # ## Constructor
  constructor: () ->
    super

    @bestcandidate = null
    @poisson = null
    @bound = null
    @boundsize = null

  # ## Add a bound.
  # if anchor is true, then current position is set to bound's position
  setBounds: ( b, anchor=false ) ->
    if anchor then @set( b )
    @bound = new Rectangle(@).size( b.size() )


  # ## Initiate a best candidate sampler
  bestCandidateSampler: () ->

    @points = []

    # set boundary if @bound if not set
    if !@bound then @bound = new Rectangle().size(500,500)
    @boundsize = @bound.size()

    @bestcandidate = {
      halfsize: @boundsize.$divide(2)
      quartersize: @boundsize.$divide(4)
      maxDist: @boundsize.x*@boundsize.x + @boundsize.y*@boundsize.y
    }

    return @


  # ## Initiate a poisson sampler using Bridson's algorithm
  # Based on http://bl.ocks.org/mbostock/19168c663618b7f07158
  poissonSampler: (radius) ->

    @points = []

    # set boundary if @bound if not set
    if !@bound then @bound = new Rectangle().size(500,500)
    @boundsize = @bound.size()

    cellsize = radius * Math.SQRT1_2

    @poisson = {
      grid: []
      gridWidth: Math.ceil( @boundsize.x / cellsize )
      gridHeight: Math.ceil( @boundsize.y / cellsize )
      cellSize: cellsize
      radius: radius
      radius2: radius * radius
      R: 3 * radius * radius
      queue: []
      queueSize: 0
      sampleSize: 0
      sincos: Util.sinCosTable()
    }

    return @

  # ## Get a sample from poisson sampler or best-candidate sampler.
  # return false if no more sample can be found
  sample: ( numSamples=10, type=false ) ->

    # Poisson
    if @poisson and type=='poisson'

      # check if it's done
      if @poisson.sampleSize > 0 and @poisson.queueSize == 0 then return false

      # create first sample
      if !@poisson.sampleSize then return @_poissonSample( @bound.x+@boundsize.x/2, @bound.y+@boundsize.y/2 )

      while (@poisson.queueSize)
        i = Math.floor( Math.random() * @poisson.queueSize )
        s = @poisson.queue[i];

        for j in [0...numSamples] by 1
          a = Math.floor(360 * Math.random())
          r = Math.sqrt(Math.random() * @poisson.R + @poisson.radius2)
          x = s.x + r * @poisson.sincos.cos[a]
          y = s.y + r * @poisson.sincos.sin[a]

          if (x >= @bound.x && x < @boundsize.x && y >= @bound.y && y < @boundsize.y && @_poissonCheck(x, y))
            return @_poissonSample(x, y) # point is stored in @poisson.grid instead of @points

        @poisson.queue[i] = @poisson.queue[--@poisson.queueSize];
        @poisson.queue.length = @poisson.queueSize;

      return true

    # Best candidate
    else if @bestcandidate

      best = null
      bestDist = -1

      for i in [0...numSamples] by 1

        # create sample
        p = new Vector( @bound.x + @boundsize.x * Math.random(), @bound.y + @boundsize.y * Math.random() )
        if @points.length == 0
          best = p
          break
        else
          # best point is the one that has the "largest" nearest distance
          nearest = @_bestCandidateCheck( p )
          if nearest > bestDist
            best = p
            bestDist = nearest

      if best then @points.push( best )

      return best


  # find nearest distance of best candidate sample
  _bestCandidateCheck: (p) ->
    _dist = @bestcandidate.maxDist

    # rough optimization. Only search for points in the quarter bound area of this point
    halfbound = new Rectangle( p.x-@bestcandidate.quartersize.x, p.y-@bestcandidate.quartersize.y).size( @bestcandidate.halfsize.x, @bestcandidate.halfsize.y )
    matches = (it for it in @points when halfbound.intersectPoint( it ))

    for w in matches
      dx = (w.x-p.x)
      dy = (w.y-p.y)
      dist = dx*dx + dy*dy
      if dist < _dist
        _dist = dist

    return _dist


  # create a poisson sample
  _poissonSample: (x, y) ->
    s = new Point(x, y)
    @poisson.queue.push(s);
    @poisson.grid[ @poisson.gridWidth * (y / @poisson.cellSize | 0) + (x / @poisson.cellSize | 0)] = s
    @poisson.sampleSize++
    @poisson.queueSize++
    return s

  # check if poisson sample is too far
  _poissonCheck: (x, y) ->
    i = Math.floor( x / @poisson.cellSize )
    j = Math.floor( y / @poisson.cellSize )
    i0 = Math.max(i - 2, 0)
    j0 = Math.max(j - 2, 0)
    i1 = Math.min(i + 3, @poisson.gridWidth)
    j1 = Math.min(j + 3, @poisson.gridHeight)

    for j in [j0...j1] by 1
      o = j *  @poisson.gridWidth
      for i in [i0...i1] by 1
        s = @poisson.grid[o + i]
        if s
          dx = s.x - x
          dy = s.y - y
          if (dx * dx + dy * dy < @poisson.radius2) then return false

    return true

  # ## A static implementation of Mitchell's Best Neighor Algorithm to generate one sample. (Consider using `SamplePoints` object instead)
  # @param `bound` a Rectangle object to specify the bounding box
  # @param `items` an array of existing items
  # @param `samples` number of sampling. Default to 10.
  # @return o Vector object which is best candidate
  @bestCandidate: ( bound, items, samples=10 ) ->

    # bound
    size = bound.size()
    halfsize = size.$divide(2)
    quartersize = size.$divide(4)
    maxDist = size.x*size.x + size.y*size.y

    # find nearest distance
    _nearest = ( p ) ->
      _dist = maxDist

      # rough optimization. Only search for points in the quarter bound area of this point
      halfbound = new Rectangle( p.x-quartersize.x, p.y-quartersize.y).size( halfsize.x, halfsize.y )
      matches = (it for it in items when halfbound.intersetPoint( it ))

      for w in matches
        dx = (w.x-p.x)
        dy = (w.y-p.y)
        dist = dx*dx + dy*dy
        if dist < _dist
          _dist = dist

      return _dist


    # find best point by going through a number of random samples
    best = null
    bestDist = -1

    for i in [0...samples]

      # create sample
      p = new Vector( bound.x + size.x * Math.random(), bound.y + size.y * Math.random() )
      if items.length == 0
        return p
      else
        # best point is the one that has the "largest" nearest distance
        nearest = _nearest( p )
        if nearest > bestDist
          best = p
          bestDist = nearest

    return best

# namespace
this.SamplePoints = SamplePoints