//// 0. Describe this demo
window.demoDescription = "";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};

var space = new SVGSpace("demo", colors.b4 ).display("#pt", ready);
var form = new SVGForm( space.ctx );


//// 2. Create Elements
var diagonal = new Pair().to(space.size );

var pts = [];
for (var i=1; i<10; i++) {
  pts.push( diagonal.interpolate( i / 10 ) );
}
var p = new Vector(20, 20);
//var ps = [new Vector(10,10), new Vector(100,50), new Vector(30, 100)];
//var poly = [new Vector(100,10), new Vector(100,50), new Vector(50, 120), new Vector(50, 250)];
//var a = new Vector(350,20);



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // reset the item counts
    form.scope( "item" );

    for (var i=0; i<pts.length; i++) {
      pts[i].add( (Math.random()-Math.random())*2, 0)
    }

    form.stroke( "#ccc" ).fill( "rgba(0,0,0,.2)" );
    form.line( diagonal );
    form.points( pts );
    form.point( pts[0], 10, true );

    form.stroke( false ).fill( "rgba(255,0,0,.3)" );
    form.rect( new Pair( pts[0] ).to( pts[1] ) );

    form.fill( false ).stroke( "#F99" );
    form.circle( new Circle( pts[2] ).setRadius( 20 ) );
    form.triangle( new Triangle( p ).to( pts[3], pts[4] ) );

    form.fill( false ).stroke( "#99F", 5 );
    form.polygon( new PointSet().to( [pts[4], pts[5], p, pts[6]] ).toArray(), false );

    form.fill( "rgba(255,200,10, .4)" ).stroke( false, 1 );
    form.polygon( new PointSet().to( [pts[6], p, pts[8],  pts[7]] ).toArray(), true );


    form.fill( false ).stroke( "#666" );
    form.curve( new Curve().to(pts).catmullRom() );

    /*



     form.fill("#999").stroke(false);
     form.point( p, 5, true );
     form.points( ps );
     //
     form.stroke("#f00", 2);
     form.line( new Line(ps[0]).to(p) );
     //

     form.stroke("#999", 1);
     form.lines( [ new Line(ps[0]).to(ps[1]),  new Line(ps[1]).to(ps[2]),  new Line(ps[2]).to(ps[0])  ]);
     //
     form.stroke(false).fill("rgba(255,0,0,.2)");
     form.rect( new Pair(a).to(p) );

     form.circle( new Circle(a).setRadius(20) );

     form.triangle( new Triangle(p).to(ps[1], a ) );

     form.polygon( poly, true );

     var curve = new Curve();
     for (var i=0; i<poly.length; i++) {
     curve.to( poly[i]);
     }


     form.stroke("#333").fill(false);
     form.curve( curve.catmullRom() )


     form.stroke("#0f9").fill(false);
     var temp = poly.slice();
     temp.push( p.clone() );
     form.polygon( temp, false );

     */

  },
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      p.set(x,y);
    }
  }
});


// 4. Start playing
function ready(w, h, dom) {
  form.scope("item", dom );
  space.bindMouse();
  space.play();
  space.stop(3000);
}