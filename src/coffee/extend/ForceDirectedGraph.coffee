Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc


# Hacky Edge implementation
class Edge
  constructor: (source, target) ->
    @source = source
    @target = target

  @property 'p1',
    get: ->
      return {
        x: @target.x,
        y: @target.y,
        z: @target.z
      }

  @property 'x',
    get: ->
      return @source.x

  @property 'y',
    get: ->
      return @source.y

  @property 'z',
    get: ->
      return @source.z

  clone: () ->
    return new Edge(@source.clone(), @target.clone())


class Vertex extends Vector
  constructor: () ->
    super
    @displacement = new Vector()

class Graph
  constructor: () ->
    @vertices = []
    @edges = []

  addVertex: (vertex) ->
    @vertices.push(vertex)
    return @

  addEdge: (edge) ->
    @edges.push(edge)
    return @


class ForceDirectedGraph extends Graph
  # Fruchterman & Reingold algorithm: http://citeseer.ist.psu.edu/viewdoc/download?doi=10.1.1.13.8444&rep=rep1&type=pdf
  # Walshaw's algorithm: http://jgaa.info/accepted/2003/Walshaw2003.7.3.pdf

  # ## Create a new force-directed graph. Vertices and Edges are stored in `this.vertices` and `this.edges`, respectively.
  # @return new ForceDirectedGraph object
  constructor: (width, height) ->
    super()
    @width = width
    @height = height
    @frames = []

  _fa: (x, k) ->
    return x * x / k;

  _fr: (x, k) ->
    return k * k / x;

  _cool: (lambda, temperature) ->
    return lambda * temperature

  # ## Calculate new vertex/edge positions using a force-directed graph algorithm
  # @return this ForceDirectedGraph object
  generate: () ->
    lambda = 0.9 # From Walshaw paper
    iterations = 50 # From F&R paper
    temperature = 0.1 * Math.sqrt(@width * @height) # From F&R paper
    C = 0.2 # From Walshaw paper
    k = C * Math.sqrt(@width * @height / @vertices.length)

    for i in [0...iterations] by 1

      # Caluclate repulsive forces
      for v in @vertices

        # Each vertex has a position and a displacement vector
        v.displacement = new Vector()

        for u in @vertices when u isnt v
          delta = v.$subtract(u)
          deltaMag = delta.magnitude()

          if (deltaMag == 0)
            deltaMag = 0.01; # If two different vertices are in the same position

          v.displacement.add(
            delta.$divide(deltaMag)
            .multiply(@_fr(deltaMag, k))
          )

      # Calculate attractive forces
      for e in @edges
        delta = e.source.$subtract(e.target)
        deltaMag = delta.magnitude()

        if (deltaMag == 0)
          deltaMag = 0.01;

        e.source.displacement.subtract(
          delta.$divide(deltaMag)
          .multiply(@_fa(deltaMag, k))
        )
        e.target.displacement.add(
          delta.$divide(deltaMag)
          .multiply(@_fa(deltaMag, k))
        )

      # Limit the maximum displacement to the temperature
      # and then make sure the vertices don't fall ourside the frame
      for v in @vertices
        disp = v.displacement
        dispMag = v.displacement.magnitude()

        # Move vertex
        v.add(disp.divide(dispMag).multiply(Math.min(dispMag, temperature)))

        if (v.x < 0)
          v.x = 0
        if (v.x > @width)
          v.x = @width
        if (v.y < 0)
          v.y = 0
        if (v.y > @height)
          v.y = @height

      # Cooling
      temperature = @_cool(lambda, temperature)

  # ## Move every vertex in the graph to a random position (within the frame)
  # @return this ForceDirectedGraph object
  randomize: () ->
    for vertex in @vertices
      x = Math.random() * @width
      y = Math.random() * @height
      vertex.moveTo(x, y);
    return @


this.Edge = Edge;
this.Vertex = Vertex;
this.ForceDirectedGraph = ForceDirectedGraph;
