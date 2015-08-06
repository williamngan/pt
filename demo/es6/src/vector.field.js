var space = new CanvasSpace("demo", "#fff" ).display();
var form = new Form( space.ctx );

space.refresh( false );
form.fill("#fff").rect( new Rectangle().to( space.size ) );

var samples = new SamplePoints();
samples.setBounds(new Rectangle().size(space.size.x, space.size.y), true);
samples.poissonSampler(5);
var lastTime = 0;
var counter = 0;

var center = space.size.$divide(2);

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
    return this;
  }

  animate() {
    //form.circle( this );
  }

  onMouseAction( type, x, y, evt ) {
    if (type == "move") {
      this.move( x, y );
      this.lastPos = new Point( x, y );
    }
  }
}

var comb = new Comb();
space.add( comb );


class VectorLine extends Vector {

  constructor( ...args ) {
    super( ...args );

    this.direction = new Vector();
    this.pointer = new Vector();

    this.pulled = false;
    this.moved = false;
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

    if (this.resetTimer >= 0) this.resetTimer+=frame;
    if (this.resetTimer > 0 && this.resetTimer < 2000) {
      var ang = center.$subtract( this ).angle();
      var dir = new Vector(Math.cos( ang ), Math.sin( ang ));
      this.direction.set( dir );
      this.pointer.add( dir ).divide( 1.2 );
    }
  }


  spaceResize( w, h ) {
    this.set( Math.random() * w, Math.random() * h );
    return this.initVec( Math.cos( Const.quarter_pi ), Math.sin( -1 * Const.quarter_pi ) );
  }

  onMouseAction( type, x, y, evt ) {
    if (type == "up" && this.moved) {
      this.resetTimer = 0;
      this.moved = false;
    }
  }

  checkRange() {

    var cd;

    if (comb.intersectPoint( this.x, this.y )) {
      this.intensity = 0.5;
      let dm = 1 - (this.distance( comb ) / comb.radius);

      this.pull_power = this.pull_power > 0 ? this.pull_power - 0.25 : 0;
      this.pointer.add( comb.offset.$multiply( dm * this.pull_power ) );
      this.direction.set( this.pointer ).normalize();
      this.pulled = true;
      this.moved = true;

      var cr = Math.ceil(this.pointer.y/comb.radius * 100 + 150);
      var cg = Math.ceil(this.pointer.x/comb.radius * 100 + 150);
      cd = `rgba(${cr},50,${cg}`;


    } else {

      this.pull_power = 7;

      if (this.pulled) {
        let _mag = this.pointer.magnitude();
        if (_mag > this.mag) {
          this.pointer.set( this.direction.$multiply( _mag * 0.95 ) );
        } else {
          this.pulled = false;
        }
        this.intensity = Math.min( 0.4, Math.max( 5, _mag / (this.mag * 5) ) );
      }

      cd = (this.pointer.y > 0) ? "rgba(255,0,50" : "rgba(51,0,0"
    }
    //this.color = "rgba(0,0,0," + this.intensity + ")";
    //var


    return `${cd},${this.intensity})`;
  }
}

/*
for (var i=0; i<1500; i++) {
  let vec = new VectorLine(Math.random() * space.size.x, Math.random() * space.size.y);
  vec.initVec(Math.cos(Const.quarter_pi), Math.sin(-1 * Const.quarter_pi));
  space.add(vec);
}
*/

space.add({
  animate: function(time, frameTime, ctx) {


    if (counter > 3000) {
      for (var i = 0; i < samples.count(); i++) {
        form.point( samples.getAt( i ), 2, true );
        let vec = new VectorLine( samples.getAt( i ) );
        let dir = center.$subtract( samples.getAt( i ) ).angle();
        vec.initVec( Math.cos( dir ), Math.sin( dir ) );
        space.add( vec );

      }

      console.log( this );
      space.remove( this );
      space.refresh( true );
    }

    var count, s;
    count = 0;

    while (time - lastTime < 25 && count++ < 50) {
      s = samples.sample( 10, 'poisson' );
      ctx.fillStyle = '#fff';
      if (s) {
        var vec = new VectorLine(s);
        form.fill( "rgba(0,0,0,.3)" ).stroke( false ).point( vec, 1 );
        counter++;
        //let dir = space.size.$divide(2).subtract( s ).angle();
        //vec.initVec(Math.cos( dir ), Math.sin(dir));
        //space.add(vec);
      }
      if (s) {
        samples.to( s );
      }
    }

    form.fill( "rgba(255,255,255,.1" ).rect( new Rectangle().to( space.size ) );

    return lastTime = time;

  }
});


// 4. Start playing
space.bindMouse();
space.play();