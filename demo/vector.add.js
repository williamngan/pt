//// 0. Describe this demo
window.demoDescription = "3 vectors originate from center, and one of them follows the mouse position. Calculate the vector additions and subtractions between them.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
}
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space.ctx );


//// 2. Create Elements
var center = new Vector(space.size.$divide(2));
var mouse = new Vector( space.size.x/2, space.size.y/1.35);
var vec1 = new Vector( -space.size.x/4.2, -space.size.y/5.7 );
var vec2 = new Vector( space.size.x/3.2, -space.size.y/7.5 );


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.stroke("#9ab");

    // mouse vector. Gray line.
    var mouseVec = mouse.$subtract( center );
    form.line( new Line( center ).to( mouseVec.$add( center ) ) );

    form.stroke("#fff");

    // Two fixed vectors vec1 and vec2, connected to center as blue lines.
    form.stroke( colors.b1, 2 );
    form.line( new Line( center ).to( vec1.$add( center ) ) );
    form.line( new Line( center ).to( vec2.$add( center ) ) );

    // vector addition between mouse vector and vec1/vec1, and then connect to center as red line.
    form.stroke( colors.a1 );
    var add1 = vec1.$add( mouseVec );
    form.line( new Line( center ).to( add1.$add( center ) ) );
    var add2 = vec2.$add( mouseVec );
    form.line( new Line( center ).to( add2.$add( center ) ) );

    // vector subtraction between mouse vector and vec1/vec1, and then connect to center as green line.
    form.stroke( colors.a2 );
    var sub1 = vec1.$subtract( mouseVec );
    var subline1 = new Line( center ).to( sub1.$add( center ) );
    form.line( subline1 );
    var sub2 = vec2.$subtract( mouseVec );
    var subline2 = new Line( center ).to( sub2.$add( center ) );
    form.line( subline2 );

    // add the subtracted vectors to mouse position instead of to center. White lines.
    form.stroke( colors.b3, 1 );
    var sub3 = vec1.$subtract( mouseVec );
    var subline3 = new Line( mouse ).to( sub3.$add( mouse ) );
    form.line( subline3 );
    var sub4 = vec2.$subtract( mouseVec );
    var subline4 = new Line( mouse ).to( sub4.$add( mouse ) );
    form.line( subline4 );

    // Draw mouse
    form.fill( colors.a1).stroke(false);
    form.point( mouse, 5, true );

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  }
});


// 4. Start playing
space.bindMouse();
space.play();