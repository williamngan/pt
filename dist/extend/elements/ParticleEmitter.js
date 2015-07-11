var ParticleEmitter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParticleEmitter = (function(superClass) {
  extend(ParticleEmitter, superClass);

  function ParticleEmitter() {
    ParticleEmitter.__super__.constructor.apply(this, arguments);
    this.system = null;
    this.lastTime = 0;
    this.animateID = -1;
  }

  ParticleEmitter.prototype.frequency = function(f) {
    return this.period = 1000 / f;
  };

  ParticleEmitter.prototype.emit = function() {};

  ParticleEmitter.prototype.animate = function(time, frame, ctx) {
    if (time - this.lastTime > this.period) {
      this.emit();
      return this.lastTime = time;
    }
  };

  return ParticleEmitter;

})(Vector);

this.ParticleEmitter = ParticleEmitter;

//# sourceMappingURL=map/ParticleEmitter.js.map