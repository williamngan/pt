# ### DOMSpace is a space that represents a html dom. It is similar to `CanvasSpace` but usually used as a space for SVG or HTML.

class DOMSpace extends Space

  # ## Create a DOMSpace which represents a HTML DOM
  # @param `id` an id property which refers to the "id" attribute of the element in DOM.
  # @param `bgcolor` a background color string to specify the background. Default is `false` which shows a transparent background.
  # @param `context` a string of dom context type, such as "html" or "svg". Default is "html"
  constructor: ( id, callback, container="div" ) ->
    if (!id) then id = 'pt'
    super( id )

    @id = if (@id[0] == "#") then @id.substr(1) else @id

    # ## A property to store the DOM element
    @space = null
    @bound = null
    @boundRect = {top: 0, left: 0, width: 0, height: 0}

    @css = {};

    _selector = document.querySelector("#"+@id)

    # if selector is not defined, create the container element
    if !_selector
      @space = @_createElement(container, @id)
      document.body.appendChild( @space )
      @bound = @space.parentElement

    # if selector is an existing element
    else
      @space = _selector
      @bound = @space.parentElement

    # Track mouse dragging
    @_mdown = false
    @_mdrag = false

    # no mutation observer, so we set a timeout for ready event
    setTimeout( @_ready.bind(@, callback), 50 )

    # A property to store canvas background color
    @bgcolor = false

    # A property to store rendering contenxt
    @ctx = {}


  # A private function to create the dom element. This will create a <div> if elem parameter is not set.
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

      if @bgcolor
        @setCSS( "backgroundColor", @bgcolor )


      @updateCSS()

      @space.dispatchEvent( new Event('ready') )
  
      if (callback) then callback( @boundRect, @space )
  
    else
      throw "Cannot initiate #"+@id+" element"
    

  setCSS: ( key, val, isPx=false) ->
    @css[key] = (if isPx then "#{val}px" else val)
    return this


  updateCSS: () ->
    for k,v of @css
      @space.style[k] = v


  # ## `display(...)` function is deprecated as of 0.2.0. You can now set the canvas element directly in the constructor, and customize it using `setup()`.
  display: () ->
    console.warn( "space.display(...) function is deprecated as of version 0.2.0. You can now set the canvas element in the constructor. Please see the release note for details." )

  # ## Set up various options for CanvasSpace. The `opt` parameter is an object with the following fields. This is usually used during instantiation, eg `new CanvasSpace(...).setup( { opt } )`
  # @param `opt.bgcolor` a hex or rgba string initial background color of the canvas
  # @param `opt.resize` a boolean to set whether `<canvas>` size should auto resize to match its container's size
  # @return this DOMSpace
  setup: ( opt ) ->

    # background color
    if opt.bgcolor then @bgcolor = opt.bgcolor

    # auto resize canvas to fit its container
    @_autoResize = if (opt.resize != false) then true else false

    return @


  # window resize handler
  _resizeHandler: (evt) =>

    @boundRect = @bound.getBoundingClientRect()
    @resize( @boundRect.width, @boundRect.height, evt )



  # ## This overrides Space's `resize` function. It's a callback function for window's resize event when `autoResize` is true. Keep track of this with `onSpaceResize(w,h,evt)` callback in your added objects.
  # @demo canvasspace.resize
  # @return this CanvasSpace
  resize: (w, h, evt) ->

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    return @


  # ## Set whether the svg element should resize when its container is resized.
  # @param `auto` a boolean value indicating if auto size is set. Default is `true`.
  # @return this CanvasSpace
  autoResize: (auto=true) ->

    # listen/unlisten for window resize event and callback
    if (auto)
      @css['width'] = '100%'
      @css['height'] = '100%'
      window.addEventListener( 'resize', @_resizeHandler )
    else
      delete @css['width']
      delete @css['height']
      window.removeEventListener( 'resize', @_resizeHandler )

    return @


  # ## Clear the space. This removes all the child nodes inside `space`
  clear: () ->
    @space.innerHML = ""


  # ## Overrides Space's `animate` function
  # @param `time` current time
  # @return this CanvasSpace
  animate : (time) ->

    # animate all players
    for k, v of @items
      v.animate( time, @_timeDiff, @ctx )

    # stop if time ended
    if @_timeEnd >= 0 and time > @_timeEnd
      cancelAnimationFrame( @_animID )

    return @


  @attr: (elem, data) ->
    for k, v of data
      elem.setAttribute( k, v );


  @css: (data) ->
    str = ""
    for k, v of data
      if (v) then str += "#{k}: #{v}; "
    return str;


# namescape
this.DOMSpace = DOMSpace