# ### (In progress) A simple handle that can be dragged by mouse
class UI extends Rectangle

  # class variable tracks if a handle has been dragged (to avoid dragging multiple handles at once)
  @dragTarget: null

  constructor: () ->
    super
    @dragging = false

  animate : (time, frame, ctx) ->
    ctx.fillStyle = '#f00'
    Form.rect( ctx, this )

  onMouseAction: (type, x, y, evt) ->
    if @intersectPoint( x, y )
      if type == 'drag' and !UI.dragTarget
        @dragging = true
        UI.dragTarget = this

    if @dragging and type == 'move'
      @moveTo(x,y).moveBy( @size().multiply(-0.5) ) # move and anchor by center point

    if type == 'drop'
      @dragging = false
      UI.dragTarget = null


# namespace
this.UI = UI