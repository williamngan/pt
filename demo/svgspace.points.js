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
var p = new Vector(20, 20);
var ps = [new Vector(10,10), new Vector(100,50), new Vector(30, 100)];

var a = new Vector(350,20);



//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    form.scope("item");

    form.point( p, 5, true );
    form.points( ps );

    form.stroke("#f00", 2);
    form.line( new Line(ps[0]).to(p) );

    form.lines( [ new Line(ps[0]).to(ps[1]),  new Line(ps[1]).to(ps[2]),  new Line(ps[2]).to(ps[0])  ]);

    form.stroke(false).fill("rgba(255,0,0,.2)");
    form.rect( new Pair(a).to(p) )

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