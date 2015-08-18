# ### A straight line or a moving particle, swayed by external forces or internal constraints, gradually deviates from its ideal path and becomes a curve. A river meanders and a strain of hair curls. A curve expresses the effects of forces and constraints.
class Curve extends PointSet

  # ## Create a new Curve. A Curve uses a set of anchor and/or control points to interpolate a curve.
  # @param `args` Similar to PointSet constructor, use comma-separated values, an array, or an object as parameters to specify the anchor point. Use `to()` to add points to the set.
  # @eg `new PointSet()` `new PointSet(1,2,3)` `new PointSet([2,4])` `new PointSet({x:3, y:6, z:9}).to(1,2,3)` `new PointSet(1,2,3).to([p1, p2, p3, p4, p5])`
  # @return a new Curve object
  constructor: () ->
    super

    # ## a boolean value to specify if this Curve is 2D or 3D. Default is `false` (2D).
    @is3D = false


  # A private function to pre-calculate the interpolation steps
  _getSteps: (steps) ->
    ts = []
    for s in [0..steps] by 1
      t = s/steps
      ts.push( [t, t*t, t*t*t] )
    return ts


  # ## Given an index for the starting position in `points` array, get the control and/or end points of a curve segment
  # @param `index` start index in `points` array. Default is 0.
  # @param `copyStart` an optional boolean value to indicate if the start index should be used twice. Default is false.
  # @return an object with 4 points `{p0, p1, p2, p3}`
  controlPoints: ( index=0, copyStart=false ) ->

    _index = (i) =>
      idx = if i < @points.length-1 then i else @points.length-1
      return idx

    # Get points based on index
    p0 = @points[index] # control pt 1
    if !p0.x? then return false

    index = if copyStart then index else index+1

    p1 = @points[ _index(index++) ] # t = 0
    p2 = @points[ _index(index++) ] # t = 1
    p3 = @points[ _index(index++) ] # control pt 2

    return {
      p0: p0
      p1: p1
      p2: p2
      p3: p3
    }


  # ## Create a Catmull-Rom curve. Catmull-Rom is a kind of Cardinal curve with smooth-looking curve.
  # @param `step` the number of line segments. Defaults to 10 steps.
  # @return an array of Points
  catmullRom: ( steps=10 ) ->

    if @points.length < 2 then return []

    ps = []
    ts = @_getSteps( steps )

    # use first point twice
    c = @controlPoints( 0, true )
    for i in [0..steps] by 1
      ps.push( @catmullRomPoint( ts[i], c ) )

    # go through all the points
    k = 0
    while k < @points.length-2
      c = @controlPoints( k )
      if c
        for i in [0..steps] by 1
          ps.push( @catmullRomPoint( ts[i], c ) )
        k++

    return ps


  # ## Interpolate to get a point on Catmull-Rom curve
  # @param `step` the point to interpolate, as an array of `[t, t*t, t*t*t]` where `t` is between 0 to 1
  # @param `ctrls` the control points which can be provided by `controlPoints()` function
  # @return a Point on the curve
  catmullRomPoint: ( step, ctrls ) ->
    # Basis Matrix (http://mrl.nyu.edu/~perlin/courses/fall2002/hw/12.html)
    # {-0.5,  1.5, -1.5, 0.5}
    # { 1  , -2.5,  2  ,-0.5},
    # {-0.5,  0  ,  0.5, 0  },
    # { 0  ,  1  ,  0  , 0  }

    t = step[0]
    t2 = step[1]
    t3 = step[2]

    h1 = ( -0.5*t3 + t2 - 0.5*t )
    h2 = ( 1.5*t3 - 2.5*t2 + 1 )
    h3 = ( -1.5*t3 + 2*t2 + 0.5*t )
    h4 = ( 0.5*t3 - 0.5*t2 )

    x = ( h1*ctrls.p0.x + h2* ctrls.p1.x + h3*ctrls.p2.x + h4*ctrls.p3.x  )
    y = ( h1*ctrls.p0.y + h2* ctrls.p1.y + h3*ctrls.p2.y + h4*ctrls.p3.y  )
    z = if !@is3D then 0 else ( h1*ctrls.p0.z + h2* ctrls.p1.z + h3*ctrls.p2.z + h4*ctrls.p3.z )

    return new Point(x,y,z)


  # ## Create a Cardinal spline curve
  # @param `step` the number of line segments. Defaults to 10 steps.
  # @param `tension` optional value between 0 to 1 to specify a "tension". Default to 0.5 which is the tension for Catmull-Rom curve
  # @return an array of Points
  cardinal: ( steps=10, tension=0.5 ) ->

    if @points.length < 2 then return []

    ps = []
    ts = @_getSteps( steps )

    # use first point twice
    c = @controlPoints( 0, true )
    for i in [0..steps] by 1
      ps.push( @cardinalPoint( ts[i], c, tension ) )

    # go through all the points
    k = 0
    while k < @points.length-2
      c = @controlPoints( k )
      if c
        for i in [0..steps] by 1
          ps.push( @cardinalPoint( ts[i], c, tension ) )
        k++

    return ps


  # ## Interpolate to get a point on Cardinal curve
  # @param `step` the point to interpolate, as an array of `[t, t*t, t*t*t]` where `t` is between 0 to 1
  # @param `ctrls` the control points which can be provided by `controlPoints()` function
  # @param `tension` optional value between 0 to 1 to specify a "tension". Default to 0.5 which is the tension for Catmull-Rom curve
  # @return a Point on the curve
  cardinalPoint: ( step, ctrls, tension=0.5 ) ->

    # Basis Matrix (http://algorithmist.wordpress.com/2009/10/06/cardinal-splines-part-4/)
    # [ -s  2-s  s-2   s ]
    # [ 2s  s-3  3-2s -s ]
    # [ -s   0    s    0 ]
    # [  0   1    0    0 ]

    t = step[0]
    t2 = step[1]
    t3 = step[2]

    h1 = tension * ( -1*t3 + 2*t2 - t )
    h2 = tension * ( -1*t3 + t2 )
    h2a = (2*t3 - 3*t2 + 1)
    h3 = tension * ( t3 - 2*t2 + t )
    h3a = (-2*t3 + 3*t2)
    h4 = tension * ( t3 - t2 )

    x = ctrls.p0.x*h1 + ctrls.p1.x*h2 + h2a*ctrls.p1.x + ctrls.p2.x*h3 + h3a*ctrls.p2.x + ctrls.p3.x*h4
    y = ctrls.p0.y*h1 + ctrls.p1.y*h2 + h2a*ctrls.p1.y + ctrls.p2.y*h3 + h3a*ctrls.p2.y + ctrls.p3.y*h4
    z = if !@is3D then 0 else ctrls.p0.z*h1 + ctrls.p1.z*h2 + h2a*ctrls.p1.z + ctrls.p2.z*h3 + h3a*ctrls.p2.z + ctrls.p3.z*h4

    return new Point(x,y,z)


  # ## Create a Bezier curve. In a cubic bezier curve, the first and 4th points are end points, and 2nd and 3rd points are control points.
  # @param `step` the number of line segments. Defaults to 10 steps
  # @return an array of Points
  bezier: ( steps=10 ) ->

    if @points.length < 4 then return []

    ps = []
    ts = @_getSteps( steps )

    # go through all the points
    k = 0
    while k <= @points.length-3
      c = @controlPoints( k )
      if c
        for i in [0..steps] by 1
          ps.push( @bezierPoint( ts[i], c ) )
        # go to the next set of point, but assume current end pt is next start pt
        k+=3

    return ps


  # ## Interpolate to get a point on a cubic Bezier curve
  # @param `step` the point to interpolate, as an array of `[t, t*t, t*t*t]` where `t` is between 0 to 1
  # @param `ctrls` the control and end points which can be provided by `controlPoints()` function. The first and 4th points are end points, and 2nd and 3rd points are control points.
  # @return a Point on the curve
  bezierPoint: (step, ctrls) ->
    # Bezier basis matrix
    # { -1,  3, -3,  1 }
    # {  3, -6,  3,  0 }
    # { -3,  3,  0,  0 }
    # {  1,  0,  0,  0 }

    t = step[0]
    t2 = step[1]
    t3 = step[2]

    h1 = ( -1*t3 + 3*t2 - 3*t + 1 )
    h2 = ( 3*t3 - 6*t2 + 3*t )
    h3 = ( -3*t3 + 3*t2 )
    h4 = t3

    x = ( h1*ctrls.p0.x + h2* ctrls.p1.x + h3*ctrls.p2.x + h4*ctrls.p3.x  )
    y = ( h1*ctrls.p0.y + h2* ctrls.p1.y + h3*ctrls.p2.y + h4*ctrls.p3.y  )
    z = if !@is3D then 0 else ( h1*ctrls.p0.z + h2* ctrls.p1.z + h3*ctrls.p2.z + h4*ctrls.p3.z )

    return new Point(x,y,z)


  # ## Create a B-Spline cuve
  # @param `step` the number of line segments. Defaults to 10 steps.
  # @param `tension` optional value between 0 to 1 to specify a "tension". Or `false` to have normal tension. Default is false.
  # @return an array of Points
  bspline: ( steps=10, tension=false ) ->

    if @points.length < 2 then return []

    ps = []
    ts = @_getSteps( steps )

    # go through all the points
    k = 0
    while k < @points.length-2
      c = @controlPoints( k )
      if c
        if !tension
          for i in [0..steps] by 1
            ps.push( @bsplinePoint( ts[i], c ) )
        else
          for i in [0..steps] by 1
            ps.push( @bsplineTensionPoint( ts[i], c, tension ) )
        k++

    return ps


  # ## Interpolate to get a point on B-Spline curve
  # @param `step` the point to interpolate, as an array of `[t, t*t, t*t*t]` where `t` is between 0 to 1
  # @param `ctrls` the control points which can be provided by `controlPoints()` function
  # @return a Point on the curve
  bsplinePoint: (step, ctrls) ->
    # Basis matrix:
    # { -1.0/6.0,  3.0/6.0, -3.0/6.0, 1.0/6.0 },
    # {  3.0/6.0, -6.0/6.0,  3.0/6.0,    0.0 },
    # { -3.0/6.0,      0.0,  3.0/6.0,    0.0 },
    # {  1.0/6.0,  4.0/6.0,  1.0/6.0,    0.0 }

    t = step[0]
    t2 = step[1]
    t3 = step[2]

    h1 = ( -0.16666666666*t3 + 0.5*t2 - 0.5*t + 0.16666666666 )
    h2 = ( 0.5*t3 - t2 + 0.66666666666 )
    h3 = ( -0.5*t3 + 0.5*t2 + 0.5*t + 0.16666666666 )
    h4 = (0.16666666666*t3)

    x = ( h1*ctrls.p0.x + h2* ctrls.p1.x + h3*ctrls.p2.x + h4*ctrls.p3.x  )
    y = ( h1*ctrls.p0.y + h2* ctrls.p1.y + h3*ctrls.p2.y + h4*ctrls.p3.y  )
    z = if !@is3D then 0 else ( h1*ctrls.p0.z + h2* ctrls.p1.z + h3*ctrls.p2.z + h4*ctrls.p3.z )

    return new Point(x,y,z)


  # ## Interpolate to get a point on B-Spline curve with tension (Duff)
  # @param `step` the point to interpolate, as an array of `[t, t*t, t*t*t]` where `t` is between 0 to 1
  # @param `ctrls` the control points which can be provided by `controlPoints()` function
  # @param `tension` optional value between 0 to 1 to specify a "tension". Default to 1 which is the normal tension.
  # @return a Point on the curve
  bsplineTensionPoint: (step, ctrls, tension=1) ->
    # Basis matrix:
    # [ -1/6a, 2 - 1.5a, 1.5a - 2, 1/6a ]
    # [ 0.5a,  2a-3,     3-2.5a    0 ]
    # [ -0.5a, 0,        0.5a,     0 ]
    # [ 1/6a,  1 - 1/3a, 1/6a,     0 ]

    t = step[0]
    t2 = step[1]
    t3 = step[2]

    h1 = tension * ( -0.16666666666*t3 + 0.5*t2 - 0.5*t + 0.16666666666 )
    h2 = tension * ( -1.5*t3 + 2*t2 - 0.33333333333 )
    h2a = (2*t3 - 3*t2 + 1)
    h3 = tension * ( 1.5*t3 - 2.5*t2 + 0.5*t + 0.16666666666 )
    h3a = (-2*t3 + 3*t2)
    h4 = tension * (0.16666666666*t3)

    x = ( h1*ctrls.p0.x + h2*ctrls.p1.x + h2a*ctrls.p1.x + h3*ctrls.p2.x + h3a*ctrls.p2.x + h4*ctrls.p3.x  )
    y = ( h1*ctrls.p0.y + h2*ctrls.p1.y + h2a*ctrls.p1.y + h3*ctrls.p2.y + h3a*ctrls.p2.y + h4*ctrls.p3.y  )
    z = if !@is3D then 0 else ( h1*ctrls.p0.z + h2* ctrls.p1.z + h2a*ctrls.p1.y + h3*ctrls.p2.z + h3a*ctrls.p2.z + h4*ctrls.p3.z )

    return new Point(x,y,z)


# namespace
this.Curve = Curve