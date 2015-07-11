# ### A color in a color space
class Color extends Vector

  # ## Create a new Color. Color lets you define a color in a specific mode. [This article](https://software.intel.com/en-us/node/503873) from Intel has a good overview of different color models.
  # @param `args` Set the three values of a color as comma-separated values, as an array, or as an object with `{x, y, z}` properties. Optionally set `alpha` in a 4th parameter, and color mode string in 5th parameter.
  # @eg `new Color()` `new Color(255,100,20)` `new Color([2,4])` `new Color({x:3, y:6, z:9})` `new Color(360,1,1,0.5)`, `new Color(100,50,-50,1,'lab')`
  # @return a new Color object
  constructor: ( args ) ->
    super

    # ## alpha value from 0 to 1, where 0 is fully transparent, and 1 is fully opaque
    @alpha = if arguments.length >=4 then Math.min( 1, Math.max( arguments[3], 0) ) else 1

    # ## color mode id such as "lab" or "rgb"
    @mode = if arguments.length >=5 then arguments[4] else 'rgb'


  # ## A property to adject XYZ for Standard Observer 2deg, Daylight/sRGB illuminant D65
  @XYZ = {
    D65: {x: 95.047, y: 100, z: 108.883}
  }

  ## # A static function `Color.parseHex` to parse a hex string and a Color or rgb array
  # @param `hex` hexadecial string with or without "#" in the beginning. It can be "FF9900", "F90", or "FF9900CC" with alpha.
  # @param `asColor` Optional boolean value where the return value will be a `Color` object if set to `true`. Defaults to `false` which returns an array.
  # @eg `Color.parseHex("#FF9900")` `Color.parseHex("F90")` `Color.parseHex("FF9900CC")` `Color.parseHex("FF9900", true)`
  # @return a Color object, or an array [r, g, b]
  @parseHex : (hex, asColor=false) ->
    if hex.indexOf('#') == 0 then hex = hex.substr(1) # remove '#' if needed
    if hex.length == 3 then hex = ""+hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
    if hex.length == 8
      @alpha = hex.substr(6) & 0xFF / 255
      hex = hex.substring(0,6)

    hexValue = parseInt( hex, 16 )
    rgb = [ hexValue >> 16, hexValue >> 8 & 0xFF, hexValue & 0xFF]
    return if asColor then new Color( rgb[0], rgb[1], rgb[2] ) else rgb


  # ## set a color mode and convert current color to new color mode
  # @param `m` a string to specify color mode: 'hsl', 'hsb', 'rgb', 'lab', 'lch', 'xyz'
  # @eg `color.setMode('lab')`
  # @return this Color object with new color mode
  setMode : ( m ) ->
    m = m.toLowerCase()

    if m != @mode
      switch @mode
        when 'hsl' then @copy( Point.get( Color.HSLtoRGB(@x, @y, @z) ) )
        when 'hsb' then @copy( Point.get( Color.HSBtoRGB(@x, @y, @z) ) )
        when 'lab' then @copy( Point.get( Color.LABtoRGB(@x, @y, @z) ) )
        when 'lch' then @copy( Point.get( Color.LCHtoRGB(@x, @y, @z) ) )
        when 'xyz' then @copy( Point.get( Color.XYZtoRGB(@x, @y, @z) ) )


      switch m
        when 'hsl' then @copy( Point.get( Color.RGBtoHSL(@x, @y, @z) ) )
        when 'hsb' then @copy( Point.get( Color.RGBtoHSB(@x, @y, @z) ) )
        when 'lab' then @copy( Point.get( Color.RGBtoLAB(@x, @y, @z) ) )
        when 'lch' then @copy( Point.get( Color.RGBtoLCH(@x, @y, @z) ) )
        when 'xyz' then @copy( Point.get( Color.RGBtoXYZ(@x, @y, @z) ) )

#    if m != @mode
#      if m is 'rgb' # to RGB
#        if @mode is 'hsl' then @copy( Point.get( Color.HSLtoRGB(@x, @y, @z) ) )
#        if @mode is 'hsb' then @copy( Point.get( Color.HSBtoRGB(@x, @y, @z) ) )
#
#      else if m is 'hsb' # to HSB
#        if @mode is 'rgb' then @copy( Point.get( Color.RGBtoHSB(@x, @y, @z) ) )
#        # # TODO: if @mode is 'hsl' then
#
#      else if m is 'hsl' # to HSL
#        if @mode is 'rgb' then @copy( Point.get( Color.RGBtoHSL(@x, @y, @z) ) )
#        # # TODO: if @mode is 'hsb' then
#
#      else if m is 'xyz'
#        if @mode is 'rgb' then @copy( Point.get( Color.RGBtoXYZ(@x, @y, @z) ) )
#        # # TODO: if @mode is 'hsb' then

    @mode = m
    return @


  # ## Get rgb value as hex string such as '#123456'
  hex: () ->
    if @mode is 'rgb' then @floor() # make sure to get rgb as integer
    cs = @values( (@mode != 'rgb') ) # convert to rgb if needed

    # pad zero
    _hexstring = (n) ->
      n = n.toString(16)
      if n.length < 2
        return '0'+n
      else
        return n

    ct = (_hexstring( n ) for n in cs)
    return '#' + ct[0] + ct[1] + ct[2]


  # ## Get rgb string such as 'rgb(12,34,56)'
  rgb: () ->
    if @mode is 'rgb' then @floor() # make sure to get rgb as integer
    cs = @values( (@mode != 'rgb') ) # convert to rgb if needed
    "rgb(#{ cs[0] }, #{ cs[1] }, #{ cs[2] })"


  # ## Get rgba string such as 'rgba(12,34,56, 0.2)'
  rgba: () ->
    if @mode is 'rgb' then @floor() # make sure to get rgb as integer
    cs = @values( (@mode != 'rgb') ) # convert to rgb if needed
    "rgba(#{ cs[0] }, #{ cs[1] }, #{ cs[2] }, #{ @alpha })"


  # ## Get color values (based on current color mode) as an array
  # @param `toRGB` Optional boolean value to convert to rgb value if set to `true`. Default is false.
  # @return an array of colro values
  values: ( toRGB=false ) ->
    cs = [@x, @y, @z]
    if toRGB and @mode != 'rgb' # convert to rgb first
      switch @mode
        when 'hsl' then cs =  Color.HSLtoRGB(@x, @y, @z)
        when 'hsb' then cs =  Color.HSBtoRGB(@x, @y, @z)
        when 'lab' then cs =  Color.LABtoRGB(@x, @y, @z)
        when 'lch' then cs =  Color.LCHtoRGB(@x, @y, @z)
        when 'xyz' then cs =  Color.XYZtoRGB(@x, @y, @z)

    return (Math.floor( v ) for v in cs)


  # color conversion code ported to coffeescript
  # http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript

  # ## A static function `Color.RGBtoHSL` to convert RGB to HSL
  # @param `r, g, b` red, green, blue values from 0 to 255
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @eg `Color.RGBtoHSL(255,70,0)` `Color.RGBtoHSL(1,0.3,0, true)`
  # @return an array of [h, s, l] where h is from 0 to 360, s is from 0 to 1, and l is from 0 to 1.
  @RGBtoHSL : (r, g, b, normalizedInput, normalizedOutput) ->
    if not normalizedInput
      r /= 255
      g /= 255
      b /= 255

    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    h = (max + min) / 2
    s = h
    l = h

    if max == min
      h = 0
      s = 0 # achromatic
    else
      d = max - min
      s = if l > 0.5 then d / (2 - max - min) else d / (max + min)

      switch max
        when r then h = (g - b) / d + (if g < b then 6 else 0)
        when g then h = (b - r) / d + 2
        when b then h = (r - g) / d + 4
        else h = 0

    return if normalizedOutput then [h/60, s, l] else [ h*60, s, l]


  # ## A static function `Color.HSLtoRGB` to convert HSL to RGB
  # @param `h, s, l` hue, saturation, and lightness. hue value from 0 to 360, saturation and lightness values from 0 to 1
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @eg `Color.HSLtoRGB(360,0.7,0.9)` `Color.HSLtoRGB(1,0.3,0, true)`
  # @return an array of [r, g, b] where each value is from 0 to 255
  @HSLtoRGB : ( h, s, l, normalizedInput, normalizedOutput) ->

    if s == 0
      return if normalizedOutput then [1,1,1] else [255,255,255]
    else

      if not normalizedInput
        h /= 360 # normalize hue

      q = if l <= 0.5 then l * (1 + s) else l + s - (l * s)
      p = 2 * l - q;

      hue2rgb = ( p, q, t ) ->

        if t < 0
          t += 1
        else if t > 1
          t -= 1

        if t * 6 < 1
          return p + (q - p) * t * 6
        else if t * 2 < 1
          return q
        else if t * 3 < 2
          return p + (q - p) * ((2 / 3) - t) * 6
        else
          return p

      r = hue2rgb( p, q, ( h + 1/3 ) )
      g = hue2rgb( p, q, h )
      b = hue2rgb( p, q, ( h - 1/3 ) )

      return if normalizedOutput then [ r, g, b ] else [r*255, g*255, b*255]


  # ## A static function `Color.RGBtoHSB` to convert RGB to HSB
  # @param `r, g, b` red, green, blue values from 0 to 255
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @eg `Color.RGBtoHSB(255,70,0)` `Color.RGBtoHSB(1,0.3,0, true)`
  # @return an array of [h, s, b] where h is from 0 to 360, s is from 0 to 1, and b is from 0 to 1.
  @RGBtoHSB : (r, g, b, normalizedInput, normalizedOutput) ->

    if not normalizedInput
      r /= 255
      g /= 255
      b /= 255

    max = Math.max(r, g, b)
    min = Math.min(r, g, b)

    d = max - min
    s = if max is 0 then 0 else d / max
    v = max

    if max is min
      h = 0
    else
      switch max
        when r then h = (g - b) / d + ( if g < b then 6 else 0 )
        when g then h = (b - r) / d + 2
        when b then h = (r - g) / d + 4
        else h = 0

    return if normalizedOutput then [h / 60, s, v] else [h * 60, s, v]


  # ## A static function `Color.HSBtoRGB` to convert HSB to RGB
  # @param `h, s, b` hue, saturation, and brightness. hue value from 0 to 360, saturation and brightness values from 0 to 1
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @eg `Color.HSBtoRGB(360,0.7,0.9)` `Color.HSBtoRGB(1,0.3,0, true)`
  # @return an array of [r, g, b] where each value is from 0 to 255
  @HSBtoRGB : (h, s, v, normalizedInput, normalizedOutput) ->

    if not normalizedInput
      h /= 360

    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)

    switch i % 6
      when 0 then rgb = [v, t, p]
      when 1 then rgb = [q, v, p]
      when 2 then rgb = [p, v, t]
      when 3 then rgb = [p, q, v]
      when 4 then rgb = [t, p, v]
      when 5 then rgb = [v, p, q]
      else rgb = [0,0,0]

    return if normalizedOutput then rgb else [ rgb[0]*255, rgb[1]*255, rgb[2]*255 ]


  # ## Static function `Color.RGBtoLAB` transforms RGB to LAB
  # @param `r, g, b` red, green, and blue values from 0 to 255
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @return an array of [L, a, b] where lightness (L) is from 0 to 100, a and b component values are from -128 to 127. red/green colors are represented in a, and yellow/blue colors are represented in b.
  @RGBtoLAB : (r, g, b, normalizedInput, normalizedOutput) ->
    if normalizedInput
      r *= 255
      g *= 255
      b *= 255

    xyz = Color.RGBtoXYZ(r,g,b)
    return Color.XYZtoLAB( xyz[0], xyz[1], xyz[2] )


  # ## Static function `Color.LABtoRGB` transforms LAB to RGB
  # @param `L, a, b` lightness (L) is from 0 to 100, a and b component values are from -128 to 127. red/green colors are represented in a, and yellow/blue colors are represented in b.
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @return an array of [r, g, b] where each value is from 0 to 255
  @LABtoRGB : (L, a, b, normalizedInput, normalizedOutput) ->
    if normalizedInput
      L *= 100
      a = (a-0.5) * 127
      b = (b-0.5) * 127

    xyz = Color.LABtoXYZ( L, a, b)
    rgb = Color.XYZtoRGB( xyz[0], xyz[1], xyz[2] )
    return if normalizedOutput then [ rgb[0]/255, rgb[1]/255, rgb[2]/255 ] else rgb

  # ## Static function `Color.RGBtoLCH` transforms RGB to LCH (Cylindrical Lab)
  # @param `r, g, b` red, green, and blue values from 0 to 255
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @return an array of [L, c, h] where lightness (l) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  @RGBtoLCH : (r, g, b, normalizedInput, normalizedOutput) ->
    if normalizedInput
      r *= 255
      g *= 255
      b *= 255

    lab = Color.RGBtoLAB(r,g,b)
    lch = Color.LABtoLCH( lab[0], lab[1], lab[2] )
    return if normalizedOutput then [ lch[0]/100, lch[1]/100, lch[2]/360 ] else lch


  # ## Static function `Color.LCHtoRGB` transforms LCH to RGB
  # @param `L, c, h` lightness (l) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  # @return an array of [r, g, b] where each value is from 0 to 255
  @LCHtoRGB : (L, c, h, normalizedInput, normalizedOutput) ->
    if normalizedInput
      L *= 100
      c *= 100
      h *= 360

    lab = Color.LCHtoLAB( L, c, h )
    xyz = Color.LABtoXYZ( lab[0], lab[1], lab[2])
    rgb = Color.XYZtoRGB( xyz[0], xyz[1], xyz[2] )
    return if normalizedOutput then [ rgb[0]/255, rgb[1]/255, rgb[2]/255 ] else rgb


  # ## Static function `Color.XYZtoRGB` to convert XYZ to RGB. This is usually used when converting between LAB and RGB.
  # @param `x, y, z` x, y, z values from 0 to 100
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @return an array of [r, g, b] where each value is from 0 to 255
  @XYZtoRGB : (x, y, z, normalizedInput, normalizedOutput) ->

    if not normalizedInput
      x = x / 100
      y = y / 100
      z = z / 100

    rgb = [
      x *  3.2404542 + y * -1.5371385 + z * -0.4985314
      x * -0.9692660 + y *  1.8760108 + z *  0.0415560
      x *  0.0556434 + y * -0.2040259 + z *  1.0572252
    ]

    # convert xyz to rgb. Note that not all colors are visible in rgb, so here we bound rgb between 0 to 1
    for c, i in rgb
      if c < 0
        rgb[i] = 0
      else
        rgb[i] = Math.min( 1, if ( c > 0.0031308 ) then 1.055 * ( Math.pow( c, 1/2.4 ) ) - 0.055 else 12.92 * c )

#    r = if ( r > 0.0031308 ) then 1.055 * ( Math.pow( r, 1/2.4 ) ) - 0.055 else (if r < 0 then 0 else 12.92 * r)
#    g = if ( g > 0.0031308 ) then 1.055 * ( Math.pow( g, 1/2.4 ) ) - 0.055 else (if g < 0 then 0 else 12.92 * g)
#    b = if ( b > 0.0031308 ) then 1.055 * ( Math.pow( b, 1/2.4 ) ) - 0.055 else (if b < 0 then 0 else 12.92 * b)

    return if normalizedOutput then rgb else [ Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255) ]


  # ## A static function `Color.RGBtoXYZ` to convert RGB to XYZ. This is usually used when converting between LAB and RGB.
  # @param `r, g, b` red, green, blue values from 0 to 255
  # @param `normalizedInput, normalizedOutput` Optional boolean values to indicate if input parameters are normalized (0 to 1), and if return value should be normalized
  # @return an array of [x, y, z] where each value is from 0 to 100
  @RGBtoXYZ : (r, g, b, normalizedInput, normalizedOutput) ->

    if not normalizedInput
      r = ( r / 255 )
      g = ( g / 255 )
      b = ( b / 255 )

    r = if ( r > 0.04045 ) then Math.pow( ( r + 0.055 ) / 1.055, 2.4 ) else r / 12.92
    g = if ( g > 0.04045 ) then Math.pow( ( g + 0.055 ) / 1.055, 2.4 ) else g / 12.92
    b = if ( b > 0.04045 ) then Math.pow( ( b + 0.055 ) / 1.055, 2.4 ) else b / 12.92

    if not normalizedOutput
      r = r * 100
      g = g * 100
      b = b * 100

    return [
      r * 0.4124564 + g * 0.3575761 + b * 0.1804375
      r * 0.2126729 + g * 0.7151522 + b * 0.0721750
      r * 0.0193339 + g * 0.1191920 + b * 0.9503041
    ]


  # ## Static function `Color.XYZtoLAB` to convert XYZ to LAB.
  # @param `x, y, z` x, y, z values from 0 to 100
  # @return an array of [l, a, b] where lightness (L) is from 0 to 100, a and b values are from -128 to 127
  @XYZtoLAB : (x, y, z) ->

    # adjusted
    x = x / Color.XYZ.D65.x
    y = y / Color.XYZ.D65.y
    z = z / Color.XYZ.D65.z

    calc = (n) ->
      return if ( n > 0.008856 ) then Math.pow(n, 1/3) else (7.787 * n) + 16/116

    cy = calc( y )

    return [
      ( 116 * cy ) - 16
      500 * ( calc(x) - cy )
      200 * ( cy - calc(z) )
    ]

  # ## Static function `Color.LABtoXYZ` to convert LAB to XYZ.
  # @param `L, a, b` lightness (L) is from 0 to 100, a and b component values are from -128 to 127
  # @return an array of [x, y, z] where each value is from 0 to 100
  @LABtoXYZ : (L, a, b) ->
    y = ( L + 16 ) / 116
    x = a / 500 + y
    z = y - b / 200

    calc = (n) ->
      nnn = Math.pow(n,3)
      return if ( nnn > 0.008856 ) then nnn else ( n - 16 / 116 ) / 7.787

    # adjusted
    xyz = [
      Math.min( Color.XYZ.D65.x, Color.XYZ.D65.x * calc(x) )
      Math.min( Color.XYZ.D65.y, Color.XYZ.D65.y * calc(y) )
      Math.min( Color.XYZ.D65.y, Color.XYZ.D65.z * calc(z) )
    ]

    return xyz

  # ## Static function `Color.XYZtoLUV` to convert XYZ to LUV.
  # @param `x, y, z` x, y, z values from 0 to 100
  # @return an array of [l, u, v] where lightness is from 0 to 100, u is from -134 to 220, and v is from -140 o 122
  @XYZtoLUV : (x, y, z) ->
    u = ( 4 * x ) / ( x + ( 15 * y ) + ( 3 * z ) )
    v = ( 9 * y ) / ( x + ( 15 * y ) + ( 3 * z ) )

    y = y / 100
    y = if ( y > 0.008856 ) then Math.pow( y, 1/3 ) else ( 7.787 * y + 16 / 116 )

    refU = ( 4 * Color.XYZ.D65.x ) / ( Color.XYZ.D65.x + ( 15 * Color.XYZ.D65.y ) + ( 3 * Color.XYZ.D65.z ) )
    refV = ( 9 * Color.XYZ.D65.y ) / ( Color.XYZ.D65.x + ( 15 * Color.XYZ.D65.y ) + ( 3 * Color.XYZ.D65.z ) )

    L = ( 116 * y ) - 16
    return [
      L
      13 * L * ( u - refU )
      13 * L * ( v - refV )
    ]

  # ## Static function `Color.LUVtoXYZ` to convert LUV to XYZ.
  # @param `L, u, v` lightness (L) is from 0 to 100, u is from -134 to 220, and v is from -140 o 122
  # @return an array of [x, y, z] where each value is from 0 to 100
  @LUVtoXYZ : (L, u, v) ->
    y = ( L + 16 ) / 116
    cubeY = y*y*y
    y = if ( cubeY > 0.008856 ) then cubeY else ( y - 16 / 116 ) / 7.787

    refU = ( 4 * Color.XYZ.D65.x ) / ( Color.XYZ.D65.x + ( 15 * Color.XYZ.D65.y ) + ( 3 * Color.XYZ.D65.z ) )
    refV = ( 9 * Color.XYZ.D65.y ) / ( Color.XYZ.D65.x + ( 15 * Color.XYZ.D65.y ) + ( 3 * Color.XYZ.D65.z ) )

    u = u / ( 13 * L ) + refU
    v = v / ( 13 * L ) + refV

    y = y*100
    x = -1 * (9 * y * u) / ( (u - 4) * v  - u * v )
    return [ x, y,  ( 9 * y - (15 * v * y) - (v * x) ) / (3 * v ) ]


  # ## Static function `Color.LABtoLCH` transforms LAB to Cylindrical LCH
  # @param `L, a, b` lightness (L) is from 0 to 100, a and b component values are from -128 to 127
  # @return an array of [l, c, h] where lightness (l) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  @LABtoLCH : (L, a, b) ->
    h = Math.atan2( b, a )  # Quadrant by signs
    h = if ( h > 0 ) then (180 * h / Math.PI) else 360 - ( 180 * Math.abs( h ) / Math.PI )
    return [L, Math.sqrt( a*a + b*b ), h]


  # ## Static function `Color.LCHtoLAB` transforms Cylindrical LCH to LAB
  # @param `L, c, h` lightness (L) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  # @return an array of [l, a, b] where lightness (L) is from 0 to 100, a and b values are from -128 to 127
  @LCHtoLAB : (L, c, h) ->
    radH = Math.PI * h / 180
    return [
      L
      Math.cos( radH ) * c
      Math.sin( radH ) * c
    ]

  # ## Static function `Color.LUVtoLCH` to convert LUV to LCH.
  # @param `L, u, v` lightness (L) is from 0 to 100, u is from -134 to 220, and v is from -140 o 122
  # @return an array of [l, c, h] where lightness (l) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  @LUVtoLCH : (L, u, v) -> LABtoLCH( L, u, v )

  # ## Static function `Color.LCHtoLUV` transforms Cylindrical LCH to LUV
  # @param `L, c, h` lightness (L) and chroma (c) is from 0 to 100, and hue (h) is from 0 to 360
  # @return an array of [l, u, v] where lightness is from 0 to 100, u is from -134 to 220, and v is from -140 o 122
  @LCHtoLUV : (L, c, h) -> LCHtoLAB( L, c, h )


# namespace
this.Color = Color