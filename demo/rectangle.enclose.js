//// 0. Describe this demo
window.demoDescription = "Draw pairs of rectangles, each of which contains a static original and a moving clone. Then draw a rectangle to enclose each pair, and draw intersection points between the moving clones.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.b4} );
var form = new Form( space );


//// 2. Create Elements
var unit = space.size.$divide(20);
var mouse = new Vector( space.size.x/2, space.size.y/1.35);

var rects = [
    new Rectangle( unit.$multiply(2) ).to( unit.$multiply(12,5) ),
    new Rectangle( unit.$multiply(15, 1) ).to( unit.$multiply(18,8) ),
    new Rectangle( unit.$multiply(3, 7) ).to( unit.$multiply(6,9) ),
    new Rectangle( unit.$multiply(2, 10) ).to( unit.$multiply(6,14) ),
    new Rectangle( unit.$multiply(8, 7) ).to( unit.$multiply(13,11) ),
    new Rectangle( unit.$multiply(10, 12) ).to( unit.$multiply(16,15) ),
    new Rectangle( unit.$multiply(17, 10) ).to( unit.$multiply(19,12) ),
    new Rectangle( unit.$multiply(5, 16) ).to( unit.$multiply(18,18) )
];


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    var mag = mouse.distance( space.size.$divide(2) );
    var d1 = mouse.$subtract( space.size.$divide(2) ).divide(10);
    var shadows = [];

    // calculate rect's "shadow"
    for (var i=0; i<rects.length; i++) {
      var d2 = rects[i].center.$subtract( space.size.$divide( 2 ) );
      var d = (mag - rects[i].distance( space.size.$divide( 2 ) )) / mag;
      d = d / Math.abs( d ) * Math.min( 0.4, Math.abs( d ) );
      var shadow = rects[i].clone().moveBy( d1.$multiply(4).$add( d2 ).$multiply( d ) );
      shadows.push( shadow );

      // draw rectangle that encloses both rect and its shadow (union)
      form.stroke(  false ).fill( "rgba(255,255,255,.8)" ).rect( rects[i].$enclose( shadow ) );
    }

    // draw shadows and intersection poitns between shadows
    for (i=0; i<shadows.length; i++) {
      form.stroke( false ).fill( colors.a4 ).rect( shadows[i] );
      for (var s = 0; s < shadows.length; s++) {
        if (i != s) {
          var intersects = shadows[i].intersectRectangle( shadows[s] );
          if (intersects.length > 0) form.fill( colors.a3 ).points( intersects, 3, true );
        }
      }
    }

    // draw rects on top
    for (i=0; i<rects.length; i++) {
      form.stroke( colors.a3, 7 ).fill( false ).rect( rects[i] );
    }
  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  },

  onTouchAction: function(type, x, y, evt) {
    this.onMouseAction( type, x, y );
  }
});


// 4. Start playing
space.bindMouse();
space.bindTouch();
space.play();