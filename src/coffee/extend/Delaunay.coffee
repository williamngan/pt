# ### Generate a set of triangles from a set of points, so that none of the points will be inside the circumcenter of any triangle.
class Delaunay extends PointSet

  # This implementation is based on Paul Bourke's algorithm (http://paulbourke.net/papers/triangulate/)
  # with reference to its javascript implementation by ironwallaby (https://github.com/ironwallaby/delaunay)

  # ## Create a new Delaunay which extends `PointSet`. The generated results are stored in `this.mesh`.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or an object as parameters to specify the anchor point. Use `to()` to add points to the set.
  # @eg `new Delaunay()` `new Delaunay(1,2,3)` `new Delaunay([2,4])` `new Delaunay({x:3, y:6, z:9}).to(1,2,3)` `new Delaunay(1,2,3).to([p1, p2, p3, p4, p5])`
  # @return a new Delaunay object
  constructor: () ->
    super
    this.mesh = []


  # ## Calculate delaunay triangulation and store the results in `this.mesh` array
  # @return an array of {i, j, k, triangle, circle} which records the indices of the vertices, and the calculated triangles and circumcircles
  generate: () ->

    if (@points.length < 3) then return

    n = @points.length # a count of original points

    # sort the points and store the sorted index
    indices = []
    for i in [0...n] by 1
      indices[i] = i

    indices.sort( (i,j) => @points[j].x - @points[i].x )

    # duplicate the points list and add super triangle's points to it
    pts = @points.slice()
    st = @_supertriangle()
    pts.push( new Vector(st), new Vector(st.p1), new Vector(st.p2) )

    # arrays to store edge buffer and opened triangles
    opened = [ @_circum( n, n+1, n+2, st ) ]
    closed = []
    edges = []

    # Go through each point using the sorted indices
    for c in indices

      edges = []

      # Go through each opened triangles
      j = opened.length
      while j--

        circum = opened[j]

        # check if current point is inside a circumcircle of an opened triangle
        dx = pts[c].x - circum.circle.x
        dy = pts[c].y - circum.circle.y

        # if point is to the right of circumcircle, add it to closed list and don't check again
        if (dx > 0 and dx * dx > circum.circle.radius * circum.circle.radius )
          closed.push( circum )
          opened.splice(j, 1)
          continue

        # if it's outside the circumcircle, skip
        if(dx * dx + dy * dy - circum.circle.radius * circum.circle.radius > Const.epsilon)
          continue

        # otherwise it's inside the circumcircle, so we add to edge buffer and remove it from the opened list
        edges.push( circum.i, circum.j,    circum.j, circum.k,    circum.k, circum.i )
        opened.splice(j, 1)


      # dedup edges
      @_dedupe(edges)

      # Go through the edge buffer and create a triangle for each edge
      j = edges.length
      while j > 1
        opened.push(  @_circum( edges[--j], edges[--j], c, null, pts ) )


    for open in opened
      if (open.i < n and open.j < n and open.k < n)
        closed.push( open )

    @mesh = closed
    return @mesh


  # Get the initial "super triangle" that contains all the points in this set
  _supertriangle: () ->
    minPt = new Vector()
    maxPt = new Vector()

    for p in @points
      minPt.min( p )
      maxPt.max( p )

    d = maxPt.$subtract( minPt )
    mid = minPt.$add( maxPt ).divide(2)
    dmax = Math.max( d.x, d.y )

    return new Triangle( mid.$subtract( 20*dmax, dmax) ).to( mid.$add( 0, 20*dmax), mid.$add(20*dmax, -dmax) )


  # Get a triangle from 3 points in a list of points
  _triangle: (i, j, k, pts=@points) -> return new Triangle( pts[i] ).to( pts[j], pts[k] )

  # Get a circumcircle and triangle from 3 points in a list of points
  _circum: (i, j, k, tri=null, pts=@points) ->
    tri = tri or @_triangle(i,j,k, pts)

    return {
      i: i,
      j: j,
      k: k,
      triangle: tri,
      circle: tri.circumcircle()
    }

  # ## Dedupe the edges array
  _dedupe: (edges) ->

    j = edges.length;

    while j > 1
      b = edges[--j]
      a = edges[--j]

      i=j
      while i > 1
        n = edges[--i]
        m = edges[--i]

        if ((a == m and b == n) or (a == n and b == m))
          edges.splice(j, 2)
          edges.splice(i, 2)
          break

    return edges


# namespace
this.Delaunay = Delaunay