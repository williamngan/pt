window.demoDescription = "Visualize Hairy Ball Theorem: you can't comb a hairy ball flat without creating a cowlick";

var space = new CanvasSpace("demo", "#222" ).display();
var form = new Form( space.ctx );

var center = space.size.$divide(2);

// A Circle that follows mouse and comb the VectorLines
class Comb extends Circle {

  constructor( ...args ) {
    super( ...args );
    this.lastPos = new Vector();
    this.offset = new Vector();
    this.radius = 50;
  }

  move( x, y ) {
    this.lastPos.set( this );
    this.set( x, y );
    this.offset = this.$subtract( this.lastPos ).normalize();
    this.lastPos.set( x, y );
  }

  animate( time, frame, ctx ) {
  }

  // follow mouse movement
  onMouseAction( type, x, y, evt ) {
    if (type == "move") {
      this.move( x, y );
    }
  }
}

// create comb and add to space
var comb = new Comb();
space.add( comb );


// VectorLine is a hair-like point that can be "combed"
class VectorLine extends Vector {

  constructor( ...args ) {
    super( ...args );

    this.direction = new Vector(); // hair direction
    this.pointer = new Vector(); // hair

    this.pulled = false; // has it been pulled by comb
    this.moved = false; // has it been touched and not yet reset

    this.pull_power = 9;
    this.mag = 20;
    this.intensity = .3;

    this.resetTimer = -1;
  }

  initVec( ...args ) {
    this.direction.set( ...args ).normalize();
    this.pointer.set( ...args ).multiply( this.mag / 4 );
    return this;
  }

  animate( time, frame, ctx ) {

    var c = this.checkRange();
    form.stroke( c ).line( new Line( this ).to( this.pointer ).relative() );

    // reset to initial direction (when clicked)
    if (this.resetTimer >= 0) this.resetTimer+=frame;
    if (this.resetTimer > 0 && this.resetTimer < 2000) {
      var ang = center.$subtract( this ).angle();
      var dir = new Vector(Math.cos( ang ), Math.sin( ang ));
      this.direction.set( dir );
      this.pointer.add( dir ).divide( 1.2 );
    }
  }


  // track mouse up
  onMouseAction( type, x, y, evt ) {
    if (type == "up" && this.moved) {
      this.resetTimer = 0;
      this.moved = false;
    }
  }

  checkRange() {

    let color;

    // pull it when intersecting with comb
    if (comb.intersectPoint( this.x, this.y )) {
      this.intensity = 0.5;
      let dm = 1 - (this.distance( comb ) / comb.radius);

      this.pull_power = this.pull_power > 0 ? this.pull_power - 0.25 : 0;
      this.pointer.add( comb.offset.$multiply( dm * this.pull_power ) );
      this.direction.set( this.pointer ).normalize();
      this.pulled = true;
      this.moved = true;

      color = `rgba(${ Math.ceil(this.pointer.y/comb.radius * 100 + 150) }, 50, ${Math.ceil(this.pointer.x/comb.radius * 100 + 150)}`;

    // not pulled
    } else {

      this.pull_power = 9; // reset pull power

      if (this.pulled) { // transition back to maximum magnitude value
        let _mag = this.pointer.magnitude();
        if (_mag > this.mag) {
          this.pointer.set( this.direction.$multiply( _mag * 0.95 ) );
        } else {
          this.pulled = false;
        }
        this.intensity = Math.min( 0.4, Math.max( 5, _mag / (this.mag * 5) ) );
      }

      color = (this.pointer.y > 0) ? "rgba(255,0,50" : "rgba(255,210,230"
    }

    return `${color},${this.intensity})`;
  }
}


// SamplePoints is a kind of PointSet in pt.ext. It distributes a set of points and optimizes for uniform distance.
var samples = new SamplePoints();
samples.setBounds(new Rectangle().size(space.size.x, space.size.y), true);
samples.poissonSampler(5); // target 5px radius
var lastTime = 0;
var counter = 0;

// fill canvas in white initially and no refresh
space.refresh( false );
space.clear("#222");

space.add({
  animate: function(time, frameTime, ctx) {

    if (counter > 3000) { // to complete at 3000 points
      for (var i = 0; i < samples.count(); i++) {
        form.point( samples.getAt( i ), 2, true );
        let vecline = new VectorLine( samples.getAt( i ) );
        let dir = center.$subtract( samples.getAt( i ) ).angle();
        vecline.initVec( Math.cos( dir ), Math.sin( dir ) );
        space.add( vecline );
      }

      // remove this actor when done
      space.remove( this );
      space.refresh( true );
    }

    // add 50 points per 25ms
    var count = 0;
    while (time - lastTime < 25 && count++ < 50) {
      let s = samples.sample( 10, 'poisson' );
      ctx.fillStyle = '#fff';
      if (s) {
        form.fill( "rgba(255,210,230,.3)" ).stroke( false ).point( s, 1 );

        // add to sample point set and increment counter
        samples.to( s );
        counter++;
      }
    }

    // fade out effect
    form.fill( "rgba(34,34,34,.1" ).rect( new Rectangle().to( space.size ) );
    lastTime = time;
  }
});


// 4. Start playing
space.bindMouse();
space.play();