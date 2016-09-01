//// 0. Describe this demo
window.demoDescription = "Starts at 0, ends at 1. Choosing the right path is an aesthetic or existential question though! Based on the works of Robert Penner and Golan Levin";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a4} );
var form = new Form( space );


//// 2. Create Elements
var fns = [
  "linear", "quadraticIn", "quadraticOut", "quadraticInOut", "cubicIn", "cubicOut", "cubicInOut", "sineIn", "sineOut", "sineInOut", "cosineApprox", "circularIn", "circularOut", "circularInOut",
  "exponentialIn", "exponentialOut", "elasticIn", "elasticOut", "elasticInOut", "bounceIn", "bounceOut", "bounceInOut", "sigmoid", "logSigmoid", "seat", "quadraticTarget", "quadraticBezier", "cubicBezier", "cliff", "step"
];

var columns = Math.ceil( Math.sqrt( fns.length ) );
var rows = Math.ceil( (fns.length - columns) / columns );
if (rows*columns < fns.length) rows += 1;

var grid = new Grid( space.size.$multiply( 0.1, 0.1 ) ).to( space.size.$multiply(0.9, 0.9 ) ).init( columns, rows, "stretch", "stretch");
var progress = 0;
var timeScale = 1;


// Use a shaping function (`fn`) to find the value at `t` for this bounding box with (`pos`, `size`)
function pointAt( fn, t, pos, size ) {
  var v = (fn == Shaping.step) ? Shaping.step( Shaping.quadraticOut, 6, t, size.y) : fn( t, size.y );
  return new Point( pos.x + t*size.x, pos.y + v )
}


// Get a series of points to draw the path of this shaping function (`fn`)
function shaping( fn, pos, size ) {
  var pts = new PointSet();
  for (var i=0; i<=20; i++) {
    pts.to( pointAt( fn, i/20, pos, size ) );
  }
  return pts;
}


// grid.generate() specifies a callback function to render each grid cell
grid.generate( function ( size, position, row, column, type, isOccupied ) {

  var idx = row*columns + column; // map row-column to an index for the shaping function list `fns`
  var fn = (idx < fns.length) ? Shaping[ fns[idx] ] : false;

  if (fn) {
    var pts = shaping( fn, position, size );
    var nv = pointAt( fn, progress, new Point(0,0), new Point(1,1) ).y; // current normalized value
    var bgcolor = "rgba(0,0,0, "+ (nv/5+0.05) + ")";
    var radius = Math.min(size.x, size.y)/8 + nv*Math.min(size.x, size.y)/4;

    form.stroke( false ).fill( bgcolor ).circle( new Circle( size.$divide(2).add(position) ).setRadius( radius ) ); // draw circle
    form.fill(false).stroke("#fff", 6, 'round').polygon( pts.points, false ); // draw path
    form.stroke(false).fill(colors.a3).point( pointAt( fn, progress, position, size ), 3, true); // draw moving dot
    form.fill("rgba(0,0,0,.5)").font(11).text( position.$add(0, 20), fns[idx]); // draw label
  }

}.bind( grid ) );


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    var timeAdd = 2000 * timeScale;
    progress = Math.min(1, (time % (500+timeAdd))/(450 + (timeAdd - timeAdd/40)) );
    grid.create(); // draw grid cells (via generate() callback)
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      timeScale = x / space.size.x;
    }
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grid.set( space.size.$multiply( 0.1, 0.1 ) ).to( space.size.$multiply( 0.9, 0.9 ) ).init( columns, rows, "stretch", "stretch" );
  }
});


// 4. Start playing
space.bindMouse();
space.play();