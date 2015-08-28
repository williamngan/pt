//// 0. Describe this demo
window.demoDescription = "In a grid of rectangles, resize each one based on its distance as well as x y differences from the mouse position.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );
form.stroke( false );

//// 2. Create Elements
var rects = [];
var mouse = new Vector();
var steps = 10;
var gap = space.size.$subtract( 100, 100 ).divide( steps, steps*2 );

// create grid of rectangles
for (var i=0; i<=steps; i++) {
  for (var j=0; j<=(steps*2); j++) {
    var rect = new Rectangle().to( 10, 10 );
    rect.moveTo( 50 - 5.5 + gap.x * i, 50 - 5.5 + gap.y * j );
    rect.setCenter();
    rects.push( rect );
  }
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    for (var i=0; i<rects.length; i++) {
      var rect = rects[i];

      // find distance as well as x y differences
      var mag = 100 - Math.min( 100, rect.center.distance( mouse ) );
      var diff = rect.center.$subtract( mouse ).abs().$min( 200, 200);

      // resize rectangles from center point based on distance and diffs
      rect.resizeCenterTo( diff.subtract(50).divide(6).add( mag/2 ).$max(5,5) );
      form.fill( colors.a3 ).rect( rect );
    }
  },

  onMouseAction: function(type, x, y, evt) {
    if (type === "move") {
      mouse.set(x, y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();