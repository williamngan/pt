//// 0. Describe this demo
window.demoDescription = "Conway's Game of Life as a bathroom tile generator. Move the mouse to generate patterns.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a1} );
var form = new Form( space );
space.clear();
space.refresh(false);


//// 2. Create Elements
var grid = new Grid( space.size.$multiply( 0.1 ) ).to( space.size.$multiply(0.9) ).init(10, 10, "fix", "fix");
var buffer = [];
var debounceTimer = 0;

// Creates a "pentomino" in the middle
var halfC = Math.floor( grid.columns/2 );
var halfR = Math.floor( grid.rows/2 );

grid.occupy( halfC, halfR, 1,1 );
grid.occupy( halfC-1, halfR, 1,1 );
grid.occupy( halfC, halfR+1, 1,1 );
grid.occupy( halfC+1, halfR, 1,1 );
grid.occupy( halfC+1, halfR-1, 1,1 );


// Apply the buffer to the grid
grid.generate( function ( size, position, row, column, type, isOccupied ) {
  if (buffer) grid.occupy( column, row, 1, 1, buffer[column][row] );

  // Simple optimization, only redraw if the state is different.
  if (buffer[column][row] != isOccupied) {
    var fill = (isOccupied) ? colors["b"+(Math.floor(Math.random()*4) + 1)] : colors.a3;
    form.stroke( "#fff" ).fill( fill ).rect( new Rectangle( position ).resizeTo( size ) );
  }

}.bind( grid ) );


// Conway's game of life
function gameOfLife() {
  for (var i=0; i<grid.columns; i++) {
    buffer[i] = []; // reset row

    for (var k=0; k<grid.rows; k++) {
      var cnt = 0; // counter

      for ( var m=i-1; m<i+2; m++) { // get the states of surrounding cells
        var mm = (m<0) ? grid.columns-1 : ( (m>=grid.columns) ? m-grid.columns : m );

        for ( var n=k-1; n<k+2; n++) {
          var nn = (n<0) ? grid.rows-1 : ( (n>=grid.rows) ? n-grid.rows : n );
          if (mm===i && nn===k) continue;
          else if ( !grid.canFit(mm, nn, 1, 1) ) cnt++;
        }
      }
      buffer[i][k] = (grid.canFit(i, k, 1, 1) && cnt==3) || (!grid.canFit(i, k, 1, 1) && cnt>=2 && cnt<=3);
    }
  }
}

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    if (time-debounceTimer > 30) { // not too fast
      debounceTimer = time;
      gameOfLife();
      grid.create(); // draw grid cells (via generate() callback)
    }
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      var p1 = grid.positionToCell( x, y);
      grid.occupy( p1.x, p1.y, 1, 1, true );

      var mouseCell = new Rectangle( p1.$multiply( grid.cell.size ).add( grid ) ).resizeTo( grid.cell.size );
      form.stroke("#fff").fill(colors.a1).rect( mouseCell );
    }
  },

  onTouchAction: function(type, x, y, evt) {
    this.onMouseAction( type, x, y );
  },

  // callback to reset grid when space is resized
  onSpaceResize: function(w, h) {
    grid.set( space.size.$multiply( 0.1 ) ).to( space.size.$multiply( 0.9 ) ).init( 10, 10, "fix", "fix" );
    space.clear();
    buffer = [];
  }
});


// 4. Start playing
space.bindMouse();
space.bindTouch();
space.play();