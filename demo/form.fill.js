//// 0. Describe this demo
window.demoDescription = "Two rectangles filled and one rectangle stroked in different color. Their color opacity change with the mouse y position.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a2} );
var form = new Form( space );


//// 2. Create Elements
var rect1 = new Rectangle();
var rect2 = new Rectangle();
var rect3 = new Rectangle();
var op1 = 0.5;
var op2 = 0.5;
var op3 = 0.5;

function setSizes() {
  rect1.set( space.size.$multiply(0.25)).to( space.center.x + space.size.x/4, space.center.y+space.size.y/8 );
  rect2.set( space.size.$multiply(0.75)).to( space.center.x - space.size.x/4, space.center.y-space.size.y/8);
  rect3.set( space.size.$multiply(0.2, 0.3) ).to( space.size.$multiply(0.8, 0.7) );
}

setSizes();

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    var ypos = 0.27;

    form.stroke(false).fill( colors.a3 );
    form.rect(
        new Rectangle( space.size.$multiply( 0.25 ) ).to( space.size.x * 0.75, space.size.y * ypos )
    );

    form.stroke( "rgba(255, 255, 255, " + op1 + ")" ).fill( "rgba(150, 191, 237, " + op2 + ")" );
    form.rect(
        new Rectangle( space.size.$multiply( 0.25, (ypos += 0.05) ) ).to( space.size.x * 0.75, space.size.y * (ypos += 0.05) )
    );

    form.fill( false ).stroke( "rgba(255, 255, 255, " + op3 + ")", 2 );
    form.rect(
        new Rectangle( space.size.$multiply( 0.25, (ypos += 0.05) ) ).to( space.size.x * 0.75, space.size.y * (ypos += 0.1) )
    );

    form.stroke( "rgba(46, 67, 235, " + op2 + ")", 2 ).fill( "rgba(255, 255, 255, " + op1 + ")" );
    form.rect(
        new Rectangle( space.size.$multiply( 0.25, (ypos += 0.05) ) ).to( space.size.x * 0.75, space.size.y * (ypos += 0.2) )
    );
  },

  onMouseAction: function(type, x, y, evt) {
    if (type == "move") { // mouse moved

      op1 = y / space.size.y;
      op2 = 1 - y / space.size.y;
      op3 = Math.abs(space.center.y - y) / (space.center.y);
    }
  },

  // onSpaceResize is a callback to handle canvas size change
  onSpaceResize: function(w,h,evt) {
    setSizes();
  }
});


// 4. Start playing
space.bindMouse();
space.play();