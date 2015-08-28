//// 0. Describe this demo
window.demoDescription = "Draw three kinds of grids: with fixed size cells, with flexible size cells, and with cell sizes based on grid's rows and columns. Resize the browser window to update grid layouts.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );


//// 2. Create Elements

// three kinds of grids
var grids = [
  new Grid( space.size.$multiply( 0.1 ) ).to( space.size.$multiply(0.9, 0.3) ).init(50, 50, "fix", "fix"),
  new Grid( space.size.$multiply( 0.1, 0.4 ) ).to( space.size.$multiply(0.9, 0.6 ) ).init( 50, 50, "flex", "flex"),
  new Grid( space.size.$multiply( 0.1, 0.7 ) ).to( space.size.$multiply(0.9, 0.9 ) ).init( 5, 8, "stretch", "stretch")
];

// Use grid.generate() to specify a callback function to render each grid cell
for (var i=0; i<grids.length; i++) {
  grids[i].generate( function ( size, position, row, column, type, isOccupied ) {
    form.stroke( colors.b1 ).fill( false ).rect( new Rectangle( position ).resizeTo( size ) );
    form.fill( colors.b1 ).font( 9 ).text( position.$add( 5, 12 ), row + ", " + column );
  }.bind( grids[i] ) );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    for (var i = 0; i < grids.length; i++) {
      form.fill( "#9ab" ).font( 12 );
      form.text( grids[i].$subtract( 0, 15 ), ["Fix (50px by 50px cells)", "Flex (~50px by ~50px cells)", "Stretch (5 columns and 8 rows)"][i % 3] );
      form.stroke( false ).fill( "#fff" ).rect( grids[i] ); // draw grid area
      grids[i].create(); // draw grid cells (via generate() callback)
    }
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grids[0].set( space.size.$multiply( 0.1 ) ).to( space.size.$multiply( 0.9, 0.3 ) ).init( 50, 50, "fix", "fix" );
    grids[1].set( space.size.$multiply( 0.1, 0.4 ) ).to( space.size.$multiply( 0.9, 0.6 ) ).init( 50, 50, "flex", "flex" );
    grids[2].set( space.size.$multiply( 0.1, 0.7 ) ).to( space.size.$multiply( 0.9, 0.9 ) ).init( 5, 8, "stretch", "stretch" );
  }
});


// 4. Start playing
space.bindMouse();
space.play();