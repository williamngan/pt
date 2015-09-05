class Docs

  constructor: (template_id ) ->

    @flatTree = []
    @json = {}
    @elems = {}
    @sortedElems = []
    @tree = {}

    @resizeTimeout = -1
    @scrollTimeout = -1
    @uiTimerID = -1

    @coverDemoTimeout = -1;
    @coverDemoLoaded = false;
    @isDocReady = false;

    @activeDemo = {
      elem: null
      script: null
      path: "demo/"
    }

    # handle scrolling
    @dom = {
      frame: document.querySelector("body")
      cover: document.querySelector("#cover")
      head: document.querySelector("#head")
      overview: document.querySelector("#overview")
      page: document.querySelector("#page")
      menu: document.querySelector("#menu")
      submenu: document.querySelector("#submenu")
      content: document.querySelector("#content")
      demo: document.querySelector("#pt")
      mobileMenu: document.querySelector("#mobile")

      template: _.template( document.querySelector(template_id).innerHTML )
    }

    @layout = {
      sticky: [{name: "step1", y: 1500, passed: false}]
    }

    @inited = false

    window.addEventListener("scroll", @onScroll.bind(@), false )
    window.addEventListener("touchmove", @onScroll.bind(@), false )

    window.addEventListener("resize", (
      (evt) ->
        clearTimeout( @resizeTimeout )
        setTimeout( (() => @resize(evt) ), 200 )
      ).bind(@)
    )

  ready: () ->
    @isDocReady = true
    @getMembers("Space")
    @dom.mobileMenu.addEventListener( "click", (() =>
      @dom.menu.classList.toggle("show");
    ));


    return;


  # ## Load JSON
  getJSON: (url) ->
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = () =>
      if (request.status >= 200 && request.status < 400)
        @json = JSON.parse(request.responseText)

        @getList()
        @tree = @getTree()
        @buildMenu( @tree, @dom.menu )
        @buildContent()
        @scrollToHashID( window.location.hash );
        @ready()

      else
        showError("Cannot get contents")

    request.onerror = () ->
      showError("Error loading contents")

    request.send();


  getList: () ->
    _.each( @json, (v, k) =>
      # Find class inheritance
      ext = if (v.extend.length > 0) then [v.extend] else [];
      @elems[ v.cls ] = { name: v.cls, extend: ext };
    )


  # ## Build documentation
  buildContent: () ->

    for k in @flatTree
      v = @json[k]

      # create content section
      sec = document.createElement("section");
      sec.classList.add("element");
      sec.setAttribute("id", "elem"+k);
      @dom.content.appendChild( sec );

      # get inherited
      parents = []
      for n in @elems[v.cls].extend
        if (@elems[n])
          pa = {
            cls: n
            funcs: @elems[n].funcs
            props: @elems[n].props
          }
          # pa.funcs.shift() # remove constructor function
          parents.push( pa )

      v.parents = parents

      sec.innerHTML = @dom.template( v );


  # ## Build nav menu
  buildMenu: ( tree, node, depth=0 ) ->

    if Object.keys(tree).length > 0

      sec = document.createElement("ul")
      sec.classList.add("depth-"+depth)

      node.appendChild( sec );

      _.each( tree, (v, k) =>
        li = document.createElement("li")
        li.setAttribute("data-name", k)
        @bindSubMenu( li )
        li.innerHTML = "<a href='#elem#{k}'>#{k}</a>"
        sec.appendChild( li );

        # store the sequence of menu item in flat list
        @flatTree.push( k )

        # store the member names
        @elems[k].funcs = _.pluck( @json[k].funcs, 'name' )
        @elems[k].props = _.pluck( @json[k].props, 'name' )
        @elems[k].statics = _.pluck( @json[k].statics, 'name' )
        @elems[k].inherited = depth > 0

        @buildMenu( v, li, depth+1 );
      )


  bindSubMenu: (elem) ->
    elem.addEventListener("click", (evt) =>
      k = evt.currentTarget.getAttribute("data-name")
      if k
        @getMembers(k)

      evt.stopPropagation()
    )

  getMembers: (k) ->

    if @elems[k]

      # create submenu
      @dom.submenu.innerHTML = "";

      # Create submenu contents
      _createSub = ( list, name, key ) =>

        if !list or list.length <= 0 then return false

        # sub section
        sub  = document.createElement("div")
        sub.classList.add("subsection")
        subtitle = document.createElement("h4")
        subtitle.innerText = name
        sub.appendChild( subtitle)
        @dom.submenu.appendChild(sub)

        # sub item
        if list == "inherited"
          item = document.createElement("a")
          item.setAttribute("href", "##{key}-#{k}");
          item.innerText = name
          sub.appendChild(item);

        else
          for li in list
            item = document.createElement("a")
            item.setAttribute("href", "##{key}-#{k}-#{li}");
            item.innerText = li
            item.classList.add("subitem")
            sub.appendChild(item);

          return sub


      _createSub( @elems[k].funcs, "Functions", "func" )
      _createSub( @elems[k].props, "Properties", "prop" )
      _createSub( @elems[k].statics, "Statics", "static" )

      if (@elems[k].inherited)
        _createSub( "inherited", "Inherited", "inherited" )



  # ## Get the full ancestry tree
  getTree: () ->

    elemTree = {}

    # find ancestor path
    findPath = (parents) =>

      if (!parents || parents.length == 0) then return parents

      el = @elems[ parents[0] ];

      if (el && el.extend.length > 0)
        return findPath( el.extend.concat( parents ) )
      else
        return parents


    # find parent recursively from root
    getParent = ( parents, target, depth ) ->
      for v in parents
        if target[ v ]
          return getParent( parents, target[ v ], depth+1 )
        if depth > 20 then return target

      return target


    # Sort by depth of inheritance
    sortedLevels = [];
    _.each( @elems, (v, k) ->
      v.extend = findPath( v.extend )
      sortedLevels.push( v )
    )

    sortedLevels.sort( (a,b) ->
      i = if (a.name > b.name) then 0.1 else -0.1;
      ai = a.extend.length;
      bi = b.extend.length;
      if a.name=="Space" then ai = -100
      if a.name=="Form" then ai = -99
      if a.name=="Point" then ai = -98
      if b.name=="Space" then bi = -100
      if b.name=="Form" then bi = -99
      if b.name=="Point" then bi = -98
      return (ai - bi) + i
    )

    @sortedElems = sortedLevels

    # Compose inheritance tree
    for c in sortedLevels
      if (c.extend.length == 0)
        elemTree[ c.name ] = {}
      else
        parent = getParent(c.extend, elemTree, 0, @flatTree )
        parent[ c.name ] = {}

    return elemTree;



  showError: (err) ->
    console.error(err)


  scrollTo: (evt, elem) ->
    if evt and elem
      toElem = elem.getAttribute("data-to")
      if toElem
        ypos = document.querySelector(toElem).offsetTop;

        clearInterval( @uiTimerID )
        @uiTimerID = setInterval( ( () =>
          d = ypos - window.scrollY
          if ( Math.abs(d) <= 1 )
            clearInterval( @uiTimerID )
            return

          window.scrollBy( 0, Math.ceil(d/3) )

        ), 40 )

        evt.preventDefault()
        evt.stopPropagation()


  resize: (evt) ->
    @dom.head.style.height = window.innerHeight + "px"
    @layout.sticky[0].y = window.innerHeight;
    @syncScroll()


  isInView: (elem) ->
    rect = elem.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)

  ###
  loadDemo: () ->
    demos = document.querySelectorAll(".demo")
    for d in demos
      if @isInView(d)
        console.log("in view", d)
        @activeDemo.elem = d
        @activeDemo.script = document.createElement('script')
        @activeDemo.script.type = "text/javascript"
        @activeDemo.script.src = @activeDemo.path + d.getAttribute("data-demo") + ".js"
        @activeDemo.script.onload = (evt) =>
          @dom.demo.classList.add("active")
          console.log("loaded")

        document.querySelector("body").appendChild( @activeDemo.script )

        return


  unloadDemo: () ->
    if @activeDemo.elem and !@isInView( @activeDemo.elem )
      @dom.demo.classList.remove("active")
      document.querySelector("body").removeChild( @activeDemo.script )
      @dom.demo.removeChild( @dom.demo.querySelector("canvas") )
      @activeDemo.elem = null
  ###


  # Go to hash id location
  scrollToHashID: (id) ->
    if (id)
      elem = document.querySelector(""+id)
      if (elem)
        window.scrollTo( 0, elem.offsetTop + window.innerHeight )
        clearTimeout( @coverDemoTimeout )
        return


    if (window.scrollY < window.innerHeight/2)
      clearTimeout( this.coverDemoTimeout );
      if (window.coverDemo)
        this.coverDemoTimeout = setTimeout(
          (() =>
            window.coverDemo()
            @coverDemoLoaded = true
          ), 500
        )


  # Sticky header
  onScroll: (evt) ->

    _stick = ( t ) =>
      if t.passed
        @dom.frame.classList.add( "sticky-"+t.name )
      else
        @dom.frame.classList.remove( "sticky-"+t.name )

      if !@inited and t.passed
        @inited = true


    for st in @layout.sticky by 1

      if window.scrollY > st.y and !st.passed
        st.passed = true
        _stick( st )

      else if window.scrollY < st.y and st.passed
        st.passed = false
        _stick( st )

    if window.scrollY <= 0
      for st in @layout.sticky by 1
        @dom.frame.classList.remove( "sticky-"+st.name )

    @syncScroll()

    ###
    # load or unload demo
    @unloadDemo()
    clearTimeout( @scrollTimeout )
    @scrollTimeout = setTimeout( (
      () => @loadDemo()
    ), 500 )
    ###

  # ## Synchronize element position when scrolling or resizing
  syncScroll: () ->
    if (@isDocReady && window.coverDemo && !@coverDemoLoaded && window.scrollY < window.innerHeight/2)
      clearTimeout( @coverDemoTimeout );
      window.coverDemo()
      @coverDemoLoaded = true

    else
      if (this.coverDemoLoaded)
        if (window.scrollY < 5) then window.restartCoverDemo() else window.stopCoverDemo()

    return

#    if window.scrollY >= @layout.sticky[0].y
#      offy = @layout.sticky[2].y - window.scrollY - window.innerHeight - @layout.coverOffset
#      @dom.overview.style.top = Math.min( 0, offy ) + "px"


window.Docs = Docs