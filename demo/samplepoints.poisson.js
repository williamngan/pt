//// 0. Describe this demo
window.demoDescription = "Distribute a series of random points so that distance between the points are more or less equal.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space );
space.refresh(false);
space.clear( "#222");
form.stroke( false );

//// 2. Create Elements
var lastTime = 0;
var samples;
var shift = 0;

// initiate a new set of SamplePoints. SamplePoints is a kind of PointSet.
function init() {
  shift++;
  samples = new SamplePoints();
  samples.setBounds( new Rectangle( 25, 25 ).size( space.size.x - 25, space.size.y - 25 ), true );
  samples.poissonSampler( 6 ); // target 6px radius
}

init();

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // every 25ms, calculate and draw the next 50 points
    var count = 0;
    while (time - lastTime < 25 && count++ < 50) {
      var s = samples.sample(10, 'poisson');
      if (s) {
        form.fill( colors["a"+(Math.ceil(s.y/space.size.y * 3 + shift) % 4 + 1)] )
        form.point(s, Math.random()*0.5+0.5 );
        samples.to(s);
      }
    }
    lastTime = time;
  },
  onMouseAction: function(type, x, y, evt) {

    // reset when mouse up
    if (type=="up") {
      space.clear( "#222" );
      init();
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();
