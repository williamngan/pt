//// 0. Describe this demo
window.demoDescription = "A set of points records the mouse trail as the mouse moves. When mouse is down and dragging, the trail will extend. When released, the trail gradually shortens.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
}
var space = new CanvasSpace( "pt" ).setup( {bgcolor: colors.a4} );
var form = new Form( space );


//// 2. Create Elements

// A Chain is a kind of Curve, which is a set of points
function Chain() {
  Curve.apply( this, arguments );

  this.hold = false; // whether mouse is pressed
  this.lineSize = 0.2;
}
Util.extend( Chain, Curve ); // extends Curve class

// to animate the chain in Space
Chain.prototype.animate= function(time, fps, context) {

  form.stroke("#222", this.lineSize, "round");

  // draw the points as catmull-rom curve
  form.curve( this.catmullRom(5) );

  // shorten the chain gradually
  if ( !this.hold ) {
    if (this.lineSize > 0.3) this.lineSize -= 0.2;
    if (this.points.length > 30) this.disconnect( Math.floor(this.points.length/100) );
  }
};

// to track mouse actions in Space
Chain.prototype.onMouseAction = function(type, x, y, evt) {

  // when mouse move, add a point to the trail
  if (type == "move") {
    this.to(x,y);
    if (this.hold) this.lineSize += 0.02;
  }

  // check whether mouse is down
  if (type == "down") {
    this.hold = true;
  } else if (type == "up" || type == "out") {
    this.hold = false;
  }
};

Chain.prototype.onTouchAction = Chain.prototype.onMouseAction;


//// 3. Visualize, Animate, Interact

// add a new Chain to Space
space.add( new Chain() );


// 4. Start playing
space.bindMouse(); // bind mouse events
space.bindTouch();
space.play();