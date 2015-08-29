//// 0. Describe this demo
window.demoDescription = "Draw a triangle's inner and outer circles, and animate their changes when triangle's points change. Click to change a triangle's vertex position";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );
form.stroke( false );


//// 2. Create Elements
var center = space.size.$divide(2);
var unit = space.size.$divide(20);
unit = Math.min(unit.x, unit.y);
var triangle = new Triangle( center.$subtract(0, unit*5) ) .to( center.$add( -unit*5, unit*2),  center.$add( unit*5,  unit*5) )
var target = {vec: null, t: 1, p: 0};

var pointSelect = 0;
var timeInc = 0;

// move a triangle's point to new position
function setTarget(p) {
  if (!p) p = space.size.$multiply( Math.random(), Math.random() );
  timeInc++;
  target.p++;
  target.t = 0;
  target.vec = p;
}

//// 3. Visualize, Animate, Interact
space.add( {
  animate: function ( time, fps, context ) {

    // outer circle and first triangle
    form.stroke( false ).fill( "#fff" ).circle( triangle.circumcircle() );
    form.fill( colors.a4 ).triangle( triangle );

    // inner triangle
    var inner = triangle.medial();
    form.fill( "#fff" ).triangle( inner );

    // transition point to new position if needed.
    if (target.t < 1) {
      target.t += 0.01;
      var p = triangle.getAt( target.p % 3 );
      p.set( new Pair( p ).to( target.vec ).interpolate( target.t ) );

    } else if (time / 3000 > timeInc) { // every 3 seconds, make a switch
      setTarget();
    }

    // draw inner triangle's inner and outer circles
    form.stroke( "rgba(255,45,93,.5)", 20 ).fill( false ).circle( inner.circumcircle() );
    form.fill( colors.a3 ).stroke( false ).circle( inner.incircle() );

  },

  // on click, move a point to the mouse position
  onMouseAction: function ( type, x, y, evt ) {
    if (type == "up") {
      setTarget( new Vector( x, y ) );
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();