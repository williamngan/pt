//// 0. Describe this demo
window.demoDescription = "From mouse movements, create a set of alternating end points and control points. Use this set of points to draw a continuous bezier curve.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: "#222"} );
var form = new Form( space );


//// 2. Create Elements
var bezier = new Curve();
var last = new Vector();
var ang = 0;
var lineSize = 0;


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // draw bezier
    form.stroke( colors.a1, 2 ).fill( "rgba(0,0,0,.2)" ).polygon( new Curve().to(bezier.points).bezier(), false );

    // draw points and tangent lines
    form.fill(false ).stroke(colors.a2, 0.5).polygon( bezier.points, false );
    form.stroke(false ).fill("#fff").points( bezier.points, 2, true );

    // jiggle to points
    for (var i=0; i<bezier.points.length; i++) {
      bezier.points[i].add(Math.random()-Math.random(), Math.random()-Math.random());
    }
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {

      ang += Const.one_degree;
      var pt = new Vector(x,y);

      // generate a point set up to 100 points using mouse position
      if (pt.distance(last) > lineSize) {
        bezier.to( pt );

        // remove last end point and 2 control points
        if (bezier.count() > 70) {
          bezier.disconnect( 3 );
        }

        last = pt;
        lineSize = 50;
      }
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