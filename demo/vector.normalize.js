//// 0. Describe this demo
window.demoDescription = "Normalize the vector from center to mouse position. Use its direction to set a grid of vectors in various sizes.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space );


//// 2. Create Elements
var center = new Vector(space.size.$divide(2));
var mouse = new Vector( space.size.x/2, space.size.y/1.35);
var spaceSize = space.size.magnitude()/2;

// define a grid of vectors
var gap = space.size.$subtract( 20, 20 ).divide( 10, 20 );
var vecs = [];
for (var i=0; i<=10; i++) {
  for (var j = 0; j <= 20; j++) {
    vecs.push( new Vector( 10 + gap.x * i, 10 + gap.y * j ) );
  }
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // calculate the normalized vector from center to mouse position
    var direction = mouse.$subtract( center).normalize();
    form.stroke( colors.a4 );
    form.line( new Line( center ).to( mouse ) );

    // draw a grid of vectors, whose direction follows the mouse and magnitude is related to its position from center.
    form.stroke( "#fff" );
    for (var i=0; i<vecs.length; i++) {
      var mag = vecs[i].distance( center ) / spaceSize;
      form.line( new Line( vecs[i] ).to( direction.$multiply( mag * 30 )).relative() );
    }

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