//// 0. Describe this demo
window.demoDescription = "Two rectangles filled and one rectangle stroked in different color. Their color opacity change with the mouse y position.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.a4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var rect1 = new Rectangle();
var rect2 = new Rectangle();
var rect3 = new Rectangle();
var op1 = 0.5;
var op2 = 0.5;
var op3 = 0.5;

function setSizes() {
  rect1.set( space.size.$multiply(0.25)).connect( space.center.x + space.size.x/4, space.center.y+space.size.y/8 );
  rect2.set( space.size.$multiply(0.75)).connect( space.center.x - space.size.x/4, space.center.y-space.size.y/8);
  rect3.set( space.size.$multiply(0.2, 0.3) ).connect( space.size.$multiply(0.8, 0.7) );
}

setSizes();

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

      form.stroke(false).fill( "rgba(150, 191, 237, "+op1+")" );
      form.rect( rect1 );

      form.fill( "rgba(46, 67, 235, "+op2+")" );
      form.rect( rect2 );

      form.fill(false).stroke( "rgba(255, 255, 255, "+op3+")", 2 );
      form.rect( rect3 );

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