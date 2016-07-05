//// 0. Describe this demo
window.demoDescription = "Connect the mouse's position to the center, and trace a path if it intersects with an invisible rectangle.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: "#222"} );
var form = new Form( space );


//// 2. Create Elements
var rect = new Rectangle( space.size.$multiply(0.2) ).to( space.size.$multiply(0.8) );
var paths = [];
var lastTime = 0;
var mouseLine = new Line( space.size.$divide(2) ).to( rect );


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    if (time-lastTime > 100) paths.shift(); // remove old lines

    // draw inner lines in rectangle by checking path intersection with mouse line
    form.fill(false );
    for (var i=0; i<paths.length; i++) {
      var ps = rect.intersectPath( paths[i] );
      if (ps.length >= 2) {
        form.stroke( "rgba(255,255,255," + Math.max( 0.05, i / paths.length) + ")", ((i % 10) / 10 + 0.5) ); // dynamic stroke color and width
        form.line( new Line( ps[0] ).to( ps[1] ) );
      }
    }
    form.stroke(colors.a4,2).line( mouseLine );
    form.stroke(false).fill(colors.a4).point( mouseLine.p1, 3, true )
  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      if (paths.length < 1000) {
        mouseLine = new Line( space.size.$divide( 2 ) ).to( x, y );
        paths.push( mouseLine );
      }
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();