var ParticleSystem;

ParticleSystem = (function() {
  function ParticleSystem() {
    this.count = 0;
    this.particles = [];
    this.time = 0;
  }

  ParticleSystem.prototype.add = function(particle) {
    particle.id = this.count++;
    this.particles.push(particle);
    return this;
  };

  ParticleSystem.prototype.remove = function(particle) {
    if (particle && particle.life) {
      particle.life.complete = true;
    }
    return this;
  };

  ParticleSystem.prototype.animate = function(time, frame, ctx) {
    var _remove, i, index, j, k, len, len1, p, ref, results;
    this.time++;
    _remove = [];
    ref = this.particles;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      p = ref[i];
      if (p.life.complete) {
        _remove.push(i);
      } else if (p.life.active) {
        p.animate(time, frame, ctx);
      }
    }
    if (_remove.length > 0) {
      results = [];
      for (k = 0, len1 = _remove.length; k < len1; k++) {
        index = _remove[k];
        results.push(this.particles.splice(index, 1));
      }
      return results;
    }
  };

  return ParticleSystem;

})();

this.ParticleSystem = ParticleSystem;

//# sourceMappingURL=.map/ParticleSystem.js.map