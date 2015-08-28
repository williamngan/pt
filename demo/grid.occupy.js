//// 0. Describe this demo
window.demoDescription = "In a grid of cells, mark some cells as occupied. Then draw a grid area around the mouse position and check if the area is unoccupied.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.a4 ).display();
var form = new Form( space );


//// 2. Create Elements
var grid = new Grid( space.size.$multiply( 0.1 ) ).to( space.size.$multiply(0.9) ).init(15, 20, "stretch", "stretch");

// occupy and unoccupy cells in grid
grid.occupy( 2,3, 5,6);
grid.occupy( 6,8, 1,1, false);
grid.occupy( 2,3, 1,1, false);
grid.occupy( 12,15, 3,2);
grid.occupy( 3,12, 14,1);

// Use grid.generate() to specify a callback function to render each grid cell
grid.generate( function ( size, position, row, column, type, isOccupied ) {
  var fill = (isOccupied) ? "#fff" : false;
  form.stroke( "#fff" ).fill( fill ).rect( new Rectangle( position ).resizeTo( size ) );
}.bind( grid ) );

var mouse = new Vector( space.size.$divide(1.5, 2) );

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    // positions to cell
    var p1 = grid.positionToCell( mouse.x-50, mouse.y-50);
    var p2 = grid.positionToCell( mouse.x+50, mouse.y+50);

    // cell to rectangles
    var topLeft = grid.cellToRectangle( p1.x, p1.y );
    var bottomRight = grid.cellToRectangle( p2.x, p2.y );

    // check if the rectangle can fit within the free cells in the grid
    var canFit = grid.canFit( p1.x, p1.y, p2.x-p1.x+1, p2.y-p1.y+1 );

    // draw rectange and grid
    var rect = new Rectangle( topLeft ).to( bottomRight.add( grid.getCellSize() ) );
    form.fill( ( (canFit) ? "rgba(0,0,0,.2)" : colors.a1 ) ).rect( rect );
    grid.create(); // draw grid cells (via generate() callback)

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grid.set( space.size.$multiply( 0.1 ) ).to( space.size.$multiply( 0.9 ) ).init( 15, 20, "stretch", "stretch" );
  }
});


// 4. Start playing
space.bindMouse();
space.play();