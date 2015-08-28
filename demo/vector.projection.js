//// 0. Describe this demo
window.demoDescription = "Two vectors, one follows a pendulum, the other follows the mouse position. Calculate its projection vector and draw a perpendicular line.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );


//// 2. Create Elements
var last = 0;
var mouse = new Vector();
var center = space.size.$divide(2);
var pen = new Vector( 0, Const.half_pi, -9.806);


// A simple pendulum implementation from Rosettacode.org
// http://rosettacode.org/wiki/Animate_a_pendulum
function swing( dt ) {
  pen.x += (pen.z * Math.sin( pen.y ) * dt);
  pen.y += (pen.x * dt);
  return new Vector( Math.sin(pen.y), Math.cos(pen.y) );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // time change
    var dt = Math.min(0.1, (time - last)/1000);
    last = time;

    // Find pendulum position
    var pt = swing(dt).$multiply( space.size.x/3 ).add( center);
    var r = 15;

    // draw "screws"
    form.stroke( false );
    form.point( pt, 10, true ).point( center, 10, true );

    // connect lines
    form.stroke( "rgba(255,0,0,.3)", r*2 );
    form.line( new Line( center ).to( pt ) );

    form.stroke( "rgba(0,100,255,.3)", r*2 );
    form.line( new Line( center ).to( mouse ) );
    form.line( new Line( center ).to( mouse.$subtract(center).multiply(-0.5).add(center) ) );

    // Find mouse-to-pendulum projection vector and connect with a line
    var proj = mouse.$subtract( center ).projection( pt.$subtract( center ) );
    form.stroke( "rgba(255,255,0,.8)", r*2 );
    form.line( new Line( proj.$add( center ) ).to( pt ) );

    // draw "hinges"
    form.stroke( false ).fill( "rgba(0,0,0,.1)" );
    form.point( pt, r, true ).point( center, r, true ).point( proj.$add( center ), r, true );

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();