class SVGForm

  # ## Create a new Form which is based on SVG
  # @param `space` A space that has a valid context for this form. In this case, the space should represent an html canvas.
  # @return a new Form object
  constructor: ( space ) ->

    # ## a property to reference the space's rendering context
    @cc = space.ctx || {}

    # keep track of dom id names
    @cc.group = null
    @cc.groupID = "item"
    @cc.groupCount = 0
    @cc.currentID = "item0"

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

  # ## A static function to draw a point
  # @param `ctx` canvas rendering context
  # @param `pt` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `fill` a boolean value to specify if the points should be filled. Default to true.
  # @param `stroke` a boolean value to specify if the points should be stroked. Default to false.
  # @param `circle` a boolean value to specify if the points should be drawn as a circle. Default to false.
  @point: (ctx, pt, halfsize=2, fill=true, stroke=false, circle=false ) ->

    console.log( ctx.currentID, halfsize );

    elem = space.appendChild( ctx.group, (if (circle) then "circle" else "rect"), ctx.currentID )
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

    DOMSpace.attr( elem, {
      style: DOMSpace.css({
        fill: if (fill) then ctx.fillStyle else false
        stroke: if (stroke) then ctx.strokeStyle else false
      })
    })


  # ## Draw a point
  # @param `p` a Point object
  # @param `halfsize` radius or half size of the point. Default is 2.
  # @param `isCircle` a boolean value to specify if the point should be drawn as a circle. Default is false.
  # @return this Form
  point: (p, halfsize=2, isCircle=false) ->
    SVGForm.point(@cc, p, halfsize, @filled, @stroked, isCircle, @nextID() )
    return @
