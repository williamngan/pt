//// 0. Describe this demo
window.demoDescription = "A test of drawing svg shapes using SVGSpace and SVGForm. ";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var space = new SVGSpace("pt", ready).setup({bgcolor: colors.b3});
var form = new SVGForm( space );


//// 2. Create Elements
var diagonal = new Pair().to(space.size );

var pts = [];
for (var i=1; i<10; i++) {
  pts.push( diagonal.interpolate( i / 10 ) );
}
var mouse = new Vector(20, 20);



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // reset the item counts
    form.enterScope( this );

    for (var i=0; i<pts.length; i++) {
      pts[i].add( (Math.random()-Math.random())*2, 0)
    }

    form.stroke( "#ccc" ).fill( "rgba(0,0,0,.2)" );
    form.line( diagonal );
    form.points( pts );
    form.point( pts[0], 10, true );

    form.stroke( false ).fill( "rgba(0,255,80,.1)" );
    form.rect( new Pair( pts[0] ).to( mouse ) );

    form.fill( false ).stroke( "#F99" );
    form.circle( new Circle( pts[2] ).setRadius( 20 ) );
    form.triangle( new Triangle( mouse ).to( pts[3], pts[4] ) );

    form.fill( false ).stroke( "#99F", 5 );
    form.polygon( new PointSet().to( [pts[4], pts[5], mouse, pts[6]] ).toArray(), false );

    form.fill( "rgba(255,255,255, .5)" ).stroke( false, 1 );
    form.polygon( new PointSet().to( [pts[6], pts[8],  pts[7], pts[2], pts[1]] ).toArray(), true );

    // Curve is currently drawn as a series of straight line segments. Later on these will be converted to proper svg <path>
    form.fill( false ).stroke( "#666" );
    form.curve( new Curve().to(pts).catmullRom() );


    form.fill("#abc").stroke(false);
    form.font(60, "Times New Roman");
    form.text( mouse, mouse.x+", "+mouse.y );
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
// Here we need to make sure the svg dom is ready first, via callback function (see constructor SVGSpace(...))
function ready(bounds, elem) {
  form.scope("item", elem ); // initiate the scope which uses the svg dom as parent node
  space.bindMouse();
  space.bindTouch();
  space.play();
}