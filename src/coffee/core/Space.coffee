# ### Fishes forget their rivers and lakes, said Chuang Tzu. Spaces or contexts give meanings to ideas and lives, but are often overlooked. In Pt, space represents an abstract context in which a point can be made visible in one form or another, and can be specified as an html canvas, a soundscape, or a graffiti robot on a wall. Space is where a concept meets its expression.

class Space

  # ## Create a Space which is the context for displaying and animating elements. Extend this to create specific Spaces, for example, a space for HTML Canvas or SVG.
  # @param `id` an id property to identify this space
  constructor : ( id='space' ) ->

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



# namespace
this.Space = Space

