//// 0. Describe this demo
window.demoDescription = "A circle moves in a field of line segments. Check intersections on both line paths and line segments, and highlight the intersection points and paths";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space );


//// 2. Create Elements
var mouse = new Circle( space.size.$divide(2) ).setRadius(100);

// random lines
var pairs = [];
for (var i=0; i<70; i++) {
  var r = new Vector( space.size.x/3*(Math.random()-Math.random()), space.size.x/3*(Math.random()-Math.random()) );
  pairs.push( new Pair( space.size.$multiply( Math.random(), Math.random()) ).to( r).relative());
}

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // go through each pair
    for (var i=0; i<pairs.length; i++) {

      var intersected = false;

      // check path intersections
      var inpath = mouse.intersectPath( pairs[i] );
      if (inpath && inpath.length >0) {

        // draw path intersections
        for (var j=0; j<inpath.length; j++) {
          form.stroke(false).fill( "rgba(255,255,255,.2)" );
          form.point( inpath[j], 0.5 );

          form.stroke("rgba(255,255,255,.05)");
          form.line( new Line(inpath[j]).to( pairs[i] ) )
        }

        // check line segment intersections
        var inline = mouse.intersectLine( pairs[i] );
        intersected = inline.length > 0;

        // draw line segment intersections
        form.stroke( false ).fill( colors.a1 );
        for (var k=0; k<inline.length; k++) {
          form.point( inline[k], 3, true );
        }
      }

      form.stroke( (intersected) ? colors.a1 : colors.b2 );
      form.line( pairs[i] );
    }
  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();