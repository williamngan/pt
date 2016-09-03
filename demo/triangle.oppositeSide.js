//// 0. Describe this demo
window.demoDescription = "Start with a triangle in the center, and generate new triangles by unfolding it along one of its sides.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("pt").setup( {bgcolor: colors.b2} );
var form = new Form( space );



//// 2. Create Elements
var colorToggle = 0;

// Tri is a kind of Triangle which can generate new triangles by unfolding.
function Tri() {
  Triangle.apply( this, arguments );
  this.target = {vec: null, t: 0};
  this.vertices = ["p0","p1","p2"];
  this.colorId = 1 + (colorToggle % 3);
}
Util.extend( Tri, Triangle );

// implement animate callback function for Space. This will draw the triangle
Tri.prototype.animate = function( time, frame, ctx ) {

  // transition to target point if needed
  if (this.target.t <= 1 && this.target.vec) {
    this.set( new Pair( this ).to( this.target.vec ).interpolate( this.target.t ) );
    this.target.t += 0.05;
    if (this.target.t >= 1) this.target.vec = null;
  }

  // draw triangle and its vertices
  form.stroke( "#fff", 2 ).fill( colors["a" + this.colorId] ).triangle( this );
  for (var i = 0; i < this.vertices.length; i++) {
    form.stroke( false ).fill( colors["a" + this.colorId] ).point( this.getAt( this.vertices[i] ), 5, true );
  }
};

// implement onMouseAction callback function for Space. This checks intersection with vertex on mouse move
Tri.prototype.onMouseAction = function(type, x, y, evt) {
  if (type == "move") {
    this.checkVertex( x, y );
  }
};

Tri.prototype.onTouchAction = Tri.prototype.onMouseAction;

// remove a vertex when it's unfolded
Tri.prototype.removeVertex = function( id ) {
  var v = this.vertices.indexOf( id );
  if (v >= 0) this.vertices.splice( v, 1 );
};

// check if a vertex is on hover, if so, unfold a new triangle
Tri.prototype.checkVertex = function(x, y) {
  if (this.target.vec != null) return;
  for (var i = 0; i < this.vertices.length; i++) {
    var circle = new Circle( this.getAt( this.vertices[i] ) ).setRadius( 5 );
    if (circle.intersectPoint( x, y )) this.unfold( this.vertices[i] );
  }
};

// Create a new triangle by unfolding it along the opposite side of the selected vertex
Tri.prototype.unfold = function(id) {

  this.removeVertex( id ); // remove vertex since it's getting unfolded from this
  colorToggle++;

  // find reflection line and create new Tri
  var reflectLine = this.oppositeSide( id );
  var tri = new Tri( this.getAt( id ) ).to( reflectLine, reflectLine.p1 );
  tri.target.vec = this.$getAt( id ).reflect2D( reflectLine ); // targeted vertex for animation
  tri.removeVertex( "p0" );

  space.add( tri ); // add new Tri to space
};


// Create initial triangle
var center = space.size.$divide(2);
space.add( new Tri( center.$subtract(0, 50) ) .to( center.$add( -43.3, 25),  center.$add( 43.3, 25) ));


// 4. Start playing
space.bindMouse();
space.bindTouch();
space.play();