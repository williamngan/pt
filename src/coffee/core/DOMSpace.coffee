# ### DOMSpace is a space that represents a html dom. It is similar to CanvasSpace but usually used as a space for SVG or HTML.

class DOMSpace extends Space

  # ## Create a DOMSpace which represents a HTML DOM
  # @param `id` an id property which refers to the "id" attribute of the element in DOM.
  # @param `callback` an optional callback `function(boundingBox, spaceElement)` to be called when element is appended and ready. A "ready" event will also be fired from the space's element when it's appended, which can be tracked with `spaceInstance.space.addEventListener("ready")`
  # @param `spaceElement` a string of space's dom element name, such as `"div"` or `"svg"` or . Default is `"div"`
  constructor: ( id, callback, spaceElement="div" ) ->
    if (!id) then id = 'pt'
    super( id )

    @id = if (@id[0] == "#") then @id.substr(1) else @id

    # ## A property to store the DOM element
    @space = null
    @bound = null
    @boundRect = {top: 0, left: 0, width: 0, height: 0}

    @css = {};

    _selector = document.querySelector("#"+@id)

    # if selector is not defined, create the spaceElement element
    if !_selector
      @space = @_createElement(spaceElement, @id)
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

    # A property to store background color
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


  # ## `display(...)` is deprecated as of 0.2.0. You can now set the DOM element directly in the constructor, and customize it using `setup()`.
  display: () ->
    console.warn( "space.display(...) function is deprecated as of version 0.2.0. You can now set the DOM element in the constructor. Please see the release note for details." )
    return @

  # ## Set up various options for DOMSpace. The `opt` parameter is an object with the following fields. This is usually set during instantiation, eg `new DOMSpace(...).setup( { opt } )`
  # @param `opt.bgcolor` a hex or rgba string to set initial background color of the element
  # @param `opt.resize` a boolean to set whether th element's size should auto resize to match its container's size. You can also set it manually with `autoSize()`
  # @return this DOMSpace
  setup: ( opt ) ->

    # background color
    if opt.bgcolor then @bgcolor = opt.bgcolor

    # auto resize element to fit its container
    @_autoResize = if (opt.resize != false) then true else false

    return @


  # window resize handler
  _resizeHandler: (evt) =>

    @boundRect = @bound.getBoundingClientRect()
    @resize( @boundRect.width, @boundRect.height, evt )



  # ## This overrides Space's `resize` function. It's a callback function for window's resize event when `autoResize` is true. Keep track of this with `onSpaceResize(w,h,evt)` callback in your added objects.
  # @return this DOMSpace
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