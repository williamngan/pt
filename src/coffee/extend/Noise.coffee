# ### Generate Perlin and Simplex2D noise.
class Noise extends Vector

  # Perlin noise implementation based on Stefan Gustavson's java implementation
  # http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
  # http://webstaff.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java
  # coffeescript based on sj26's simplex port: https://gist.github.com/sj26/6145489

  grad3: [
    [1,1, 0], [-1,1, 0], [1,-1,0], [-1,-1,0],
    [1,0, 1], [-1, 0, 1], [1,0,-1], [-1,0,-1],
    [0, 1,1], [ 0,-1,1], [0,1,-1], [ 0,-1,-1]
  ]

  simplex: [
    [0,1,2,3], [0,1,3,2], [0,0,0,0], [0,2,3,1], [0,0,0,0], [0,0,0,0]
    [0,0,0,0], [1,2,3,0], [0,2,1,3], [0,0,0,0], [0,3,1,2], [0,3,2,1]
    [0,0,0,0], [0,0,0,0], [0,0,0,0], [1,3,2,0], [0,0,0,0], [0,0,0,0]
    [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]
    [1,2,0,3], [0,0,0,0], [1,3,0,2], [0,0,0,0], [0,0,0,0], [0,0,0,0]
    [2,3,0,1], [2,3,1,0], [1,0,2,3], [1,0,3,2], [0,0,0,0], [0,0,0,0]
    [0,0,0,0], [2,0,3,1], [0,0,0,0], [2,1,3,0], [0,0,0,0], [0,0,0,0]
    [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]
    [2,0,1,3], [0,0,0,0], [0,0,0,0], [0,0,0,0], [3,0,1,2], [3,0,2,1]
    [0,0,0,0], [3,1,2,0], [2,1,0,3], [0,0,0,0], [0,0,0,0], [0,0,0,0]
    [3,1,0,2], [0,0,0,0], [3,2,0,1], [3,2,1,0]
  ]

  constructor: () ->
    super

    @p = [151,160,137,91,90,15,
         131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
         190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
         88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
         77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
         102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,
         135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,
         5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
         223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,
         129,22,39,253,9,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,
         251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
         49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
         138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ]

    # To remove the need for index wrapping, double the permutation table length
    @perm = (@p[i & 255] for i in [0...512])


  # ## Generate a different noise by seeding
  # @param `seed` a value between 0 to 1
  # @eg `noise.seed(0.1)`, `noise.seed(Math.random())`
  seed: ( seed ) ->
    if(seed > 0 && seed < 1)
      seed *= 65536

    seed = Math.floor(seed)
    if(seed < 256)
      seed |= seed << 8

    for i in [0..255]
      v = if (i & 1) then @p[i] ^ (seed & 255) else @p[i] ^ ((seed>>8) & 255)
      @perm[i] = @perm[i + 256] = v


  _dot: (g, x, y) ->
    g[0] * x + g[1] * y


  # ## Get a 2D perlin noise value. Increase the x and y parameters by a small amount (eg, 0.01) at each step to get a smooth noise.
  # @param `x, y` optional x and y dimension, or leave empty to use this vector's x and y position
  # @eg `noise.perlin2D()`, `noise.perlin2D(10.001, 0.1)`
  # @return a value between 0 to 1
  perlin2D: (xin=@x, yin=@y) ->

    _fade = (f) -> f*f*f*(f*(f*6-15)+10)

    i = Math.floor( xin ) % 255
    j = Math.floor( yin ) % 255
    x = xin - i
    y = yin - j

    n00 = @_dot(@grad3[ (i+@perm[j]) % 12 ], x, y )
    n01 = @_dot(@grad3[ (i+@perm[j+1]) % 12 ], x, y-1 )
    n10 = @_dot(@grad3[ (i+1+@perm[j]) % 12 ], x-1, y )
    n11 = @_dot(@grad3[ (i+1+@perm[j+1]) % 12 ], x-1, y-1 )

    tx = _fade(x);
    return Util.lerp( Util.lerp(n00, n10, tx), Util.lerp(n01, n11, tx), _fade(y) )


  # ## Get a 2D simplex noise value. Increase the x and y parameters by a small amount (eg, 0.01) at each step to get a smooth noise.
  # @param `x, y` optional x and y dimension, or leave empty to use this vector's x and y position
  # @eg `noise.simplex2D()`, `noise.simplex2D(10.001, 0.1)`
  # @return a value between -1 to 1
  simplex2D: (xin=@x, yin=@y) ->

    # Skew the input space to determine which simplex cell we're in
    F2 = 0.5*(Math.sqrt(3.0)-1.0)
    s = (xin+yin)*F2 # Hairy factor for 2D
    i = Math.floor(xin+s)
    j = Math.floor(yin+s)
    G2 = (3.0-Math.sqrt(3.0))/6.0
    t = (i+j)*G2

    # Unskew the cell origin back to (x,y) space
    X0 = i-t
    Y0 = j-t

    # The x,y distances from the cell origin
    x0 = xin-X0
    y0 = yin-Y0

    # For the 2D case, the simplex shape is an equilateral triangle.
    # Determine which simplex we are in.
    # Offsets for second (middle) corner of simplex in (i,j) coords
    if x0 > y0
      # lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1
      j1=0
    else
      # upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0
      j1=1

    # A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    # a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    # c = (3-Math.sqrt(3))/6

    x1 = x0 - i1 + G2 # Offsets for middle corner in (x,y) unskewed coords
    y1 = y0 - j1 + G2
    x2 = x0 - 1.0 + 2.0 * G2 # Offsets for last corner in (x,y) unskewed coords
    y2 = y0 - 1.0 + 2.0 * G2

    # Work out the hashed gradient indices of the three simplex corners
    ii = i & 255
    jj = j & 255
    gi0 = @perm[ii+@perm[jj]] % 12
    gi1 = @perm[ii+i1+@perm[jj+j1]] % 12
    gi2 = @perm[ii+1+@perm[jj+1]] % 12

    # Calculate the contribution from the three corners
    t0 = 0.5 - x0*x0-y0*y0
    if t0 < 0
      n0 = 0.0
    else
      t0 *= t0
      n0 = t0 * t0 * @_dot(@grad3[gi0], x0, y0)  # (x,y) of grad3 used for 2D gradient

    t1 = 0.5 - x1*x1-y1*y1
    if t1 < 0
      n1 = 0.0
    else
      t1 *= t1
      n1 = t1 * t1 * @_dot(@grad3[gi1], x1, y1)

    t2 = 0.5 - x2*x2-y2*y2
    if t2 < 0
      n2 = 0.0
    else
      t2 *= t2
      n2 = t2 * t2 * @_dot(@grad3[gi2], x2, y2)

    # Add contributions from each corner to get the final noise value.
    # The result is scaled to return values in the interval [-1,1].
    return 70.0 * (n0 + n1 + n2)


# namespace
this.Noise = Noise
