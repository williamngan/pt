//// 0. Describe this demo
window.demoDescription = "A point emits particles that move randomly in space. The mouse exerts a gravitational pull on the particles.";


//// 1. Define Space and Form
var colors = {
  a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
  b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
};
var space = new CanvasSpace("demo", colors.b4 ).display();
var form = new Form( space );

space.refresh( false ); // no repaint per frame
form.stroke( false );


//// 2. Create Elements
var world = new ParticleSystem(); // a system to track the particles
space.add( world );

var mouse = new Particle(); // speckles to gravitate toward the mouse, which has a larger mass
mouse.mass = 100;

var lastTime = 0;

// A Speckle is a kind of Particle
function Speckle() {
  Particle.call( this, arguments );
  this.mass = 1;
}
Util.extend( Speckle, Particle );

// animate this speckle
Speckle.prototype.animate = function( time, frame, ctx ) {
  this.play(time, frame);
  form.point( this, 1);
  if (this.x < 0 || this.x > space.size.x || this.y < 0) {
    world.remove( this );
  }
};

// Particle use RK4 to integrate by default. Here we change it to Euler which is faster but less accurate.
Speckle.prototype.integrate = function(t, dt) {
  return this.integrateEuler(t, dt);
};

// calculate the forces
Speckle.prototype.forces = function( state, t ) {
  var brownian = new Vector( (Math.random()-Math.random())/30, (Math.random()-Math.random())/30 ); // random
  var g = Particle.force_gravitation( state, t, this, mouse ); // mouse gravity
  return {force: brownian.add(g.force)};
};


//// 3. Visualize, Animate, Interact
space.add({
  animate: function(time, fps, context) {

    // fill background
    form.fill("rgba(0,0,0,0.05)");
    form.rect( new Pair().to(space.size) );

    // fill speckles
    form.fill( "rgba(255,255,200,.1)" );

    // generate a new speckle every 25ms, remove when it's outside the space
    if (time-lastTime > 25 && world.particles.length<1000) {
      world.add( new Speckle(space.size.x/2, space.size.y/2) );
      lastTime = time;
    }
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