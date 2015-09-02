# ### Form makes visible the invisible. It transforms a point into an inkblot, or an arrow, or a musical note. By separating forms from its concepts, we may create a myriad of expressions on a single concept, or apply a unified style to various concepts. The Form class provides basic method to draw points, lines, and other primitives on CanvasSpace. Extend this class to visualize in different ways in different contexts.
class Form

  # ## Create a new Form which is based on HTML Canvass
  # @param `space` A space that has a valid context for this form. In this case, the space should represent an html canvas.
  # @return a new Form object
  constructor: ( space ) ->

    # ## a property to reference the canvas rendering context
    @cc = space.ctx

    # default style
    @cc.fillStyle = '#999'
    @cc.strokeStyle = '#666'
    @cc.lineWidth = 1
    @cc.font = "11px sans-serif"

    # ## a boolean property to set if the next drawing should be filled with current fill style
    @filled = true

    # ## a boolean property to set if the next drawing should be stroked with current stroke style
    @stroked = true

    # ## a property to specify the current font size
    @fontSize = 11

    # ## a property to specify the current font face
    @fontFace = "sans-serif"


  # ## A static function to get 2d context from a canvas element in the DOM
  # @param `canvas_id` the id attribute of the canvas element
  # @eg `Form.context('my_canvas')`
  # @return a canvas rendering context object
  @context : ( canvas_id ) ->
    # get canvas and its 2d context
    elem = document.getElementById( canvas_id )
    cc = if elem and elem.getContext then elem.getContext('2d') else false
    if !cc then throw "Cannot initiate canvas 2d context"
    cc


  # ## A static function to draw a line
  # @param `ctx` canvas rendering context
  # @param `pair` a Pair object
  @line: (ctx, pair) ->
    if !pair.p1 then throw "#{pair.toString()} is not a Pair"
    ctx.beginPath()
    ctx.moveTo( pair.x, pair.y )
    ctx.lineTo( pair.p1.x, pair.p1.y )
    ctx.stroke()



  # ## A static function to draw a line
  # @param `ctx` canvas rendering context
  # @param `pairs` an array of Pair objects
  @lines: (ctx, pairs) ->
    for ln in pairs
      Form.line( ctx, ln )


  # ## A static function to draw a rectangle
  # @param `ctx` canvas rendering context
  # @param `pair` a Pair object
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  @rect: (ctx, pair, fill=true, stroke=false) ->
    if !pair.p1 then throw "#{pair.toString() is not a Pair}"
    ctx.beginPath()
    ctx.moveTo( pair.x, pair.y )
    ctx.lineTo( pair.x, pair.p1.y )
    ctx.lineTo( pair.p1.x, pair.p1.y )
    ctx.lineTo( pair.p1.x, pair.y )
    ctx.closePath()
    if stroke then ctx.stroke()
    if fill then ctx.fill()


  # ## A static  function to draw a circle
  # @param `ctx` canvas rendering context
  # @param `c` a Circle object
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  @circle: (ctx, c, fill=true, stroke=false) ->
    ctx.beginPath()
    ctx.arc( c.x, c.y, c.radius, 0, Const.two_pi, false )
    if fill then ctx.fill()
    if stroke then ctx.stroke()
    return


  # ## A static function to draw a triangle
  # @param `ctx` canvas rendering context
  # @param `c` a Triangle object
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  @triangle: ( ctx, tri, fill=true, stroke=false) ->
    ctx.beginPath()
    ctx.moveTo( tri.x, tri.y )
    ctx.lineTo( tri.p1.x, tri.p1.y )
    ctx.lineTo( tri.p2.x, tri.p2.y )
    ctx.closePath()
    if fill then ctx.fill()
    if stroke then ctx.stroke()
    return


  # ## A static function to draw a point
  # @param `ctx` canvas rendering context
  # @param `pt` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  # @param `circle` a boolean value to specify if the points should be drawn as a circle. Default to false.
  @point: (ctx, pt, halfsize=2, fill=true, stroke=false, circle=false ) ->

    if circle
      ctx.beginPath()
      ctx.arc( pt.x, pt.y, halfsize, 0, Const.two_pi, false )

    else
      x1 = pt.x-halfsize
      y1 = pt.y-halfsize
      x2 = pt.x+halfsize
      y2 = pt.y+halfsize

      ctx.beginPath()
      ctx.moveTo( x1, y1 )
      ctx.lineTo( x1, y2 )
      ctx.lineTo( x2, y2 )
      ctx.lineTo( x2, y1 )
      ctx.closePath()

    if fill then ctx.fill()
    if stroke then ctx.stroke()
    return pt


  # ## A static function similar to `Form.point()` but draw a series of points
  # @param `ctx` canvas rendering context
  # @param `pts` an array of Points
  # @param `halfsize, fill, stroke, circle` same parameters as in `Form.point()`
  @points: (ctx, pts, halfsize=2, fill=true, stroke=false, circle=false ) ->
    for p in pts
      Form.point( ctx, p, halfsize, fill, stroke, circle )


  # ## A static function to draw a polygon
  # @param `ctx` canvas rendering context
  # @param `pts` an array of Points
  # @param `closePath` a boolean value to specify if the path should be closed (joining last point with first point)
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to true.
  @polygon: ( ctx, pts, closePath=true, fill=true, stroke=true) ->
    if pts.length <= 1 then return;
    ctx.beginPath()
    ctx.moveTo( pts[0].x, pts[0].y )
    for i in [1...pts.length] by 1
      ctx.lineTo( pts[i].x, pts[i].y )

    if closePath then ctx.closePath()
    if fill then ctx.fill()
    if stroke then ctx.stroke()
    return

  # ## A static function to draw a curve
  # @param `ctx` canvas rendering context
  # @param `pts` an array of Points
  @curve: ( ctx, pts ) ->
    Form.polygon( ctx, pts, false, false, true )


  # ## A static function to draw text
  # @param `ctx` canvas rendering context
  # @param `pt` a Point object to specify the anchor point
  # @param `txt` a string of text to draw
  # @param `maxWidth` specify a maximum width per line
  @text: ( ctx, pt, txt, maxWidth ) ->
    ctx.fillText( txt, pt.x, pt.y, maxWidth )



  # ## Set current fill style
  # @param `c` fill color which can be as color, gradient, or pattern. (See [canvas documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)) Default is `false` (transparent)
  # @eg `form.fill("#F90")` `form.fill("rgba(0,0,0,.5")` `form.fill(false)`
  # @demo form.fill
  # @return this Form
  fill: (c) ->
    @cc.fillStyle = if c then c else "transparent"
    @filled =  !!c
    return @


  # ## Set current stroke style
  # @param `c` stroke color which can be as color, gradient, or pattern. (See [canvas documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)) Default is false (transparent)
  # @param `width` Optional value (can be floating point) to set line width
  # @param `joint` Optional string to set line joint style. Can be "miter", "bevel", or "round".
  # @eg `form.stroke("#F90")` `form.stroke("rgba(0,0,0,.5")` `form.stroke(false)` `form.stroke("#000", 0.5, 'round')`
  # @return this Form
  stroke: (c, width, joint) ->
    @cc.strokeStyle = if c then c else "transparent"
    @stroked = !!c
    if width then @cc.lineWidth = width
    if joint then @cc.lineJoin = joint
    return @


  # ## Set font size and font face
  # @param `size` an integer value to specify font size in pixels
  # @param `face` optional name to change the font face, such as "sans-serif" or "Helvetica"
  # @eg `form.font(24)` `form.font(12, "Georgia")`
  # @demo form.font
  # @return this Form
  font: (size, face=@fontFace) ->
    @fontSize = size
    @cc.font = "#{size}px #{face}"
    return @


  # ## Draw a shape. Defaults to `sketch()`. Override this function to draw differently.
  # @return this Form
  draw: ( shape ) ->
    @sketch( shape )


  # ## Default draw based on the types of shape (Point, Line, Circle, etc)
  # @param `shape` any shape such as `Point` or `Line`, or an array of Points
  # @return this Form
  sketch: ( shape ) ->
    shape.floor()

    if shape instanceof Circle
      Form.circle(@cc, shape, @filled, @stroked)

    else if shape instanceof Rectangle
      Form.rect( @cc, shape, @filled, @stroked)

    else if shape instanceof Triangle
      Form.triangle( @cc, shape, @filled, @stroked)

    else if shape instanceof Line or shape instanceof Pair
      Form.line(@cc, shape)

    else if shape instanceof PointSet
      Form.polygon(@cc, shape.points )

    else if shape instanceof Vector or shape instanceof Point
      Form.point(@cc, shape)


    return @


  # ## Draw a point
  # @param `p` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `isCircle` a boolean value to specify if the point should be drawn as a circle. Default is false.
  # @return this Form
  point: (p, halfsize=2, isCircle=false) ->
    Form.point(@cc, p, halfsize, @filled, @stroked, isCircle )
    return @

  # ## Draw a series of points
  # @param `ps` an array of Points
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `isCircle` a boolean value to specify if the point should be drawn as a circle. Default is false.
  # @demo form.points
  # @return this Form
  points: (ps, halfsize=2, isCircle=false) ->
    Form.points(@cc, ps, halfsize, @filled, @stroked, isCircle )
    return @


  # ## Draw a line
  # @param `p` a Pair object
  # @return this Form
  line: (p) ->
    Form.line(@cc, p)
    return @

  # ## Draw a series of lines
  # @param `ps` an array of Lines
  # @return this Form
  lines: (ps) ->
    Form.lines(@cc, ps)
    return @


  # ## Draw a rectangle
  # @param `p` a Pair object
  # @return this Form
  rect: (p) ->
    Form.rect( @cc, p, @filled, @stroked )
    return @


  # ## Draw a circle
  # @param `p` a Circle object
  # @return this Form
  circle: (p) ->
    Form.circle( @cc, p, @filled, @stroked )
    return @


  # ## Draw a triangle
  # @param `p` a Triangle object
  # @return this Form
  triangle: (p) ->
    Form.triangle( @cc, p, @filled, @stroked )
    return @


  # ## Draw a polygon
  # @param `ps` an array of Points
  # @param `closePath` a boolean value to specify if the path should be closed (joining last point with first point)
  # @return this Form
  polygon: (ps, closePath) ->
    Form.polygon( @cc, ps, closePath, @filled, @stroked)
    return @


  # ## Draw a curve
  # @param `ps` an array of Points
  # @demo form.curve
  # @return this Form
  curve: (ps) ->
    Form.curve( @cc, ps )
    return @


  # ## Draw text
  # @param `p` a Point to specify anchor position
  # @param `txt` a string of text
  # @param `maxWidth` maximum width per line
  # @param `xoff, yoff` x and y positional offset values
  text: (p, txt, maxWidth=1000, xoff, yoff) ->
    pos = new Vector(p)
    if xoff then pos.add(xoff, 0)
    if yoff then pos.add(0, yoff)
    @cc.fillText(txt, pos.x, pos.y, maxWidth)
    return @


# namespace
this.Form = Form