//// 0. Describe this demo
window.demoDescription = "Pairs of points revolve around a center point. Draw a line whose color depends on whether the mouse position is on left or right side of the pair, or if the 3 points are collinear.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: "#222"} );
var form = new Form( space );


//// 2. Create Elements
var pairs = [];
var center = space.size.$divide(2);
var mouse = center.clone();

var steps = 200;
var r = Math.min( space.size.x, space.size.y ) * 0.4;
var dr = Math.min( space.size.x, space.size.y ) * 0.4 / steps;

// create pairs
for (var i=0; i<steps; i++) {
  var p = new Pair( Math.random()*r, Math.random()*r ).to( Math.random()*-r, Math.random()*-r );
  p.moveBy( center ).rotate2D( i*Math.PI/steps, center );
  pairs.push( p );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    for (var i=0; i<pairs.length; i++) {

      // rotate each pair by 0.1 degree
      var pr = pairs[i];
      pr.rotate2D( Const.one_degree/10, center );

      // check collinearity with mouse, and draw a line with different color
      var col = pr.collinear(mouse);

      // Exact collinearity with return 0, but here we just check for a generous threshold
      if ( Math.abs( col ) < 200 ) {
        form.stroke("#fff");
        form.line( pr );
        form.line( pr.clone().to( mouse ) );

      // not collinear, check whether mouse is on left or right side
      } else {
        form.stroke( ( (col<0) ? "rgba(255,255,0,.1)" : "rgba(0,255,255,.1)") ).line( pr );
        form.stroke(false ).fill("#fff").points( pr.toArray(), 0.5) ;
      }

      form.fill( colors.a1 ).stroke(false).point( mouse, 1.5, true );
    }
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  },

  onTouchAction: function(type, x, y, evt) {
    this.onMouseAction( type, x, y );
  }
});


// 4. Start playing
space.bindMouse();
space.bindTouch();
space.play();