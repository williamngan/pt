//// 0. Describe this demo
window.demoDescription = "Creating simplex noise. Work in progress";

//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space );


//// 2. Create Elements
var curve = new Curve();
var noise = new Noise();
noise.seed(0.04564903723075986);

function getNoiseDistance( noise, noiseIncrement, dist, layerRatio, magnify ) {

  // noise parameters
  var na = layerRatio;
  var nb = 1 - layerRatio;

  // get next noise
  var layerset = noise.simplex2d( (na)+noiseIncrement, (nb)+noiseIncrement );
  return dist * layerset * (0.5 + magnify*layerRatio);

}

//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.fill(false).stroke("#fff");
    var pts = [];
    var n1 = 0;
    var n2 = 0;

    for (var i=0; i<40; i++) {

      n1 += 0.1;
      n2 += 5;

      var dn = getNoiseDistance( noise, n1, 50, 1, 1 );
      pts[i] = new Vector( n2, dn + 500 );
      form.point( pts[i], 1, false );
    }

    form.line( new Line(0, 500).to(500, 500));
    form.polygon( pts, false );

  },

  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {

    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();