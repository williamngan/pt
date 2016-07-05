// This is generated from ES6 javascript source file.
// See original ES6 source code at https://github.com/williamngan/pt/tree/master/demo/es6/src

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.demoDescription = "If this is a sphere, it would visualize Hairy Ball Theorem, where you can't comb a hairy ball flat without creating a cowlick. This demo was done in javascript ES6 and compiled with babel.";

var space = new CanvasSpace("pt").setup( {bgcolor: "#f5ead6"} );
var form = new Form(space);

var center = space.size.$divide(2);

// A Circle that follows mouse and comb the VectorLines

var Comb = (function (_Circle) {
  _inherits(Comb, _Circle);

  function Comb() {
    _classCallCheck(this, Comb);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(Comb.prototype), "constructor", this).apply(this, args);
    this.lastPos = new Vector();
    this.offset = new Vector();
    this.radius = 50;
  }

  // create comb and add to space

  _createClass(Comb, [{
    key: "move",
    value: function move(x, y) {
      this.lastPos.set(this);
      this.set(x, y);
      this.offset = this.$subtract(this.lastPos).normalize();
      this.lastPos.set(x, y);
    }
  }, {
    key: "animate",
    value: function animate(time, frame, ctx) {}

    // follow mouse movement
  }, {
    key: "onMouseAction",
    value: function onMouseAction(type, x, y, evt) {
      if (type == "move") {
        this.move(x, y);
      }
    }
  }]);

  return Comb;
})(Circle);

var comb = new Comb();
space.add(comb);

// VectorLine is a hair-like point that can be "combed"

var VectorLine = (function (_Vector) {
  _inherits(VectorLine, _Vector);

  function VectorLine() {
    _classCallCheck(this, VectorLine);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _get(Object.getPrototypeOf(VectorLine.prototype), "constructor", this).apply(this, args);

    this.direction = new Vector(); // hair direction
    this.pointer = new Vector(); // hair

    this.pulled = false; // has it been pulled by comb
    this.moved = false; // has it been touched and not yet reset

    this.pull_power = 9;
    this.mag = 20;
    this.intensity = .3;

    this.resetTimer = -1;
  }

  // SamplePoints is a kind of PointSet in pt.ext. It distributes a set of points and optimizes for uniform distance.

  _createClass(VectorLine, [{
    key: "initVec",
    value: function initVec() {
      var _direction, _pointer;

      (_direction = this.direction).set.apply(_direction, arguments).normalize();
      (_pointer = this.pointer).set.apply(_pointer, arguments).multiply(this.mag / 4);
      return this;
    }
  }, {
    key: "animate",
    value: function animate(time, frame, ctx) {

      var c = this.checkRange();
      form.stroke(c).line(new Line(this).to(this.pointer).relative());

      // reset to initial direction (when clicked)
      if (this.resetTimer >= 0) this.resetTimer += frame;
      if (this.resetTimer > 0 && this.resetTimer < 2000) {
        var ang = center.$subtract(this).angle();
        var dir = new Vector(Math.cos(ang), Math.sin(ang));
        this.direction.set(dir);
        this.pointer.add(dir).divide(1.2);
      }
    }

    // track mouse up
  }, {
    key: "onMouseAction",
    value: function onMouseAction(type, x, y, evt) {
      if (type == "up" && this.moved) {
        this.resetTimer = 0;
        this.moved = false;
      }
    }
  }, {
    key: "checkRange",
    value: function checkRange() {

      var color = undefined;

      // pull it when intersecting with comb
      if (comb.intersectPoint(this.x, this.y)) {
        this.intensity = 0.5;
        var dm = 1 - this.distance(comb) / comb.radius;

        this.pull_power = this.pull_power > 0 ? this.pull_power - 0.25 : 0;
        this.pointer.add(comb.offset.$multiply(dm * this.pull_power));
        this.direction.set(this.pointer).normalize();
        this.pulled = true;
        this.moved = true;

        color = "rgba(" + Math.ceil(this.pointer.y / comb.radius * 100 + 150) + ", 50, " + Math.ceil(this.pointer.x / comb.radius * 100 + 150);

        // not pulled
      } else {

          this.pull_power = 9; // reset pull power

          if (this.pulled) {
            // transition back to maximum magnitude value
            var _mag = this.pointer.magnitude();
            if (_mag > this.mag) {
              this.pointer.set(this.direction.$multiply(_mag * 0.95));
            } else {
              this.pulled = false;
            }
            this.intensity = Math.min(0.4, Math.max(5, _mag / (this.mag * 5)));
          }

          color = this.pointer.y > 0 ? "rgba(255,0,50" : "rgba(50,0,20";
        }

      return color + "," + this.intensity + ")";
    }
  }]);

  return VectorLine;
})(Vector);

var samples = new SamplePoints();
samples.setBounds(new Rectangle().size(space.size.x, space.size.y), true);
samples.poissonSampler(5); // target 5px radius
var lastTime = 0;
var counter = 0;

// fill canvas in white initially and no refresh
space.refresh(false);
space.clear("#f5ead6");

space.add({
  animate: function animate(time, frameTime, ctx) {

    if (counter > 3000) {
      // to complete at 3000 points
      for (var i = 0; i < samples.count(); i++) {
        form.point(samples.getAt(i), 2, true);
        var vecline = new VectorLine(samples.getAt(i));
        var dir = center.$subtract(samples.getAt(i)).angle();
        vecline.initVec(Math.cos(dir), Math.sin(dir));
        space.add(vecline);
      }

      // remove this actor when done
      space.remove(this);
      space.refresh(true);
    }

    // add 50 points per 25ms
    var count = 0;
    while (time - lastTime < 25 && count++ < 50) {
      var s = samples.sample(10, 'poisson');
      ctx.fillStyle = '#fff';
      if (s) {
        form.fill("rgba(50,0,20,.3)").stroke(false).point(s, 1);

        // add to sample point set and increment counter
        samples.to(s);
        counter++;
      }
    }

    // fade out effect
    form.fill("rgba(245,234,214,.1").rect(new Rectangle().to(space.size));
    lastTime = time;
  }
});

// 4. Start playing
space.bindMouse();
space.play();