( function() {

  // ordered list of elements to load
  //var elems = [ "Point", "Form", "Space", "Util", "Const",
  //              "Vector", "Pair", "Circle", "Line", "Rectangle",
  //              "Triangle", "Color", "PointSet", "Curve",
  //              "Timer", "Grid", "Matrix", "Particle", "ParticleSystem", "CanvasSpace"];

  var loadedElems = {}

  // ajax
  var ajaxGet = function(url, callback, qs) {
    var x = new XMLHttpRequest();
    if (!qs) qs='';
    x.open("GET", url+qs, true);
    x.onreadystatechange = function() { if (x.readyState == 4) callback(x.responseText); };
    x.send(null);
  };

  // container element and template
  var container = document.querySelector("#content");
  var menu = document.querySelector("#menu");
  var compTemplate = _.template( document.querySelector('#comp').innerHTML );






  // load elements
  var findAncestors = function() {

    var elemTree = {};

    function findPath( parents) {

      if (!parents || parents.length == 0) return parents;

      var el = loadedElems[ parents[0] ];

      if (el && el.extend.length > 0) {
        return findPath( el.extend.concat( parents ) );
      } else {
        return parents;
      }
    }

    function getParent( parents, target, depth ) {
      for (var i=0; i<parents.length; i++) {
        if ( target[ parents[i] ] ) {
          return getParent( parents, target[ parents[i] ], depth+1 );
        }
        if (depth > 20) {
          return target;
        }
      }
      return target;
    }

    // Sort by depth of inheritance
    var sortedLevels = [];
    for (var k in loadedElems ) {
      loadedElems[k].extend = findPath( loadedElems[k].extend );
      sortedLevels.push( loadedElems[k] );
    }

    sortedLevels.sort( function(a,b) {
      var i = (a.name > b.name) ? 0.1 : -0.1;
      var ai = a.extend.length;
      var bi = b.extend.length;
      if (a.name=="Space") ai = -100;
      if (a.name=="Form") ai = -99;
      if (a.name=="Point") ai = -98;
      if (b.name=="Space") bi = -100;
      if (b.name=="Form") bi = -99;
      if (b.name=="Point") bi = -98;

      return (ai - bi) + i;
    });

    // Compose inheritance tree
    for (var i=0; i<sortedLevels.length; i++) {
      var c = sortedLevels[i];

      if (c.extend.length == 0) {
        elemTree[ c.name ] = {}
      } else {
        var parent = getParent(c.extend, elemTree, 0);
        parent[ c.name ] = {};
      }
    }

    return elemTree;

  }


  // Build menu
  function createTree( data, node ) {

    if (Object.keys(data).length > 0) {

      var sec = document.createElement("ul");
      node.appendChild( sec );

      for (var k in data) {
        var li = document.createElement("li");
        li.innerHTML = k;
        sec.appendChild( li );
        createTree( data[k], li );
      }
    }
  }






  ajaxGet("json/all.json", function(res) {

    try {
      var content = JSON.parse(res);

      for (var k in content) {

        // Create section
        var sec = document.createElement("section");
        sec.classList.add("element");
        sec.setAttribute("data-element", k);
        container.appendChild( sec );

        // Section content
        sec.innerHTML = compTemplate( content[k] );

        // Find class inheritance
        var ext = (content[k].extend.length > 0) ? [content[k].extend] : [];
        loadedElems[content[k].cls] = { name: content[k].cls, extend: ext };

      }

      var tree = findAncestors();

      createTree( tree, menu);

  //

  //    var ext = (content.extend.length > 0) ? [content.extend] : [];

  //    loadedList[content.cls] = { name: content.cls, extend: ext };
  //    if (Object.keys( loadedList).length >= elems.length) {
  //      callback();
  //    }


    } catch (err) {

      console.error( content, err.stack )
    }

  });






})();