//// 0. Describe this demo
window.demoDescription = "A series of points forming a fibonacci spiral disc, distorted by mouse position, and connected as delaunay triangles.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.a2 ).display();
var form = new Form( space );
form.fill( false );


//// 2. Create Elements
var mouse = new Circle( space.size.$divide(2) ).setRadius(50);
var pts = fibonacci(150, space.size.x/2, space.size.$divide(2), 2);
var de = new Delaunay();


// Generate fibonacci spiral points
function fibonacci( num, scale, offset, smooth ) {
  if (!smooth) smooth = 0;
  var b = Math.round( smooth * Math.sqrt( num ) );
  var phi = (Math.sqrt( 5 ) + 1) / 2;
  var pts = [];
  for (var i = 0; i < num; i++) {
    var r = (i > num - b) ? 1 : Math.sqrt( i - 0.5 ) / Math.sqrt( num - (b + 1) / 2 );
    var theta = 2 * Math.PI * i / (phi * phi);
    pts.push( new Vector( r * scale * Math.cos( theta ), r * scale * Math.sin( theta ) ).add( offset ) );
  }
  return pts;
}

//// 3. Visualize, Animate, Interact
space.add( {
  animate: function ( time, fps, context ) {

    // rescale the points based on mouse position to each point
    var _pts = [];
    for (var i = 0; i < pts.length; i++) {
      var _p = pts[i].clone();
      var dist = (mouse.radius - pts[i].distance( mouse )) / mouse.radius;
      _p.scale2D( 1 + dist, 1 + dist, mouse );
      _pts.push( _p );
    }

    // regenerate delaunay triangles
    de.points = _pts;
    de.generate();

    // draw points, triangles and circumcircles
    form.stroke( false ).fill( "#fff" ).points( de.points, 7, true );
    form.fill( false );

    for (i = 0; i < de.mesh.length; i++) {
      form.stroke( colors.a4 );
      form.circle( de.mesh[i].circle );
    }

    for (i = 0; i < de.mesh.length; i++) {
      form.stroke( colors.a1 );
      form.triangle( de.mesh[i].triangle );
    }

  },

  onMouseAction: function ( type, x, y, evt ) {
    if (type == "move") {
      mouse.set( x, y );
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();