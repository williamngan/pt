//// 0. Describe this demo
window.demoDescription = "Scale a series of points on a path from an anchor, and get its reflection from other path. Connect each point and its reflected point with a line.";

//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b3 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var path = new Line().connect( space.size );
var path2 = new Line( space.size.$multiply(0.9, 0) ).connect( space.size.$multiply(0, 0.9) );
var mouse = new Vector( space.size.$divide(2) );
var spaceSize = space.size.magnitude();

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.stroke("rgba(255,255,255,.7)", 3);
    form.lines( [path, path2] );

    var normal = path.getPerpendicularFromPoint( mouse );
    var normalSize = normal.$subtract(mouse).magnitude() / (spaceSize/4);

    var normal2 = path2.getPerpendicularFromPoint( mouse );
    var normalSize2 = normal2.$subtract(mouse).magnitude() / (spaceSize/4);
    var num = 15;

    // 15 points evenly distributed on path
    for (var i=1; i<num; i++) {

      // find each point and its reflection, and scale them
      var p = path.interpolate( i/num ).scale2D( normalSize, normalSize, path.interpolate(0.4) );
      var _p = p.clone().reflect2D( path2 );

      var p2 = path2.interpolate( i/num ).scale2D( normalSize2, normalSize2, path2.interpolate(0.6) );
      var _p2 = p2.clone().reflect2D( path );

      // draw each point and connect a line to its reflection
      form.stroke(false).fill(colors.a1);
      form.point(p, 20*normalSize, true);

      form.stroke(colors.a1, 2).fill(false);
      form.point(_p, 10*normalSize/2, true );

      form.stroke("rgba(0,0,0,.1)", 1);
      form.line( new Line(p).connect(_p) );

      form.stroke(colors.a2);
      form.line( new Line(p2).connect(_p2) );

      form.stroke(false).fill(colors.a2);
      form.point(p2, 15*normalSize2, true );

    }

    // draw mouse point
    form.stroke(colors.a1);
    form.line( new Line( mouse).connect( normal ) );
    form.stroke(colors.a2);
    form.line( new Line( mouse).connect( normal2 ) );

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