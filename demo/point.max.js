//// 0. Describe this demo
window.demoDescription = "A rectangular boundary is pinned by the minimum and maximum positions of a set of points. Move and click to change the points' positions.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
}
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space );


//// 2. Create Elements
var pts = [
  new Point( space.size.$divide(2) ),
  new Point( space.size.$divide(3) ),
  new Point( space.size.$divide(3).multiply(2) )
];
var rect = new Rectangle( pts[1]).to( pts[2] );
var nextRect = new Rectangle( pts[1]).to( pts[2] );


// Calculate min and max points, and set the rectangular bound.
function getMinMax() {
  var minPt = pts[0];
  var maxPt = pts[0];
  for (var i=1; i<pts.length; i++) {
    minPt = minPt.$min( pts[i] );
  }
  for (i=1; i<pts.length; i++) {
    maxPt = maxPt.$max( pts[i] );
  }
  nextRect.set( minPt).to( maxPt );
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.fill( false ).stroke( colors.a4, 5 );
    form.rect( rect );

    form.stroke( false ).fill( "#fff" );
    form.points( pts, 5, true );

    // transition rectangle to new position
    if (!rect.near(nextRect, 0.1)) {
      rect.add( nextRect.$subtract(rect).multiply(0.2) );
    }
    if (!rect.p1.near(nextRect.p1, 0.1)) {
      rect.p1.add( nextRect.p1.$subtract(rect.p1).multiply(0.2) );
    }

  },
  onMouseAction: function(type, x, y, evt) {

    if (type=="move") { // mouse mouve
      pts[0].set(x, y);
      getMinMax();

    } else if (type=="up") { // mouse click, pin the point

      pts.push( new Point(x, y) );
      if (pts.length > 5) {
        pts.splice(1, 1);
      }
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();