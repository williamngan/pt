//// 0. Describe this demo
window.demoDescription = "A series of lines radiates from center, and a point moves up and down on each line. Find the points that defines an outer boundary, and draw that boundary.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new SVGSpace("demo", colors.b2 ).display( "#pt", ready);
var form = new SVGForm( space );
form.fill( false );


//// 2. Create Elements
var pts = [];
for (var i=0; i<100; i++) {
  pts[i] = new Vector( Math.random()*space.size.x/2 + space.size.x/4, Math.random()*space.size.y/2 + space.size.y/4);
}
var de = new Delaunay().to( pts );
de.generate();


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.getScope( this );
    form.stroke(false).fill(colors.a3).points( de.points, 3 );

    for (var i=0; i<de.mesh.length; i++) {
      form.stroke(colors.b1).fill(false);
      form.circle( de.mesh[i].circle );
      form.stroke(colors.a1).fill(false);
      form.triangle( de.mesh[i].triangle );
    }

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {

    }
  }
});


// 4. Start playing
function ready(w, h, dom) {
  form.scope("item", dom ); // initiate the scope which uses the svg dom as parent node
  space.bindMouse();
  space.play();
}