//// 0. Describe this demo
window.demoDescription = "Distribute points evenly on a surface. Check the quadrant of each point in relation to mouse position. Draw a corresponding corner for each point.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef",
  c1: "#111", c2: "#567", c3: "#abc", c4: "rgba(255,255,255,.9)"
}
var space = new CanvasSpace("point-quadrant-demo", colors.c1 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var pts = [];
var mouseP = new Vector();

var gap = {x: Math.floor( (space.size.x-20)/10), y: Math.floor( (space.size.y-20) /20)};
for (var i=0; i<gap.x; i++) {
  for (var j=0; j<gap.y; j++) {
    pts.push(new Vector( 10+gap.x*i, 10+gap.y*j));
  }
}

// Get a line indicating the quadrant
function cornerLine(p, quadrant, size) {

  switch (quadrant) {
    case Const.top_left: return new Pair(p).to(p.$add(size, size));
    case Const.top_right: return new Pair(p).to(p.$add(-size, size));
    case Const.bottom_left: return new Pair(p).to(p.$add(size, -size));
    case Const.bottom_right: return new Pair(p).to(p.$add(-size, -size));
    case Const.top: return new Pair(p).to(p.$add(0, size));
    case Const.bottom: return new Pair(p).to(p.$add(0, -size));
    case Const.left: return new Pair(p).to(p.$add(size, 0));
    default: return new Pair(p).to(p.$add(-size, 0));
  }
};

// Draw the points
function draw() {

  for (i=0; i<pts.length; i++) {

    // draw corners
    var q = mouseP.quadrant(pts[i], 2);
    var ln = cornerLine(pts[i], q, 12);

    form.stroke( colors["a"+(q%4+1)], 1.5);
    form.line( new Pair(ln.p1.x, ln.y).to( ln.x, ln.y) );
    form.line( new Pair(ln.x, ln.y).to( ln.x, ln.p1.y) );

    // draw point
    form.fill( colors.c4 ).stroke( false );
    form.point( ln.p1, 3, true);
  }

};


//// 3. Visualize, Animate, Interact

// Add an actor object into space
space.add({

  animate: function(time, fps, context) {
    draw();
  },

  onMouseAction: function(type, x, y, evt) {
    if (type === "move") {
      mouseP.set(x, y);
    }
  }

});


// 4. Start playing
space.bindMouse();
space.play();