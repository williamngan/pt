# ### Fishes forget their rivers and lakes, said Chuang Tzu. Spaces or contexts give meanings to ideas and lives, but are often overlooked. In Pt, space represents an abstract context in which a point can be made visible in one form or another, and can be specified as an html canvas, a soundscape, or a graffiti robot on a wall. Space is where a concept meets its expression.

class Space

  # ## Create a Space which is the context for displaying and animating elements. Extend this to create specific Spaces, for example, a space for HTML Canvas or SVG.
  # @param `id` an id property to identify this space
  constructor : ( id ) ->

    if typeof id != 'string' or id.length == 0
      throw "id parameter is not valid"
      return false

    # ## A property to identify this space by name
    @id = id

    # ## A property to indicate the size of this space as a Vector
    @size = new Vector()

    # ## A property to indicate the center of this space as a Vector
    @center = new Vector()

    # animation properties
    @_timePrev = 0 # record prev time
    @_timeDiff = 0 # record prev time difference
    @_timeEnd = -1 # end in milliseconds, -1 to play forever, 0 to end immediately

    # ## A set of items in this space. An item should implement a function `animate()` and optionally another callback `onSpaceResize(w,h,evt)`, and will be assigned a property `animateID` automatically. (See `add()`)
    @items = {}

    # item properties
    @_animID = -1
    @_animCount = 0 # player key as increment
    @_animPause = false
    @_refresh = true # refresh on each frame


  # ## set whether the rendering should be repainted on each frame
  # @param `b` a boolean value to set whether to repaint each frame
  # @demo space.refresh
  # @return this space
  refresh: (b) ->
    @_refresh = b
    return @


  # ## set custom render function (on resize and other events)
  # @return this space
  render: ( context ) ->
    return @


  # ## resize the space. (not implemented)
  resize: (w, h) ->


  # ## clear all contents in the space (not implemented)
  clear: () ->


  # ## Add an item to this space. An item must define a callback function `animate( time, fps, context )` and will be assigned a property `animateID` automatically. An item can also optionally define a callback function `onSpaceResize( w, h, evt )`. Subclasses of Space may define other callback functions.
  # @param an object with an `animate( time, fps, context )` function, and optionall a `onSpaceResize( w, h, evt )` function
  # @demo space.add
  # @return this space
  add : (item) ->
    if item.animate? and typeof item.animate is 'function'
      k = @_animCount++
      @items[k] = item
      item.animateID = k

      # if player has onSpaceResize defined, call the function
      if item.onSpaceResize? then item.onSpaceResize(@size.x, @size.y)
    else
      throw "a player object for Space.add must define animate()"

    return @


  # ## Remove an item from this Space
  # @param an object with an auto-assigned `animateID` property
  # @return this space
  remove : (item) ->
    delete @items[ item.animateID ]
    return @


  # ## Remove all items from this Space
  # @return this space
  removeAll : () ->
    @items = {}
    return @


  # ## Main play loop. This implements window.requestAnimationFrame and calls it recursively. Override this `play()` function to implemenet your own animation loop.
  # @param `time` current time
  # @return this space
  play : (time=0) ->

    # use fat arrow here, because rAF callback will change @ to window
    @_animID = requestAnimationFrame( (t) => @play(t) )

    # if pause
    if @_animPause then return

    # calc time passed since prev frame
    @_timeDiff = time - @_timePrev

    # animate this frame
    try
      @_playItems( time )
    catch err
      cancelAnimationFrame( @_animID )
      console.error( err.stack )
      throw err


    # store time
    @_timePrev = time

    return @


  # Main animate function. This calls all the items to perform
  # @param `time` current time
  # @return this space
  _playItems : (time) ->

    # clear before draw if refresh is true
    if @_refresh then @clear()

    # animate all players
    for k, v of @items
      v.animate( time, @_timeDiff, @ctx )

    # stop if time ended
    if @_timeEnd >= 0 and time > @_timeEnd
      cancelAnimationFrame( @_animID )

    return @


  # ## Pause the animation
  # @param `toggle` a boolean value to set if this function call should be a toggle (between pause and resume)
  # @return this space
  pause: ( toggle=false) ->
    @_animPause = if toggle then !@_animPause else true
    return @


  # ## Resume the paused animation
  # @return this space
  resume: () ->
    @_animPause = false
    return @


  # ## Specify when the animation should stop: immediately, after a time period, or never stops.
  # @param `t` a value in millisecond to specify a time period to play before stopping, or `-1` to play forever, or `0` to end immediately. Default is 0 which will stop the animation immediately.
  # @return this space
  stop : ( t=0 ) ->
    @_timeEnd = t
    return @


  # ## Play animation loop, and then stop after `duration` time has passed.
  # @param `duration` a value in millisecond to specify a time period to play before stopping, or `-1` to play forever
  playTime: (duration=5000) ->
    @play()
    @stop( duration )



  # ## Bind event listener in canvas element, for events such as mouse events
  # @param `evt` Event object
  # @param `callback` a callback function for this event
  bindCanvas: ( evt, callback ) ->
    if @space.addEventListener then @space.addEventListener( evt, callback )


  # ## A convenient method to bind (or unbind) all mouse events in canvas element. All item added to `items` property that implements an `onMouseAction` callback will receive mouse event callbacks. The types of mouse actions are: "up", "down", "move", "drag", "drop", "over", and "out".
  # @param `bind` a boolean value to bind mouse events if set to `true`. If `false`, all mouse events will be unbound. Default is true.
  # @demo canvasspace.bindMouse
  bindMouse: ( _bind=true ) ->
    if @space.addEventListener and @space.removeEventListener
      if _bind
        @space.addEventListener( "mousedown", @_mouseDown.bind(@) )
        @space.addEventListener( "mouseup", @_mouseUp.bind(@) )
        @space.addEventListener( "mouseover", @_mouseOver.bind(@) )
        @space.addEventListener( "mouseout", @_mouseOut.bind(@) )
        @space.addEventListener( "mousemove", @_mouseMove.bind(@) )
      else
        @space.removeEventListener( "mousedown", @_mouseDown.bind(@) )
        @space.removeEventListener( "mouseup", @_mouseUp.bind(@) )
        @space.removeEventListener( "mouseover", @_mouseOver.bind(@) )
        @space.removeEventListener( "mouseout", @_mouseOut.bind(@) )
        @space.removeEventListener( "mousemove", @_mouseMove.bind(@) )


  # ## A convenient method to bind (or unbind) all mobile touch events in canvas element. All item added to `items` property that implements an `onTouchAction` callback will receive touch event callbacks. The types of touch actions are the same as the mouse actions: "up", "down", "move", and "out".
  # @param `bind` a boolean value to bind touch events if set to `true`. If `false`, all touch events will be unbound. Default is true.
  bindTouch: ( _bind=true ) ->
    if @space.addEventListener and @space.removeEventListener
      if _bind
        @space.addEventListener( "touchstart", @_mouseDown.bind(@) )
        @space.addEventListener( "touchend", @_mouseUp.bind(@) )
        @space.addEventListener( "touchmove",
          ((evt) =>
            evt.preventDefault();
            @_mouseMove(evt)
          ) )
        @space.addEventListener( "touchcancel", @_mouseOut.bind(@) )
      else
        @space.removeEventListener( "touchstart", @_mouseDown.bind(@) )
        @space.removeEventListener( "touchend", @_mouseUp.bind(@) )
        @space.removeEventListener( "touchmove", @_mouseMove.bind(@) )
        @space.removeEventListener( "touchcancel", @_mouseOut.bind(@) )


  # ## A convenient method to convert the touch points in a touch event to an array of `Vectors`.
  # @param evt a touch event which contains touches, changedTouches, and targetTouches list.
  # @param which a string to select a touches list: "touches", "changedTouches", or "targetTouches". Default is "touches"
  # @return an array of Vectors, whose origin position (0,0) is offset to the top-left of this space.
  touchesToPoints: ( evt, which="touches" ) ->
    if (!evt or !evt[which]) then return []
    return ( new Vector(t.pageX - this.boundRect.left, t.pageY - this.boundRect.top) for t in evt[which] )


  # go through all item in `items` and call its onMouseAction callback function
  _mouseAction: (type, evt) ->
    if (evt.touches || evt.changedTouches)
      for k, v of @items
        if v.onTouchAction?
          _c = evt.changedTouches and evt.changedTouches.length > 0
          px = if (_c) then evt.changedTouches.item(0).pageX else 0;
          py = if (_c) then evt.changedTouches.item(0).pageY else 0;
          v.onTouchAction( type, px, py, evt )
    else
      for k, v of @items
        if v.onMouseAction?
          px = evt.offsetX || evt.layerX;
          py = evt.offsetY || evt.layerY;
          v.onMouseAction( type, px, py, evt )


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


# namespace
this.Space = Space

