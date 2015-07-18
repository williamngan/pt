//// 0. Describe this demo
window.demoDescription = "Draw a series of perpendicular lines along a diagonal path to visualize sine waves.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b2 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var line = new Line( space.size.x * 0.3, 0 ).connect( space.size.x * 0.8, space.size.y );
var steps = 100;
var amp = Math.min( space.size.x, space.size.y ) / 4;
var angle = 0;


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // for each step, draw a perpendicular line on the path, whose length is derived from a sine wave.
    for (var i=0; i<steps; i++) {
      var t = i/steps;
      var ln = line.getPerpendicular( t, Math.sin( t*1.2*Const.two_pi + angle )* amp );
      var ln2 = line.getPerpendicular( t+0.5/steps, Math.cos( t*1.2*Const.two_pi + angle )* amp );
      form.stroke(colors.a1).line( ln );
      form.stroke(colors.a3).line( ln2 );
    }

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      angle = y/space.size.y * 2 * Const.two_pi; // change starting angle
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();