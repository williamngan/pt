var ParticleField,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParticleField = (function(superClass) {
  extend(ParticleField, superClass);

  function ParticleField() {
    ParticleField.__super__.constructor.apply(this, arguments);
    this.system = void 0;
  }

  ParticleField.prototype.check = function(particles, removal) {
    var i, len, p, temp;
    if (removal == null) {
      removal = false;
    }
    temp = [];
    for (i = 0, len = particles.length; i < len; i++) {
      p = particles[i];
      if (this.hasIntersect(p)) {
        this.work(p);
      } else {
        temp.push(p);
      }
    }
    return (removal ? temp : particles);
  };

  ParticleField.prototype.work = function(p) {};

  return ParticleField;

})(Rectangle);

this.ParticleField = ParticleField;

//# sourceMappingURL=map/ParticleField.js.map