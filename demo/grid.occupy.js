//// 0. Describe this demo
window.demoDescription = "Draw three kinds of grids: with fixed size cells, with flexible size cells, and with cell sizes based on grid's rows and columns. Resize the browser window to update grid layouts.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.a4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements

var grid = new Grid( space.size.$multiply( 0.1 ) ).to( space.size.$multiply(0.9) ).init(20, 18, "stretch", "stretch");
grid.occupy( 2,3, 5,6);
grid.occupy( 15,15, 5,3);

var mouse = new Vector();
var mouseCell = new Rectangle();

// Use grid.generate() to specify a callback function to render each grid cell
grid.generate( function ( size, position, row, column, type, isOccupied ) {
  var fill = (isOccupied) ? colors.a1 : false;
  form.stroke( "#fff" ).fill( fill ).rect( new Rectangle( position ).resizeTo( size ) );
}.bind( grid ) );



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    grid.create(); // draw grid cells (via generate() callback)

    c = grid.positionToCell( mouse.x, mouse.y);
    mouseCell = grid.cellToRectangle( c.x, c.y );
    if (mouseCell) form.fill(colors.a3 ).rect( mouseCell );

    var ns = grid.neighbors( c.x, c.y );
    for (var i=0; i<ns.length; i++) {
      if (ns[i]) {
        form.fill("#999" ).rect( grid.cellToRectangle( ns[i].x, ns[i].y ) );
      }
    }

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);

    }
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grid.set( space.size.$multiply( 0.1 ) ).to( space.size.$multiply( 0.9 ) ).init( 20, 18, "stretch", "stretch" );

  }
});


// 4. Start playing
space.bindMouse();
space.play();