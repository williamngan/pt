//// 0. Describe this demo
window.demoDescription = "Draw three kinds of grids: with fixed size cells, with flexible size cells, and with cell sizes based on grid's rows and columns. Resize the browser window to update grid layouts.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a4} );
var form = new Form( space );


//// 2. Create Elements
var fns = [
  "linear", "quadraticIn", "quadraticOut", "quadraticInOut", "cubicIn", "cubicOut", "cubicInOut",
  "sineIn", "sineOut", "sineInOut", "circularIn", "circularOut", "circularInOut",
  "elasticIn", "elasticOut", "elasticInOut", "bounceIn", "bounceOut", "bounceInOut",
  "sigmoid", "step"
];

var columns = Math.ceil( Math.sqrt( fns.length ) );
var rows = Math.ceil( (fns.length - columns) / columns );
if (rows*columns < fns.length) rows += 1;

var grid = new Grid( space.size.$multiply( 0.1, 0.1 ) ).to( space.size.$multiply(0.9, 0.9 ) ).init( columns, rows, "stretch", "stretch");
var timeStep = 0;
var timeCycle = 100;



// Use grid.generate() to specify a callback function to render each grid cell
grid.generate( function ( size, position, row, column, type, isOccupied ) {
  var rect = new Rectangle( position ).resizeTo( size );

  var idx = row*rows + column;
  var fn = (idx < fns.length) ? Shaping[ fns[idx] ] : false;
  
  if (fn) {
    var pts = shaping( fn, rect, rect.size() );
    form.stroke("#fff", 5).polygon( pts.points, false );
    form.stroke(false).fill(colors.a3).point( pointAt( fn, timeStep/timeCycle, rect, rect.size() ), 3, true);
    form.fill(colors.a3).text( position.$add(5,12), fns[idx] );
  }
  form.stroke( "#fff", 1 ).fill( false ).rect( rect );

}.bind( grid ) );

function pointAt( fn, t, pos, size ) {
  var v = fn( t, size.y );
  return new Point( pos.x + t*size.x, pos.y + v )
}

function shaping( fn, pos, size ) {
  var pts = new PointSet();
  for (var i=0; i<=20; i++) {
    pts.to( pointAt( fn, i/20, pos, size ) );
  }
  return pts;
};



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    timeStep = (timeStep+1) % timeCycle;
    grid.create(); // draw grid cells (via generate() callback)
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grid.set( space.size.$multiply( 0.1, 0.1 ) ).to( space.size.$multiply( 0.9, 0.9 ) ).init( columns, rows, "stretch", "stretch" );
  }
});


// 4. Start playing
space.bindMouse();
space.play();