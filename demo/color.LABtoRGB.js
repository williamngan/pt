//// 0. Describe this demo
window.demoDescription = "Create a gradient grid using L,a,b color space. The mouse position changes the a and b values.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );
form.stroke( false );


//// 2. Create Elements
var rects = [];
var cells = 10;
var unit = new Vector( space.size.$divide(cells));
var labA = 50;
var labB = 50;

for (var r=0; r<cells; r++) {
  for (var c=0; c<cells; c++) {
    var pos = unit.$multiply( c, r );
    var rect =  new Rectangle( pos ).to( pos.$add(unit).add(0.5) );
    var _ps = rect.corners();
    var tri = new Triangle( _ps.topLeft).to( _ps.bottomLeft, _ps.bottomRight );
    rects.push( { a: rect, b: tri } );
  }
}


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {
    for (var r=0; r<cells; r++) {
      for (var c = 0; c < cells; c++) {
        var i = r*cells + c;
        var lab = new Color(
          58,
          r/cells * 128 - 128 + labA,
          c/cells * 128 - 128 + labB,
          1, 'lab'
        );

        form.fill( lab.rgb() );
        form.rect(rects[i].a);

        lab.x = i/rects.length * 15 + 60;
        form.fill( lab.rgb() );
        form.triangle(rects[i].b);
      }
    }

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      labA = x/space.size.x * 127;
      labB = y/space.size.y * 127;

    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();