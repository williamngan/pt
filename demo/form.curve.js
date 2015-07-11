//// 0. Describe this demo
window.demoDescription = "Define 4 points which are the anchor and control points for different curves. Move the points to shift the curve.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var mouse = new Vector();
var threshold = 60;
var pts = [];
for (var i=0; i<4; i++) {
  pts.push( new Vector( space.size.x/2, (i+1) * space.size.y/5 ) );
}



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // red catmull rom curve
    form.stroke(colors.a1, 2);
    form.curve( new Curve().connect(pts).catmullRom() );

    // green cardinal curve with tension
    form.stroke(colors.a2, 2);
    form.curve( new Curve().connect(pts).cardinal( 15, 0.8) );

    // blue bezier curve with higher precision curver (20 steps)
    form.stroke(colors.a3, 2);
    form.curve( new Curve().connect(pts).bezier(20) );

    // fill color for points
    form.stroke(false).fill( "#fff" );

    for (var i=0; i<pts.length; i++) {
      form.point( pts[i], 5, true );

      // smaller than threshold distance, push it out
      if ( pts[i].distance(mouse) < threshold ) {
        var dir = pts[i].$subtract(mouse).normalize();
        pts[i].set( dir.multiply(threshold).add( mouse ) );

      // bigger than threshold distance, pull it in
      } else {
        var orig = new Vector( space.size.x/2, (i+1) * space.size.y/5 );
        pts[i].set ( orig.add( pts[i].$subtract(orig).multiply(0.9) ) );
      }
    }

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse = new Vector( x, y );
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();