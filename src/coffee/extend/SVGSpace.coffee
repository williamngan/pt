
class SVGSpace extends DOMSpace

  constructor: ( id='pt_space', bgcolor=false, context='svg' ) ->
    super

    # background color rectangle
    @bg = document.createElementNS( "http://www.w3.org/2000/svg", "rect")
    @bg.setAttribute("id", id+"_bg");
    @bg.setAttribute("fill", bgcolor);

    @space.appendChild(@bg)

  # Override DOMSpace function to create the root svg element
  _createSpaceElement: () ->
    @space = document.createElementNS( "http://www.w3.org/2000/svg", "svg")
    @space.setAttribute("id", @id)
    @appended = false


  @svgElement: (parent, name, id) ->

    if (!parent || !parent.appendChild)
      throw( "parent parameter needs to be a DOM node" )

    elem = document.querySelector("#"+id);

    if (!elem)
      elem = document.createElementNS( "http://www.w3.org/2000/svg", name)
      elem.setAttribute("id",id)
      elem.setAttribute("class",id.substring(0, id.indexOf("-")))
      parent.appendChild( elem )

    return elem


  # ## This overrides Space's `resize` function. It's a callback function for window's resize event. Keep track of this with `onSpaceResize(w,h,evt)` callback in your added objects.
  # @return this CanvasSpace
  resize: (w, h, evt) ->

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )

    @space.setAttribute("width", w)
    @space.setAttribute("height", h)

    @bg.setAttribute("width", w)
    @bg.setAttribute("height", h)

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    return @


  # ## Remove an item from this Space
  # @param an object with an auto-assigned `animateID` property
  # @demo svgspace.remove
  # @return this space
  remove : (item) ->
    temp = @space.querySelectorAll( "."+SVGForm._scopeID(item) )

    for t in temp
      t.parentNode.removeChild(t)

    delete @items[ item.animateID ]
    return @


  # ## Remove all items from this Space
  # @return this space
  removeAll: () ->
    while (@space.firstChild)
      @space.removeChild(@space.firstChild)
      return @


# namescape
this.SVGSpace = SVGSpace