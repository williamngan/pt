//// 0. Describe this demo
window.demoDescription = "A series of vector connecting together, each rotating in a angle a bit more than the previous one. They also rotate around the mosue position when toggled by mouse click.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b2 ).display();
var form = new Form( space );


//// 2. Create Elements
var center = space.size.$divide(2);
var mouse = space.size.$divide(3);
var r = 50;
var rotateAroundMouse = false;

var dot = mouse.$subtract(5);

function nextVector( i, ang, r ) {
  var angle = ang * 1.01;
  var size = r * 1;
  return { angle: angle, size: size, vec: new Vector( size*Math.cos( angle ), size*Math.sin( angle ) ) };
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    var dir = (mouse.y-center.y > 0) ? 1 : -1;
    var a = Math.abs( Util.boundRadian( (mouse.y-center.y) / (space.size.y/2) ) * 4 ) * dir;
    var last = { vec: center, size: 2, angle: a };

    for (var i=0; i<200; i++) {

      var c = colors["a"+(i%4 + 1)];
      form.stroke( c, 40 * (300-i)/200 );

      var next = nextVector( i, last.angle, last.size );
      next.vec.add( last.vec );

      // rotate around mouse position as anchor, if rotateAroundMouse is true
      if (rotateAroundMouse) { next.vec.rotate2D( next.angle/80, mouse ); }

      form.line( new Line( last.vec ).to( next.vec) );
      last = next;
    }

    // rotate a dot around mouse point
    dot.rotate2D( Const.one_degree, mouse );
    if (dot.distance(mouse) > 5) dot.add( mouse.$subtract(dot).divide(100) );
    form.fill("#222").stroke("#fff");

    form.point( dot, 5, true );

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    } else if (type=="up") {
      rotateAroundMouse = !rotateAroundMouse;
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();