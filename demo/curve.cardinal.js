//// 0. Describe this demo
window.demoDescription = "Two series of points oscillate in waves. Draw a curve that connects the points, and adjust the curve's tension.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );
form.fill(false);

//// 2. Create Elements
var unit = space.size.$divide(10);
var sizes = []; // amplitude
var tension = 0.5;
var tensionStep = 0;

// cardinal curve points
var pts = [];
for (var i=0; i<12; i++) {
  pts.push( new Vector(unit.x*3.5, unit.y + unit.y*i/1.5));
  sizes.push( Math.sin( i*Const.half_pi ) * unit.x * (i / 12) )
}

var curve = null; // Curve


//// 3. Visualize, Animate, Interact
space.add( {
  animate: function ( time, fps, context ) {

    // draw curve's white shadow
    if (curve) {
      curve.moveBy( 20, 20 );
      form.stroke( false ).fill( "#fff" ).polygon( curve.cardinal() );
    }

    // generate curve points
    var curve1 = [];
    var curve2 = [];

    for (var i = 0; i < pts.length; i++) {
      curve1.push( pts[i].$add( sizes[i], 0 ) );
      curve2.push( pts[i].$add( sizes[i] * -1 + unit.x * 3, unit.y / 2 ) );

      // draw stripes between corresponding points on the curve
      if (i > 0 && i < pts.length - 1) {
        form.stroke( ((i % 2 === 0) ? colors.a2 : colors.a4), 10 ).line( new Line( curve1[curve1.length - 1] ).to( curve2[curve2.length - 1] ) );
      }
    }

    // cardinal curve tension
    tensionStep++;
    tension = 0.5 + 0.5 * Math.sin( tensionStep % 360 * Const.deg_to_rad );

    // draw cardinal curve
    curve = new Curve().to( curve1.concat( curve2.reverse() ) );
    form.fill( false ).stroke( "#89a", 10 ).polygon( curve.cardinal( 10, tension ) );

  },

  onMouseAction: function ( type, x, y, evt ) {
    var d = space.size.$divide( 2 ).subtract( x, y );
    var angle = Const.two_pi * (d.y / (unit.y * 5));

    // calculate curve amplitude by sine wave
    for (var i = 0; i < pts.length; i++) {
      sizes[i] = Math.sin( angle + i * Const.half_pi ) * unit.x * (i / pts.length);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();