# ### CanvasSpace is a space that represents a html canvas. It creates a new canvas or get an existing one in DOM by its `id` attribute. It also provide methods specific to html canvas, such as tracking resize and mouse position.

class CanvasSpace extends Space

  # ## Create a CanvasSpace which represents a HTML Canvas Space
  # @param `id` an id property which refers to the "id" attribute of the canvas element in DOM. If no canvas element with this id is found, a new canvas element will be created.
  # @param `bgcolor` a background color string to specify the canvas background. Default is `false` which shows a transparent background.
  # @param `context` a string of canvas context type, such as "2d" or "webgl". Default is "2d"
  constructor : ( id='pt_space', bgcolor=false, context='2d' ) ->
    super

    # ## A property to store canvas DOM element
    @space = document.querySelector("#"+@id)

    @bound = null
    @boundRect = {top: 0, left: 0, width: 0, height: 0}

    # ## A boolean property to track if the canvas element is added to dom or not
    @appended = true

    # either get existing one in the DOM or create a new one
    if !@space
      @space = document.createElement("canvas")
      @space.setAttribute("id", @id)
      @appended = false

    # Track mouse dragging
    @_mdown = false
    @_mdrag = false

    # A property to store canvas background color
    @bgcolor = bgcolor

    # A property to store canvas rendering contenxt
    @ctx = @space.getContext( context )


  # ## Place a new canvas element into a container dom element. When canvas is ready, a "ready" event will be fired. Track this event with `space.canvas.addEventListener("ready")`
  # @param `parent_id` the DOM element into which the canvas element should be appended
  # @param `readyCallback` a callback function with parameters `width`, `height`, and `canvas_element`, which will get called when canvas is appended and ready.
  # @return this CanvasSpace
  display: ( parent_id="#pt", readyCallback ) ->
    if not @appended

      # @bound
      @bound = document.querySelector(parent_id)
      @boundRect = @bound.getBoundingClientRect()

      if @bound
        # resize to fit bound
        @resize( @boundRect.width, @boundRect.height )
        @autoResize(true)

        # add to parent dom if not existing
        if @space.parentNode != @bound
          @bound.appendChild( @space )

        @appended = true

        # fire ready event
        setTimeout( (
            () ->
              @space.dispatchEvent( new Event('ready') )
              if readyCallback
                readyCallback( @boundRect.width, @boundRect.height,  @space )

          ).bind(@)
        )


      else
        throw 'Cannot add canvas to element '+parent_id

    return this


  # window resize handler
  _resizeHandler: (evt) =>
    @boundRect = @bound.getBoundingClientRect()
    @resize( @boundRect.width, @boundRect.height, evt )


  # ## Set whether the canvas element should resize when its container is resized. Default will auto size
  # @param `auto` a boolean value indicating if auto size is set. Default is `true`.
  # @return this CanvasSpace
  autoResize: (auto=true) ->
    # listen/unlisten for window resize event and callback
    if (auto)
      window.addEventListener( 'resize', @_resizeHandler )
    else
      window.removeEventListener( 'resize', @_resizeHandler )

    return @

  # ## This overrides Space's `resize` function. It's a callback function for window's resize event. Keep track of this with `onSpaceResize(w,h,evt)` callback in your added objects.
  # @demo canvasspace.resize
  # @return this CanvasSpace
  resize: (w, h, evt) ->

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )
    @boundRect.width = Math.floor(w)
    @boundRect.height = Math.floor(h)
    @space.setAttribute( 'width', Math.floor(w) )
    @space.setAttribute( 'height', Math.floor(h) )

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    # repaint canvas
    @render( @ctx )

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


# namescape
this.CanvasSpace = CanvasSpace