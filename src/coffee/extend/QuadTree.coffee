# ### A basic quad tree implementation
class QuadTree extends Rectangle

  # ## Create a new QuadTree, which is a kind of Rectangle
  constructor: () ->
    super

    # when split, this is an object with topLeft, topRight, bottomLeft, and bottomRight
    @quads = false

    @items = []

    @depth = 0
    @max_depth = 6
    @max_items = 2


  # ## Get a list of quads in which this point is contained
  # @param `p` is a Point
  # @param `list` Optional existing list to append to
  getQuads: ( p, list=[] ) ->

    if @intersectPoint( p )

      list.push( @ )

      if @quads
        for k, q of @quads
          if q.intersectPoint( p )
            q.getQuads( p, list )

    return list

  # ## Get a list of items in this point's deepest quad
  # @param `p`  a Point
  getItems: ( p ) ->

    if @intersectPoint( p )

      if !@quads then return @items

      if @quads
        for k, q of @quads
          if q.intersectPoint( p )
            return q.getItems( p )

    return []

  # ## Add an item into this QuadTree. Split to sub quads if needed.
  addToQuad: (item) ->

    if !item then return -1

    # if this has subs quads
    if @quads
      for k, q of @quads
        _depth = q.addToQuad( item )
        if _depth > 0 then return _depth # return depth if it's added

      # otherwise return -1
      return -1

    # if this has no sub quads and it contains item
    if !@quads and @intersectPoint( item )

      # if max size is reached and depth is not max, then split to sub quads
      if @items.length >= @max_items
        if @depth < @max_depth
          @splitQuad()
          return @addToQuad( item )
        else
          return -1

        # if not max size yet, just add item and return current depth
      else
        @items.push( item )
        return @depth

    # not contained in this quad
    return -1


  # ## Split this into 4 quads using Rectangle's `quadrant()`
  splitQuad: () ->

    # split to sub quads and increment depth
    @quads = @quadrants()
    for k, q of @quads
      q.depth = @depth+1

    # add current items to sub quads
    for item, i in @items
      _depth = @addToQuad( item )

      # if it's added to sub quads, mark for removal
      if _depth > @depth
        @items[i] = null

    # remove items that are marked null
    for t in @items
      if !t
        @items.splice( t, 1 )


  # ## reset this quad, removing items and sub-quads
  resetQuad: () ->
    @items = []
    if @quads
      for k, q of @quads
        q.resetQuad()
      @quads = false



# namespace
this.QuadTree = QuadTree