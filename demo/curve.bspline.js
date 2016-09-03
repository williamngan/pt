//// 0. Describe this demo
window.demoDescription = "Create a set of points around a center point, varying each's radius slightly. Based on the points' positions, draw a curved area.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.b1} );
var form = new Form( space );


//// 2. Create Elements
var unit = space.size.$divide(20);
unit = Math.min(unit.x, unit.y);
var count = 40;
var curve = new Curve();
var mouse = new Vector();
var threshold = unit*6; // invisible mouse circle


// draw the radial skeletons of random lengths
for (var i=0; i<count; i++) {
  var r = Util.randomRange( unit * 6, unit * 7 );
  var p = new Vector( r, 0 ).rotate2D( Const.half_pi + i * Const.two_pi / count ).add( space.size.$divide(2) );
  curve.to( p );
}

// Close the curve. A bug somewhere here that prevents the curve from closing continuously. To fix.
curve.to( curve.points[0].clone() );
curve.points.unshift( curve.getAt( curve.count()-1 ).clone() );
curve.points.unshift( curve.getAt( curve.count()-2 ).clone() );

// store the initial points
var origs = Util.clonePoints( curve.points );

// Repel the control points when mouse is near i
function repel( pt, i ) {
  if ( pt.distance(mouse) < threshold ) { // smaller than threshold distance, push it out
    var dir = pt.$subtract(mouse).normalize();
    pt.set( dir.multiply(threshold).add( mouse ).min( space.size ).max(0, 0) );
  } else { // bigger than threshold distance, pull it in
    var orig = origs[i];
    pt.set ( orig.$add( pt.$subtract(orig).multiply(0.98) ) );
  }
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // draw curve and control points
    form.stroke( false ).fill( "rgba(255,255,255,.85)" ).polygon( curve.bspline(), false );
    form.stroke(false ).fill( "rgba(255,255,255,.2").points( curve.points, 2, true );

    var center = curve.centroid();
    var subs = [];

    // repel control points, and draw mid points
    for (var i=0; i<curve.points.length; i++) {
      repel( curve.points[i], i );
      var ln = new Line( center ).to( curve.getAt(i) );
      var sp = ln.midpoint();
      form.fill( "rgba(255,200,0,.5)").point( sp, 2*ln.length() / (unit*5), true );
      subs.push( sp );
    }

    // draw center point
    form.stroke(false ).fill( colors.a4 ).point( center, unit*3, true );

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse = new Vector( x, y );
      var dist = mouse.distance( space.size.$divide(2) ) / 2;
      var u = Math.min( unit*10, dist)/(unit*10);
      threshold = (1 - u*u) * dist * 2; // a circular threshold that becomes biggest at 1/4 and 3/4 area of space
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