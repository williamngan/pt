# ### CanvasSpace is a space that represents a html canvas. It creates a new canvas or get an existing one in DOM by its `id` attribute. It also provide methods specific to html canvas, such as tracking resize and mouse position.

class CanvasSpace extends Space

  # ## Create a CanvasSpace which represents a HTML Canvas Space
  # @param `id` an id property which refers to the "id" attribute of the canvas element in DOM. If no canvas element with this id is found, a new canvas element will be created.
  # @param `context` a string of canvas context type, such as "2d" or "webgl". Default is "2d"
  # @param `bgcolor` a background color string to specify the canvas background. Default is `false` which shows a transparent background.
  constructor : ( id='pt_space', bgcolor=false, context='2d' ) ->
    super

    # ## A property to store canvas DOM element
    @canvas = document.querySelector("#"+@id)

    # ## A boolean property to track if the canvas element is added to dom or not
    @appended = true

    # either get existing one in the DOM or create a new one
    if !@canvas
      @canvas = document.createElement("canvas")
      @canvas.setAttribute("id", @id)
      @appended = false

    # Track mouse dragging
    @_mdown = false
    @_mdrag = false

    # A property to store canvas background color
    @bgcolor = bgcolor

    # A property to store canvas rendering contenxt
    @ctx = @canvas.getContext( context )


  # ## Place a new canvas element to a page dom element. When canvas is ready, a "ready" event will be fired. Track this event with `space.canvas.addEventListener("ready")`
  # @param `parent_id` the DOM element into which the canvas element should be appended
  # @param `readyCallback` a callback function with parameters `width`, `height`, and `canvas_element`, which will get called when canvas is appended and ready.
  # @return this CanvasSpace
  display: ( parent_id="#pt", readyCallback ) ->
    if not @appended

      # frame
      frame = document.querySelector(parent_id)
      frame_rect = frame.getBoundingClientRect()

      if frame
        # resize to fit frame
        @resize( frame_rect.width, frame_rect.height )

        # resize event callback
        window.addEventListener( 'resize',
          ((evt) ->
            frame_rect = frame.getBoundingClientRect()
            @resize( frame_rect.width, frame_rect.height, evt ) ).bind(this)
        )

        # add to parent dom if not existing
        if @canvas.parentNode != frame
          frame.appendChild( @canvas )

        @appended = true

        # fire ready event
        setTimeout( (
            () ->
              @canvas.dispatchEvent( new Event('ready') )
              if readyCallback
                readyCallback( frame_rect.width, frame_rect.height,  @canvas )

          ).bind(@)
        )


      else
        throw 'Cannot add canvas to element '+parent_id

    return this


  # ## This overrides Space's `resize` function and it's a callback function for window resize event. The resize event is passed to the Space's added items that has defined a `onSpaceResize(w,h,evt)`
  # @demo canvasspace.resize
  # @return this CanvasSpace
  resize: (w, h, evt) ->

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )
    @canvas.setAttribute( 'width', Math.floor(w) )
    @canvas.setAttribute( 'height', Math.floor(h) )

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    # repaint canvas
    @renderer( @ctx )

    return @


  # ## Clear the canvas with its background color. Overrides Space's `clear` function.
  # @param `bg` Optionally specify a custom background color. If evaluated to false, it will use its `bgcolor` property as background color.
  # @return this CanvasSpace
  clear: ( bg ) ->

    if bg then @bgcolor = bg

    lastColor = @ctx.fillStyle

    if @bgcolor
      @ctx.fillStyle = @bgcolor;
      @ctx.fillRect( 0, 0, @size.x, @size.y )
    else
      @ctx.clearRect( 0, 0, @size.x, @size.y )

    @ctx.fillStyle = lastColor

    return @



  # ## Overrides Space's `animate` function for canvas
  # @param `time` current time
  # @return this CanvasSpace
  animate : (time) ->


    @ctx.save()

    if @_refresh then @clear()

    # animate all players
    for k, v of @items
      v.animate( time, @_timeDiff, @ctx )

    # stop if time ended
    if @_timeEnd >= 0 and time > @_timeEnd
      cancelAnimationFrame( @_animID )

    @ctx.restore()

    return @


  # ## Bind event listener in canvas element, for events such as mouse events
  # @param `evt` Event object
  # @param `callback` a callback function for this event
  bindCanvas: ( evt, callback ) ->
    @canvas.addEventListener( evt, callback )


  # ## A convenient method to bind (or unbind) all mouse events in canvas element. All item added to `items` property that implements an `onMouseAction` callback will receive mouse event callbacks. The types of mouse actions are: "up", "down", "move", "drag", "drop", "over", and "out".
  # @param `bind` a boolean value to bind mouse events if set to `true`. If `false`, all mouse events will be unbound. Default is true.
  # @demo canvasspace.bindMouse
  bindMouse: ( _bind=true ) ->
    if _bind
      @canvas.addEventListener( "mousedown", @_mouseDown.bind(@) )
      @canvas.addEventListener( "mouseup", @_mouseUp.bind(@) )
      @canvas.addEventListener( "mouseover", @_mouseOver.bind(@) )
      @canvas.addEventListener( "mouseout", @_mouseOut.bind(@) )
      @canvas.addEventListener( "mousemove", @_mouseMove.bind(@) )
    else
      @canvas.removeEventListener( "mousedown", @_mouseDown.bind(@) )
      @canvas.removeEventListener( "mouseup", @_mouseUp.bind(@) )
      @canvas.removeEventListener( "mouseover", @_mouseOver.bind(@) )
      @canvas.removeEventListener( "mouseout", @_mouseOut.bind(@) )
      @canvas.removeEventListener( "mousemove", @_mouseMove.bind(@) )

    

  # go through all item in `items` and call its onMouseAction callback function
  _mouseAction: (type, evt) ->
    for k, v of @items
      if v.onMouseAction? then v.onMouseAction( type, evt.offsetX, evt.offsetY, evt )


  # mouse down action
  _mouseDown: (evt) ->
    @_mouseAction( "down", evt )
    @_mdown = true


  # mouse up action
  _mouseUp: (evt) ->
    @_mouseAction( "up", evt )
    if @_mdrag then @_mouseAction( "drop", evt )
    @_mdown = false
    @_mdrag = false


  # mouse move action
  _mouseMove: (evt) ->
    @_mouseAction( "move", evt )
    if @_mdown
      @_mdrag = true
      @_mouseAction( "drag", evt )


  # mouse over action
  _mouseOver: (evt) ->
    @_mouseAction( "over", evt )


  # mouse out action
  _mouseOut: (evt) ->
    @_mouseAction( "out", evt )
    if @_mdrag then @_mouseAction( "drop", evt )
    @_mdrag = false


# namescape
this.CanvasSpace = CanvasSpace