//// 0. Describe this demo
window.demoDescription = "Two kinds of lines rotate along its middle point. Mark the intersection with other lines of its own kind, and of the other kind.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var pts = [];
for ( var i=0; i<30; i++ ) {
  pts.push( new Vector( space.size.$multiply( Math.random(), Math.random() ) ).add( 0, 0, 50+Math.random()*75 ) );
}
var angle = 0;


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    var linesA = []; // even
    var linesB = []; // odd

    for (var i = 0; i < pts.length; i++) {
      // rotation direction and initial angle
      var dir = (i%2===0) ? 1 : -1;
      var ang =  Const.two_pi * (i % 10) / 10;

      // create lines
      var ln = new Line( pts[i].$subtract( pts[i].z, 0 ) ).to( pts[i].$add( pts[i].z, 0 ) );
      ln.rotate2D( ang + angle * dir, pts[i] );

      var list = (i%2===0) ? linesA : linesB;
      list.push( ln );
    }

    var pi;

    for (i=0; i<linesA.length; i++) {
      // check intersection with other type (odd)
      for (var j = 0; j < linesB.length; j++) {
        pi = linesA[i].intersectLine( linesB[j] );
        if (pi) form.fill(false).stroke( "rgba(255,255,255,1)", 10 ).point( pi, 20, true );
      }

      // check intersection with same type (even)
      for (j = 0; j < linesA.length; j++) {
        pi = linesA[i].intersectLine( linesA[j] );
        if (pi) form.fill( colors.a1, 2 ).stroke(false).point( pi, 7, true );
      }
    }

    for (i=0; i<linesB.length; i++) {
      // check intersection with same type (odd)
      for (j = 0; j < linesB.length; j++) {
        pi = linesB[i].intersectLine( linesB[j] );
        if (pi) form.fill( colors.a2, 2 ).stroke(false).point( pi, 7, true );
      }

      // draw lines
      form.stroke( colors.a1, 5).line( linesA[i] );
      form.stroke( colors.a2, 5).line( linesB[i] );
    }
  },

  onMouseAction: function(type, x, y, evt) {
    angle = y/space.size.y * Const.two_pi;
  }
});


// 4. Start playing
space.bindMouse();
space.play();