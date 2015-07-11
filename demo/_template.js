//// 0. Describe this demo
window.demoDescription = "";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements




//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

  },
  onMouseAction: function(type, x, y, evt) {

  }
});


// 4. Start playing
space.bindMouse();
space.play();