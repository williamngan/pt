//// 0. Describe this demo
window.demoDescription = "A circle and a donut meets. Indicate their points of intersections.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.a4 ).display( "#pt");
var form = new Form( space );


//// 2. Create Elements
var touchPoints = new PointSet();
var touchMaxRadius = Math.min(space.size.x, space.size.y)/4;

var mouse = new Circle( space.size.$divide(2) ).setRadius( touchMaxRadius );
var mouse2 = new Circle( space.size.$divide(2) ).setRadius(  Math.min(space.size.x, space.size.y)/8 );
var circle = new Circle( space.size.$divide(2) ).setRadius( Math.min(space.size.x, space.size.y)/5 );


var _evt = null;

form.stroke( false );

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // draw circle and donut. Donut follows mouse position.
    form.fill( colors.a2 );
    form.circle( mouse, mouse.radius, true );

    form.fill( colors.a4 );
    form.circle( mouse2, mouse2.radius, true );

    form.fill( "rgba(50,50,50,.25)" );
    form.circle( circle, circle.radius, true );

    // Check intersections and draw the intersection points
    var ps = circle.intersectCircle( mouse );
    var ps2 = circle.intersectCircle( mouse2 );

    form.fill( colors.a1 );
    for (var i=0; i<ps.length; i++) { form.point( ps[i], 6, true); }

    form.fill( "#fff" );
    for (i=0; i<ps2.length; i++) { form.point( ps2[i], 3, true); }


    form.stroke("#f00").fill( false );
    form.points( touchPoints.points, 30, true );
    form.polygon( touchPoints.points, false );
    form.stroke(false);

    if (_evt) {
      form.fill( "#000" ).text( new Vector( 20, 20 ), touchMaxRadius + "//" +touchPoints.count()+" -- "+_evt.touches.length + " ,"+_evt.changedTouches.length+".. "+_evt.targetTouches.length );
    }

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
      mouse2.set(x,y);
    }
  },
  onTouchAction: function(type, x, y, evt) {

    _evt = evt;
    touchMaxRadius = 20;

    touchPoints.clear();
    for (var i=0; i<evt.targetTouches.length; i++) {
      var t = evt.touches[i];
      touchPoints.to( t.pageX - space.boundRect.left, t.pageY - space.boundRect.top );
    }

    if (touchPoints.count() > 1) {
      touchMaxRadius = touchPoints.getAt(1).distance( touchPoints.getAt(0));
    } else {
      touchMaxRadius = Math.min(space.size.x, space.size.y)/4;
    }

    if (type=="move" && touchPoints.count() > 0) {
      mouse.set( touchPoints.getAt(0) );
      mouse.setRadius( touchMaxRadius );
      mouse2.set( touchPoints.getAt(0) );
      if ( touchPoints.count() > 2 ) circle.set( touchPoints.getAt(2) );
      if ( touchPoints.count() > 3 ) {
        var dist = touchPoints.getAt(3).distance( touchPoints.getAt(2))
        circle.setRadius( dist );
      }
    }
  }

});


// 4. Start playing
//space.bindMouse();
space.bindTouch();
space.play();