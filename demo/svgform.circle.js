//// 0. Describe this demo
window.demoDescription = "Particle demo in SVG, with minimal change from the canvas version.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new SVGSpace("pt", ready).setup({bgcolor: "#223"});
var form = new SVGForm( space );


//// 2. Create Elements

var wall = new Line( space.size.$multiply( 0.33, 0.33)).to( space.size.$multiply(0.66, 0.66) );
var bound = new Pair().to( space.size );

// A Ball is a kind of Particle
function Ball() {
  Particle.apply( this, arguments );
}
Util.extend( Ball, Particle );

// animate this ball
Ball.prototype.animate = function( time, frame, ctx ) {
  form.getScope(this); // Distinguish each ball's scope (id attribute prefix)
  this.play(time, frame);
  form.stroke( false).fill(this.color);
  form.point( this, this.radius, true);
};

// Particle use RK4 to integrate by default. Here we change it to Euler which is faster but less accurate.
Ball.prototype.integrate = function(t, dt) {
  this.integrateEuler(t, dt);

  // check collision with other balls
  for (var i=0; i<balls.length; i++) {
    if ( balls[i].id !== this.id && this.hasIntersect( balls[i] )) {
      this.collideParticle2d( balls[i] );
    }
  }

  // check collisions with the wall and bounds
  this.collideLine2d( wall );
  this.collideWithinBounds( bound );
};


// Create 20 balls in random position, and hit it with a random initial impulse
var balls = [];
for (var i=0; i<20; i++) {
  var r = Math.random()*30 + 5;
  var px = Math.random()*(space.size.x - r*2) + r;
  var py = Math.random()*(space.size.y - r*2) + r;

  var p1 = new Ball( px, py );
  p1.radius = r;
  p1.mass = p1.radius;
  p1.id = i+1;
  p1.color = "rgba(0,0,0,."+(2+i%4)+")";

  p1.impulse( new Vector( (space.size.x/2-px)/((Math.random()*20)+2), (space.size.y/2-py)/((Math.random()*20)+2)) );

  space.add( p1 ); // add each ball to space to animate it
  balls.push( p1 );
}


//// 3. Visualize, Animate, Interact

// the Ball class has its own animate function. Here we just add another one to space for drawing the line.
space.add({
  animate: function(time, fps, context) {
    form.scope("wall"); // Distinguish the wall's scope (id attribute prefix)
    form.fill( false).stroke( colors.a1 );
    form.line( wall );
  }
});


// 4. Start playing
// Here we need to make sure the svg dom is ready first, via callback function (see constructor SVGSpace(...))
function ready(bounds, elem) {
  form.scope("item", elem ); // initiate the scope which uses the svg dom as parent node
  space.bindMouse();
  space.play();
}