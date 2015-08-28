//// 0. Describe this demo
window.demoDescription = "Generates a set of points by mouse movements. Use each point's angle between its previous and next point in the set to determine a stroke color, and draw a line in that color.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b2 ).display();
var form = new Form( space );


//// 2. Create Elements
var pset = new PointSet();
var last = new Vector();
var ang = 0;
var lineSize = 0;


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    var sides = pset.sides(false); // a point set's sides
    var angles = pset.angles(); // a point set's angles

    for (var i=0; i<sides.length; i++) {

      var c = 0; // stroke color index based on angle
      if (angles[i]) {
        c = Math.floor( Util.boundAngle( angles[i].angle, true ) * Const.rad_to_deg  / 90);
      }

      var color = colors["a"+( Math.min(c+1, 4)) ];
      form.stroke( color, 60 ).fill(false);
      form.line( sides[i] ); // draw line

      if (pset.points[i+1]) {
        form.stroke(false ).fill(color).point( pset.points[i + 1], 30, true ); // draw point
      }
    }

    // draw thin curve line on top
    form.stroke( "rgba(0,0,0,.3)", 1 ).fill(false ).polygon( new Curve().to(pset.points).catmullRom(5), false );
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {

      ang += Const.one_degree;
      var pt = new Vector(x,y);

      // generate a point set up to 100 points using mouse position
      if (pt.distance(last) > lineSize) {

        pset.to( pt );
        if (pset.points.length > 100) {
          pset.disconnect( 0 );
        }

        last = pt;
        lineSize = Util.randomRange(20, 50);
      }
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();