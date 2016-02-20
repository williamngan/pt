# ### DOMSpace is a space that represents a html dom. It is similar to `CanvasSpace` but usually used as a space for SVG or HTML.

class DOMSpace extends Space

  # ## Create a DOMSpace which represents a HTML DOM
  # @param `id` an id property which refers to the "id" attribute of the element in DOM.
  # @param `bgcolor` a background color string to specify the background. Default is `false` which shows a transparent background.
  # @param `context` a string of dom context type, such as "html" or "svg". Default is "html"
  constructor: ( id='pt_space', bgcolor=false, context='html' ) ->
    super

    # ## A property to store the DOM element
    @space = document.querySelector("#"+@id)
    @css = {width: "100%", height: "100%"};

    @bound = null
    @boundRect = {top: 0, left: 0, width: 0, height: 0}

    # ## A boolean property to track if the element is added to container or not
    @appended = true

    # either get existing one in the DOM or create a new one
    if !@space then @_createSpaceElement()

    # Track mouse dragging
    @_mdown = false
    @_mdrag = false

    # A property to store canvas background color
    @bgcolor = bgcolor

    # A property to store rendering contenxt
    @ctx = {}


  # A private function to create the canvas element. By default this will create a <div>. Override to create a different element.
  _createSpaceElement: () ->
    @space = document.createElement("div")
    @space.setAttribute("id", @id)
    @appended = false


  setCSS: ( key, val, isPx=false) ->
    @css[key] = (if isPx then "#{val}px" else val)
    return this


  updateCSS: () ->
    for k,v of @css
      @space.style[k] = v


  # ## Place a new canvas element into a container dom element. When canvas is ready, a "ready" event will be fired. Track this event with `space.canvas.addEventListener("ready")`
  # @param `parent_id` the DOM element into which the canvas element should be appended
  # @param `readyCallback` a callback function with parameters `width`, `height`, and `canvas_element`, which will get called when canvas is appended and ready.
  # @return this CanvasSpace
  display: ( parent_id="#pt", readyCallback ) ->
    if not @appended

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

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    return @


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