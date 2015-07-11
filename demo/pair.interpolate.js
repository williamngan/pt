//// 0. Describe this demo
window.demoDescription = "";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var steps = 10;
var area = space.size.$divide( 1, steps );

function createSteps() {
  var ps = [];
  for (var i = 0; i < steps; i++) {
    var left = Math.random() * 0.7;
    var right = left + (1 - left) * Math.random();
    var p = new Pair(area.$multiply(left, Math.random())).connect(area.$multiply(right, Math.random()));
    p.moveBy(0, area.y * i);
    ps.push(p);
  }
  return ps;
}

var pairsCurr = createSteps();
var pairsNext = createSteps();
var counter = 0;


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {


    for (var i=0; i<pairsCurr.length; i++) {

      var p = pairsNext[i].$subtract( pairsCurr[i] )
      var p2 = pairsNext[i].p1.$subtract( pairsCurr[i].p1 )
      //pairsCurr.add( p );
      //pairsCurr.p1.add( p2 );
      form.line( pairsCurr[i] );
      //form.line( pairsNext[i] );
    }

  },
  onMouseAction: function(type, x, y, evt) {

  }
});


// 4. Start playing
space.bindMouse();
space.play();