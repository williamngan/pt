//// 0. Describe this demo
window.demoDescription = "A point spins around the mouse position. As it moves, it traces out a line. Move the mouse very fast to break the continuous line.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.a2} );
var form = new Form( space );

space.clear();  // fill background once and then no more repaint
space.refresh(false);
form.fill( false ); // no fill by default


//// 2. Create Elements
var ang = 0;
var noise = 0;
var mouse = new Vector(space.size.x/2, space.size.y/2);
var lastPos = mouse.clone();

function spin() {
  // angles and radius
  ang += Const.one_degree * 2 * Math.random();
  noise += Const.one_degree * Math.random()*10 - Const.one_degree * Math.random()*7;
  var r = 50 *  Math.sin(noise);

  // next point
  var p = new Vector(  Math.cos(ang)*r, Math.sin(ang)*r );
  p.add(mouse);

  // break or continue drawing the line
  if (p.$subtract(lastPos).magnitude() < 20 ) {
    form.stroke( "rgba(255,255,255,.4)" );
    form.line( new Pair(lastPos).to( p ) );
  }

  lastPos.set( p );
}


//// 3. Visualize, Animate, Interact
space.add({

  animate: function(time, fps, context) {
    spin();
  },

  onMouseAction: function(type, x, y, evt) {
    if (type === "move") {
      mouse.set(x, y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();