//// 0. Describe this demo
window.demoDescription = "A circle and a donut meets. Indicate their points of intersections.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a4} );
var form = new Form( space );

//// 2. Create Elements
var mouse = new Circle( space.size.$divide(2) ).setRadius(  Math.min(space.size.x, space.size.y)/4 );
var mouse2 = new Circle( space.size.$divide(2) ).setRadius(  Math.min(space.size.x, space.size.y)/8 );
var circle = new Circle( space.size.$divide(2) ).setRadius( Math.min(space.size.x, space.size.y)/5 );


form.stroke( false );

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // draw circle and donut. Donut follows mouse position.
    form.fill( colors.a2 );
    form.circle( mouse, mouse.radius, true );

    form.fill( colors.a4 );
    form.circle( mouse2, mouse2.radius, true );

    form.fill( "rgba(50,50,50,.25)" );
    form.circle( circle, circle.radius, true );

    // Check intersections and draw the intersection points
    var ps = circle.intersectCircle( mouse );
    var ps2 = circle.intersectCircle( mouse2 );

    form.fill( colors.a1 );
    for (var i=0; i<ps.length; i++) { form.point( ps[i], 6, true); }

    form.fill( "#fff" );
    for (i=0; i<ps2.length; i++) { form.point( ps2[i], 3, true); }

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
      mouse2.set(x,y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();