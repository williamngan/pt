//// 0. Describe this demo
window.demoDescription = "Radiating rectangles in HSL color scheme, whose colors are shifted based on its position and mouse position. With homage to Josef Albers.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );
form.stroke( false );


//// 2. Create Elements
var quads = {topleft: [], topright: [], bottomleft: [], bottomright: []};
var center = space.size.$divide(2);
var mouse = new Color(0,0,0,1,"hsl");

var steps = 10;
var step = center.$divide( steps );
var scale = 0.5;

// create rectangles in each quadrant
for (var i=0; i<steps; i++) {
  var tl = new Rectangle( step.$multiply( i ) ).to( center );
  quads.topleft.push( tl );
  quads.topright.push( tl.clone().moveBy( step.x * (steps-i), 0 ) );
  quads.bottomleft.push( tl.clone().moveBy( 0, step.y * (steps-i) ) );
  quads.bottomright.push( tl.clone().moveBy( step.x * (steps-i), step.y * (steps-i) ) );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    var cstep = 20;

    // go through each step
    for (var i=0; i<steps; i++) {

      // base color for this step
      var color = new Color( Math.floor(90/(i+1)), 0.2, 1-(i+1)/steps * 0.7, 1, 'hsl');

      color.add( mouse ); // shift color for top-left
      form.fill( color.rgb() );
      form.rect( quads.topleft[i] );

      color.x += (cstep + cstep*scale); // shift color for bottom-right
      form.fill( color.rgb() );
      form.rect( quads.bottomright[i] );

      color.x += (cstep + cstep*scale); // shift color for top-right
      form.fill( color.rgb() );
      form.rect( quads.topright[i] );

      color.x += (cstep + cstep*scale); // shift color for bottom-left
      form.fill( color.rgb() );
      form.rect( quads.bottomleft[i] );

    }
  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      // angle from center shifts the hue, and distance from center shifts then saturation
      var vec = center.$subtract(x,y);
      scale = (vec.magnitude() / space.size.y);
      mouse.set( Const.rad_to_deg * Util.boundRadian( vec.angle(), true ), scale/1.5,  0 )
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();