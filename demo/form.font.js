//// 0. Describe this demo
window.demoDescription = "Loop through the alphabets in different font families. Font size changes based on the mouse position.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b3 ).display();
var form = new Form( space );


//// 2. Create Elements
var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // alphabets to switch every step
var fonts = ["Helvetica, sans-serif", "Georgia", "monospace"]; // fonts to switch every 26 steps
var count = 0;
var scale = 250;
var maxScale = 250;


//// 3. Visualize, Animate, Interact
space.add({

  animate: function(time, fps, context) {
    var c = Math.floor(count++ / Math.max(2, 20 * scale/maxScale));
    var char = c % 26;

    form.fill( colors.a3 );
    form.font( scale, fonts[ Math.floor( c / 26 ) % fonts.length ]);
    form.text( new Point(20, space.size.y/2), alphabets[char]+alphabets[char+26] );
  },

  onMouseAction: function(type, x, y, evt) {
    if (type == "move") { // mouse moved
      var halfh = space.size.y/2;
      scale = maxScale * (1 - Math.abs(y - halfh) / halfh); // calculate scale based on mouse position
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();