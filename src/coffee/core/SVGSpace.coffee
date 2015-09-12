
class SVGSpace extends DOMSpace

  constructor: ( id='pt_space', bgcolor=false, context='svg' ) ->
    super



  # A private function to create the canvas element. By default this will create a <div>. Override to create a different element.
  _createSpaceElement: () ->
    @space = document.createElementNS( "http://www.w3.org/2000/svg", "svg")
    @space.setAttribute("id", @id)
    @appended = false



  appendChild: (parent, name, id) ->
    if (!@appended) then return false

    @elem = document.querySelector("#"+id);

    if (!@elem)
      @elem = document.createElementNS( "http://www.w3.org/2000/svg", name)
      @elem.setAttribute("id",id)
      parent.appendChild( @elem )

    return @elem


  # ## This overrides Space's `resize` function. It's a callback function for window's resize event. Keep track of this with `onSpaceResize(w,h,evt)` callback in your added objects.
  # @demo canvasspace.resize
  # @return this CanvasSpace
  resize: (w, h, evt) ->

    @size.set(w, h)
    @center = new Vector( w/2, h/2 )

    @space.setAttribute("width", w)
    @space.setAttribute("height", h)

    # player resize callback
    for k, p of @items
      if p.onSpaceResize? then p.onSpaceResize(w, h, evt)

    return @




# namescape
this.SVGSpace = SVGSpace