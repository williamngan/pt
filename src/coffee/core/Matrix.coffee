# ### Functions to calculate various Matrix transformations
class Matrix

  # ## Get a 3x3 matrix for 2D rotation around an anchor point
  # @param `radian` rotation angle in radian
  # @param `anchor` anchor point of rotation
  # @return an array representing a 3x3 matrix. Apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @rotateAnchor2D: ( radian, anchor, axis=Const.xy ) ->
    a = anchor.get2D( axis )
    cosA = Math.cos( radian )
    sinA = Math.sin( radian )
    return [
      cosA, sinA, 0
      -sinA, cosA, 0
      a.x*(1-cosA) + a.y*sinA, a.y*(1-cosA)-a.x*sinA, 1
    ]


  # ## Get a 3x3 matrix to reflect a point along a line. See also `Line.reflect()` for a potentially simpler calculation
  # @param `line` the path to define the reflection
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @reflectAnchor2D: ( line, axis=Const.xy ) ->
    inc = line.intercept( axis )
    ang2 = Math.atan( inc.slope ) * 2
    cosA = Math.cos( ang2 )
    sinA = Math.sin( ang2 )
    return [
      cosA, sinA, 0
      sinA, -cosA, 0
      -inc.yi*sinA, inc.yi + inc.yi*cosA, 1
    ]


  # ## Get a 3x3 matrix for 2D shear from an anchor point
  # @param `sx, sy` shear scale values, usually between -1 to 1, where 0 means no change in shear.
  # @param `anchor` anchor point of shearing
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @shearAnchor2D: (sx, sy, anchor, axis=Const.xy  ) ->
    a = anchor.get2D( axis )
    tx = Math.tan( sx )
    ty = Math.tan( sy )

    return [
      1, tx, 0
      ty, 1, 0
      -a.y*ty, -a.x*tx, 1
    ]


  # ## Get a 3x3 matrix for 2D scale from an anchor point
  # @param `sx, sy` horizontal and vertical scale values, which are usually between 0 to N, where 1 means no change in scale.
  # @param `anchor` anchor point of scaling
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @scaleAnchor2D: (sx, sy, anchor, axis=Const.xy ) ->
    a = anchor.get2D( axis )
    return [
      sx, 0, 0,
      0, sy, 0,
      -a.x*sx + a.x, -a.y*sy + a.y, 1
    ]


  # ## Get a 3x3 scale matrix
  # @param `x, y` horizontal and vertical scale values, which are usually between 0 to N, where 1 means no change in scale.
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @scale2D: ( x, y ) ->
    return [
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ]


  # ## Get a 3x3 shear matrix
  # @param `x, y` shear scale values, usually between -1 to 1, where 0 means no change in shear.
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @shear2D: (x, y ) ->
    return [
      1, Math.tan(x), 0
      Math.tan(y), 1, 0
      0, 0, 1
    ]

  # ## Get a 3x3 rotate matrix
  # @param `cosA, sinA` cosine and sine of the rotation angle.
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @rotate2D: ( cosA, sinA ) ->
    return [
      cosA, sinA, 0,
      -sinA, cosA, 0,
      0, 0, 1
    ]


  # ## Get a 3x3 translate matrix.
  # @param `x, y` horizontal and vertical offsets to move by
  # @return an array representing a 3x3 matrix. apply this matrix to a homongeneous vector (x,y,1) to rotate it.
  @translate2D: ( x, y ) ->
    return [
      1, 0, 0
      0, 1, 0
      x, y, 1
    ]


  # ## Calculate a 2D transform by applying matrix to a homogeneous vector
  # @param `pt` a Point to transform
  # @param `m` an array representing 3x3 matrix
  # @param `byValue` a boolean value to update the values of `pt` parameter directly if set to true. If false, returns a new Vector object instead. Default is false.
  # @return a Vector object, or the `pt` object if `byValue` is true
  @transform2D: (pt, m, axis=Const.xy, byValue=false) ->
    v = pt.get2D( axis )
    x = v.x * m[0] + v.y * m[3] + m[6];
    y = v.x * m[1] + v.y * m[4] + m[7];
    # z = v.x * m[2] + v.y * m[5] + m[8];
    v.x = x
    v.y = y
    # v.z = z
    v = v.get2D(axis, true)

    if !byValue
      pt.set(v)
      return pt

    return v


# namescope
this.Matrix = Matrix