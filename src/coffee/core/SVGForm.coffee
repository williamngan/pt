class SVGForm

  @_domId = 0

  # ## Create a new Form which is based on SVG
  # @param `space` A space that has a valid context for this form. In this case, the space should represent an html canvas.
  # @return a new Form object
  constructor: ( space ) ->

    # ## a property to reference the space's rendering context
    @cc = space.ctx || {}

    # keep track of dom id names
    @cc.group = null
    @cc.groupID = "ptx"
    @cc.groupCount = 0
    @cc.currentID = "ptx0"

    # default style or false for no fill
    @cc.fillStyle = '#999'
    @cc.strokeStyle = '#666'
    @cc.lineWidth = false
    @cc.lineJoint = false
    @cc.font = "11px sans-serif"

    # ## a property to specify the current font size
    @fontSize = 11

    # ## a property to specify the current font face
    @fontFace = "sans-serif"


  # ## Set current fill style
  # @param `c` fill color which can be as color, gradient, or pattern. (See [canvas documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)) Default is `false` (transparent)
  # @eg `form.fill("#F90")` `form.fill("rgba(0,0,0,.5")` `form.fill(false)`
  # @demo form.fill
  # @return this Form
  fill: (c) ->
    @cc.fillStyle = if c then c else false
    return @


  # ## Set current stroke style
  # @param `c` stroke color which can be as color, gradient, or pattern. (See [canvas documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)) Default is false (transparent)
  # @param `width` Optional value (can be floating point) to set line width
  # @param `joint` Optional string to set line joint style. Can be "miter", "bevel", or "round".
  # @eg `form.stroke("#F90")` `form.stroke("rgba(0,0,0,.5")` `form.stroke(false)` `form.stroke("#000", 0.5, 'round')`
  # @return this Form
  stroke: (c, width, joint) ->
    @cc.strokeStyle = if c then c else false
    if width then @cc.lineWidth = width
    if joint then @cc.lineJoint = joint
    return @


  scope: ( group_id, group=false ) ->
    @cc.groupID = group_id
    @cc.groupCount = 0
    if (group) then @cc.group = group
    @nextID()
    return @cc


  nextID: () ->
    @cc.groupCount++
    @cc.currentID = @cc.groupID+@cc.groupCount
    return @cc.currentID


  @id: (ctx) ->
    return ctx.currentID || "p-"+SVGForm._domId++

  @style: (elem, fill, stroke=false, strokeWidth=false, joint=false) ->
    DOMSpace.attr( elem, {
      style: DOMSpace.css({
        fill: if (fill) then fill else false
        stroke: if (stroke) then stroke else false
        "stroke-width": if (strokeWidth) then strokeWidth else false
        joint: if (joint) then joint else false
      })
    })


  # ## A static function to draw a point
  # @param `ctx` canvas rendering context
  # @param `pt` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  # @param `circle` a boolean value to specify if the points should be drawn as a circle. Default to false.
  @point: (ctx, pt, halfsize=2, fill=true, stroke=false, circle=false ) ->

    elem = SVGSpace.svgElement( ctx.group, (if (circle) then "circle" else "rect"), SVGForm.id(ctx) )
    if (!elem) then return;

    if (circle)
      DOMSpace.attr( elem, {
        cx: pt.x
        cy: pt.y
        r: halfsize
      })
    else
      DOMSpace.attr( elem, {
        x: pt.x - halfsize
        y: pt.y - halfsize
        width: halfsize + halfsize
        height: halfsize + halfsize
      })

    SVGForm.style(elem, fill, stroke)
    return elem


  # ## Draw a point
  # @param `p` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `isCircle` a boolean value to specify if the point should be drawn as a circle. Default is false.
  # @return this Form
  point: (p, halfsize=2, isCircle=false) ->
    @nextID()
    SVGForm.point(@cc, p, halfsize, @cc.fillStyle, @cc.strokeStyle, isCircle )
    return @


  # ## A static function similar to `SVGForm.point()` but draw a series of points
  # @param `ctx` canvas rendering context
  # @param `pts` an array of Points
  # @param `halfsize, fill, stroke, circle` same parameters as in `SVGForm.point()`
  @points: (ctx, pts, halfsize=2, fill=true, stroke=false, circle=false ) ->
    return (SVGForm.point( ctx, p, halfsize, fill, stroke, circle ) for p in pts)


  # ## Draw a series of points
  # @param `ps` an array of Points
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `isCircle` a boolean value to specify if the point should be drawn as a circle. Default is false.
  # @demo form.points
  # @return this Form
  points: (ps, halfsize=2, isCircle=false) ->
    for p in ps
      @point(p, halfsize, isCircle )
    return @


  # ## A static function to draw a line
  # @param `ctx` canvas rendering context
  # @param `pair` a Pair object
  @line: (ctx, pair, stroke) ->
    if !pair.p1 then throw "#{pair.toString()} is not a Pair"
    elem = SVGSpace.svgElement( ctx.group, "line", SVGForm.id(ctx) )

    DOMSpace.attr( elem, {
      x1: pair.x
      y1: pair.y
      x2: pair.p1.x
      y2: pair.p1.y
    })

    SVGForm.style(elem, false, stroke)
    return elem


  # ## Draw a line
  # @param `p` a Pair object
  # @return this Form
  line: (p) ->
    @nextID()
    SVGForm.line( @cc, p, @cc.strokeStyle )
    return @


  # ## A static function to draw a line
  # @param `ctx` canvas rendering context
  # @param `pairs` an array of Pair objects
  @lines: (ctx, pairs) ->
    return ( SVGForm.line( ctx, ln ) for ln in pairs )


  # ## Draw a series of lines
  # @param `ps` an array of Lines
  # @return this Form
  lines: (ps) ->
    for p in ps
      @line(p)
    return @


  # ## A static function to draw a rectangle
  # @param `ctx` canvas rendering context
  # @param `pair` a Pair object
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  @rect: (ctx, pair, fill=true, stroke=false) ->
    if !pair.p1 then throw "#{pair.toString() is not a Pair}"
    elem = SVGSpace.svgElement( ctx.group, "rect", SVGForm.id(ctx) )

    size = pair.size()
    DOMSpace.attr( elem, {
      x: pair.x
      y: pair.y
      width: size.x
      height: size.y
    })

    SVGForm.style(elem, false, stroke)
    return elem


  # ## Draw a rectangle
  # @param `p` a Pair object
  # @return this Form
  rect: (p, checkBounds=true) ->
    @nextID()
    r = if (checkBounds) then p.bounds() else p
    SVGForm.rect( @cc, r, @cc.fillStyle, @cc.strokeStyle )
    return @
