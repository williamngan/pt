//// 0. Describe this demo
window.demoDescription = "Nested rectangles created by pairs of points. When mouse position is within one of the rectangles, fill it with a color in a color gradient.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", "#c3cbd5" ).display();
var form = new Form( space );


//// 2. Create Elements

// A Nest is a kind of Pair, which also contains nested pairs
function Nest() {
  Pair.apply( this, arguments ); // call Pair's constructor
  this.inner = [];
  this.color = new Pair().to(255,255,255);
}
Util.extend( Nest, Pair ); // extends Pair class

// create nested pairs recursively
Nest.prototype.nest = function( outer ) {
  if (this.inner.length > 10) return;

  var a = outer.size().$divide( 5 + Math.random() * 10, 10 + Math.random() * 15 );
  var b = outer.size().$divide( 5 + Math.random() * 10, 10 + Math.random() * 15 );
  var inner = new Pair( outer.$add( a ) ).to( outer.p1.$subtract( b ) );

  this.inner.push( inner );
  this.nest( inner );
};

Nest.prototype.init = function(id) {
  // 2-stop linear color gradient defined as a pair
  this.color = new Pair( Color.parseHex(colors["a"+id], true) ).to( Color.parseHex(colors["a"+(id+1)], true) );

  this.nest( this );
  return this;
};

// draw nested pairs when space animates.
Nest.prototype.animate = function(time, fps, context) {
  for (var i=0; i<this.inner.length; i++) {

    // determine fill color by checking if mouse is within bounds
    var fill = false;
    if ( this.inner[i].withinBounds( mouse ) ) fill = new Color( this.color.interpolate( i/this.inner.length ) ).rgb();
    form.fill( fill ).stroke( ((fill) ? fill : "#fff") , 0.5 ).rect( this.inner[i] );
  }
};

var mouse = new Vector( space.size.$divide(3, 2));

var h = space.size.y/3;
space.add( new Nest().to( space.size.x, h ).init(1) );
space.add( new Nest( 0, h ).to( space.size.x, h*2 ).init(2) );
space.add( new Nest( 0, h*2 ).to( space.size.x, h*3 ).init(3) );



//// 3. Visualize, Animate, Interact
space.add({
  onMouseAction: function(type, x, y, evt) {
    if (type=="move") {
      mouse.set(x,y);
    }
  },
  animate: function() {}
});


// 4. Start playing
space.bindMouse();
space.play();