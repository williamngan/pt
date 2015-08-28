//// 0. Describe this demo
window.demoDescription = "Interpolate each side of a rectangle, and use the interpolated point on each side to define an inner rectangle.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b3 ).display();
var form = new Form( space );


//// 2. Create Elements
var w = Math.min( space.size.x, space.size.y ) * 0.4;
var center = space.size.$divide(2);

var lastAngle = 0;
var t = 0;
var count = 0;

var a = center.$subtract( w, w );
var b = center.$add( w, w );

// first rectangle
var ps = [
  new Pair(a).to(b.x, a.y),
  new Pair(b.x, a.y).to(b),
  new Pair(b).to(a.x, b.y),
  new Pair(a.x, b.y).to(a)
];

// create a list of interpolated pairs from a list of original pairs
function interpolatePairs( _ps, t1, t2 ) {
  var pn = [];
  for (var i=0; i<_ps.length; i++) {
    var next = (i==_ps.length-1) ? 0 : i+1;
    pn.push( new Pair( _ps[i].interpolate( t1 ) ).to( _ps[next].interpolate( 1-t2 ) ) );
  }
  return pn;
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    t = Math.sin( (count++ % 360) * Const.deg_to_rad ); // cycle through 360

    form.fill( "#fff" ).stroke( false ).polygon( ps );

    var ps2 = []; // 4 pairs are interpolated at 0.1 and 0.9 of first rectangle's sides
    form.stroke( "#abc", 0.5 );
    for (var i = 0; i < ps.length; i++) {
      ps2[i] = new Pair( ps[i].interpolate( 0.1 + (t * 0.1) ) ).to( ps[i].interpolate( 0.9 + (t * 0.1) ) );
      form.line( ps2[i] );
    }

    // interpolate inner rectangles
    var tt = 0.5 + 0.5 * t;

    var ps3 = interpolatePairs( ps2, 0.2, 0.8 );
    form.fill( colors.a3 ).stroke( false ).polygon( ps3 );

    var ps4 = interpolatePairs( ps3, 1 - tt, tt );
    form.fill( false ).stroke( colors.a4 ).polygon( ps4 );

    var ps5 = interpolatePairs( ps4, 1 - tt, 1 - tt );
    form.stroke( "#fff", 1 ).polygon( ps5 );

    form.stroke( "rgba(255,255,255,.2" ).lines( ps5 );

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      var vec = center.$subtract( x, y );
      ang = Util.boundRadian( vec.angle(), true );

      for (var i=0; i<ps.length; i++) {
        ps[i].rotate2D( ang-lastAngle, center );
      }

      lastAngle = ang;
    }
  }
});

// 4. Start playing
space.bindMouse();
space.play();