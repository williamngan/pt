//// 0. Describe this demo
window.demoDescription = "Draw shapes based on the size of space. Resize the window and the drawing will update.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("canvasspace-resize-demo", colors.b1 ).display();
var form = new Form( space );


//// 2. Create Elements
var center = new Vector();
var line1 = new Line();
var line2 = new Line();
var rect = new Rectangle();


//// 3. Visualize, Animate, Interact
space.add({

  animate: function(time, fps, context) {

    // draw inner rectange
    form.stroke(false);
    form.fill(colors.a3);
    form.rect( rect );

    // draw lines
    form.stroke("#ff0");
    form.line( line1 );
    form.stroke("#fff");
    form.line( line2 );

    // draw measurements
    form.fill("#fff");
    var size = center.$multiply(2);
    form.font(space.size.y/5);
    form.text( new Point( 10, center.y+space.size.y/20), Math.floor( size.y ) );
    form.font(20);
    form.text( new Point( center.x, 20), Math.floor( size.x ) );

  },

  // handler for Space resize
  onSpaceResize: function(x, y, evt) {

    // center is at half size
    center.set(x/2, y/2);

    var shift = x/10;
    line1.set(x/2 + shift, 0);
    line1.p1.set(x/2 - shift, y);

    line2.set(0, y/2 - shift);
    line2.p1.set(x, y/2 + shift);

    rect.size( x/2, y/2 );
    rect.setCenter( x/2, y/2 );
  }
});



// 4. Start playing
space.play();