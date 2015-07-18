//// 0. Describe this demo
window.demoDescription = "In a field of points that revolves around a center, trace a perpendicular path from each point to an axis line.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var pts = [];
var center = space.size.$divide(2);
var line = new Line(center).connect( space.size );

var count = 200;
var r = Math.min( space.size.x, space.size.y ) * 0.8;
for (var i=0; i<count; i++) {
  var p = new Vector( Math.random()*r-Math.random()*r, Math.random()*r-Math.random()*r );
  p.moveBy( center ).rotate2D( i*Math.PI/count, center );
  pts.push( p );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    for (var i=0; i<pts.length; i++) {

      // rotate the points slowly
      var pt = pts[i];
      pt.rotate2D( Const.one_degree / 20, center );
      form.stroke( false ).fill( colors["a" + (i % 4)] ).point( pt, 1 );

      // get line from pt to the mouse line
      var ln = new Line( pt ).connect( line.getPerpendicularFromPoint( pt ) );

      // opacity of line derived from distance to the line
      var opacity = Math.min( 0.8, 1 - Math.abs( line.getDistanceFromPoint( pt ) ) / r );
      form.stroke( "rgba(255,255,255," + opacity + ")" ).fill( false ).line( ln, 0.5 );
    }
  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      line.p1.set( x, y );
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();