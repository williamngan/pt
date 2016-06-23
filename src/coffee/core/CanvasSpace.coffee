# ### CanvasSpace is a space that represents a html canvas. It creates a new canvas or get an existing one in DOM by its `id` attribute. It also provide methods specific to html canvas, such as tracking resize and mouse position.

class CanvasSpace extends Space

  # ## Create a CanvasSpace which represents a HTML Canvas Space
  # @param `id` an optional string which refers to the "id" attribute of either a `<div>` container in which a `<canvas>` will be created within, or an existing `<canvas>` itself. If not defined, a `<div id="pt_container"><canvas id="pt" /></div>` will be added to DOM.
  # @param `callback` an optional callback function with parameters `function (bounds, space)` which will get called when canvas is appended and ready. A "ready" event will also be fired from the `<canvas>` element when it's appended, which you may track with `instance.space.addEventListener("ready")`
  constructor : ( id, callback ) ->
    if (!id) then id = 'pt'
    super( id )

    @id = if (@id[0] == "#") then @id.substr(1) else @id

    console.log( @id);

    # ## A property to store canvas DOM element
    @space = null
    @bound = null
    @boundRect = {top: 0, left: 0, width: 0, height: 0}

    @pixelScale = 1
    @_autoResize = true

    _selector = document.querySelector("#"+@id)
    _existed = true

    # if selector is not defined, create a canvas
    if !_selector
      @bound = @_createElement( "div", @id+"_container" )
      @space = @_createElement("canvas", @id)
      @bound.appendChild( @space )
      document.body.appendChild( @bound )
      _existed = false

    # if selector is not canvas, create a canvas inside it
    else if _selector.nodeName.toLowerCase() != "canvas"
      @bound = _selector
      @space = @_createElement("canvas", @id+"_canvas" )
      @bound.appendChild( @space )

    # if selector is an existing canvas
    else
      @space = _selector
      @bound = @space.parentElement

    # size is known so set it immediately
    if _existed
      b = @bound.getBoundingClientRect()
      @resize( b.width, b.height )

    # Track mouse dragging
    @_mdown = false
    @_mdrag = false

    # no mutation observer, so we set a timeout for ready event
    setTimeout( @_ready.bind(@, callback), 50 )

    # A property to store canvas background color
    @bgcolor = "#F3F7FA"

    # A property to store canvas rendering contenxt
    @ctx = @space.getContext( '2d' )




  # A private function to create the canvas element. This will create a <div> if elem parameter is not set.
  _createElement: ( elem="div", id ) ->
    d = document.createElement( elem )
    d.setAttribute("id", id )
    return d


  # A private function to handle callbacks after DOM element is mounted
  _ready: ( callback ) ->

    if @bound
      # measurement of the bounds and resize to fit
      @boundRect = @bound.getBoundingClientRect()
      @resize( @boundRect.width, @boundRect.height )
      @autoResize( @_autoResize )

      if @bgcolor then @clear( @bgcolor )
      @space.dispatchEvent( new Event('ready') )

      if (callback) then callback( @boundRect, @space )

    else
      throw "Cannot initiate #"+@id+" element"


  # ## `display(...)` function is deprecated as of 0.2.0. You can now set the canvas element directly in the constructor, and customize it using `setup()`.
  display: () ->
    console.warn( "space.display(...) function is deprecated as of version 0.2.0. You can now set the canvas element in the constructor. Please see the release note for details." )


  # ## Set up various options for CanvasSpace. The `opt` parameter is an object with the following fields. This is usually used during instantiation, eg `new CanvasSpace(...).setup( { opt } )`
  # @param `opt.bgcolor` a hex or rgba string initial background color of the canvas
  # @param `opt.resize` a boolean to set whether `<canvas>` size should auto resize to match its container's size
  # @param `opt.retina` a boolean to set if device pixel scaling should be checked. This may make drawings on retina displays look sharper but may reduce performance slightly. Default is `true`.
  # @return this CanvasSpace
  setup: ( opt ) ->

    # graphics context
    # if opt.context then @ctx = @space.getContext( opt.context )

    # background color
    if opt.bgcolor then @bgcolor = opt.bgcolor;

    # auto resize canvas to fit its container
    @_autoResize = if (opt.resize != false) then true else false

    # check for retina pixel ratio
    @pixelScale = 1
    if (opt.retina != false)
      r1 = window.devicePixelRatio or 1
      r2 = @ctx.webkitBackingStorePixelRatio or @ctx.mozBackingStorePixelRatio or @ctx.msBackingStorePixelRatio or @ctx.oBackingStorePixelRatio or @ctx.backingStorePixelRatio || 1;
      @pixelScale = r1/r2

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

    w = Math.floor(w)
    h = Math.floor(h)

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )
    @boundRect.width = w
    @boundRect.height = h

    # if retina, resize the canvas size and rescale
    @space.width = w * @pixelScale
    @space.height = h * @pixelScale
    @space.style.width = w + "px"
    @space.style.height = h + "px"

    if (@pixelScale != 1)
      @ctx.scale( @pixelScale, @pixelScale )


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