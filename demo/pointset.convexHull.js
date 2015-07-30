//// 0. Describe this demo
window.demoDescription = "A series of lines radiates from center, and a point moves up and down on each line. Find the points that defines an outer boundary, and draw that boundary.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b2 ).display();
var form = new Form( space.ctx );
form.fill( false );


//// 2. Create Elements
var paths = [];
var count = 20;
var unit = space.size.$divide(30);
unit = Math.min( unit.x, unit.y );
var t = 0;
var variant = 1;

// draw the radial skeletons of random lengths
for (var i=0; i<count; i++) {
  var r = unit+ unit*3*Math.abs(i-count/2)/count;
  var r2 = r + Util.randomRange( unit * 6, unit * 8 );
  var p = new Vector( r, 0 ).rotate2D( i * Const.two_pi / count );
  var p2 = new Vector( r + r2, 0 ).rotate2D( i * Const.two_pi / count );
  paths.push( new Pair( p ).to( p2 ).moveBy( space.size.$divide(2)) );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    var pts = new PointSet();
    t += 1;

    for (var i=0; i<paths.length; i++) {
      // interpolate a position on the skeleton line using sine wave
      var tt = Util.boundRadian( (t + i * variant) * Const.deg_to_rad );
      var p = paths[i].interpolate( Math.abs( Math.sin( tt ) ) );

      // draw skeleton
      form.stroke( "rgba(0,0,0,.1)", 1 ).fill( false ).line( paths[i] );
      form.fill( colors.a2 ).stroke( false ).point( p, 1.5, true );
      pts.to( p );
    }

    // use convex hull to find the outer bounds and draw it as a curve
    form.stroke("#fff", 2).fill( "rgba(255,255,255,.3)" );
    var hull = pts.convexHull();
    form.polygon( new Curve().to(hull ).catmullRom() );

    // draw inner polygon
    form.fill( "rgba(66,220,142,.15)" ).stroke( false ).polygon( pts.points );
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      variant = Math.min( space.size.$divide(2 ).distance(x,y ) / 50, 30);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();