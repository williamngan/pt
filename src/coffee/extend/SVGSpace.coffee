# ### SVGSpace is an extension of `DOMSpace` that represents an svg element in DOM.

class SVGSpace extends DOMSpace

  # ## Create a DOMSpace which represents a HTML DOM
  # @param `id` an id property which refers to the "id" attribute of the element in DOM.
  # @param `callback` an optional callback function with parameters `function (boundingBox, spaceElement)` which will get called when svg is appended and ready. A "ready" event will also be fired from the space's element when it's appended, which you may track with `instance.space.addEventListener("ready")`
  constructor: ( id, callback ) ->
    super( id, callback, 'svg')

    if @space.nodeName.toLowerCase() != "svg"
      s = @_createElement("svg", @id+"_svg" )
      @space.appendChild( s )
      @bound = @space
      @space = s

      # size is known so set it immediately
      b = @bound.getBoundingClientRect()
      @resize( b.width, b.height )



  # A private function to create the svg namespaced element. This will create a <svg> if elem parameter is not set.
  _createElement: ( elem="svg", id ) ->
    d = document.createElementNS( "http://www.w3.org/2000/svg", elem )
    if (id) then d.setAttribute("id", id )
    return d



  @svgElement: (parent, name, id) ->

    if (!parent || !parent.appendChild)
      parent = @space
      if !parent then throw( "parent parameter needs to be a DOM node" )

    elem = document.querySelector("#"+id);

    if (!elem)
      elem = document.createElementNS( "http://www.w3.org/2000/svg", name)
      elem.setAttribute("id",id)
      elem.setAttribute("class",id.substring(0, id.indexOf("-")))
      parent.appendChild( elem )

    return elem


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