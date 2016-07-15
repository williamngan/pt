# ### SVGSpace is an extension of DOMSpace that represents an svg element in DOM. Also refers to DOMSpace for inherited methods.
class SVGSpace extends DOMSpace

  # ## Create a SVGSpace which represents a svg element
  # @param `id` an optional string which refers to the "id" attribute of a DOM element. It can either refer to an existing `<svg>`, or a `<div>` container in which a new `<svg>` will be created. If left empty, a `<div id="pt"><svg id="pt_svg" /></div>` will be added to DOM. Use css to customize its appearance if needed.
  # @param `callback` an optional callback `function(boundingBox, spaceElement)` to be called when element is appended and ready. A "ready" event will also be fired from the space's element when it's appended, which can be tracked with `spaceInstance.space.addEventListener("ready")`
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


  # ## A static helper method to add a svg element inside a node. Usually you don't need to use this directly. See methods in `SVGForm` instead.
  # @param `parent` the parent node element, or `null` to use current `<svg>` as parent.
  # @param `name` a string of element name,  such as `"rect"` or `"circle"`
  # @param `id` id attribute of the new element
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