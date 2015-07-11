var Particle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Particle = (function(superClass) {
  extend(Particle, superClass);

  function Particle() {
    Particle.__super__.constructor.apply(this, arguments);
    this.id = 0;
    this.life = {
      age: 0,
      maxAge: 0,
      active: true,
      complete: false
    };
    this.momentum = new Vector();
    this.velocity = new Vector();
    this.mass = 2;
    this.friction = 0;
    this.frame_ms = 20;
  }

  Particle.prototype.play = function(time, timeDiff) {
    var dt, results, t;
    t = 0;
    results = [];
    while (timeDiff > 0) {
      dt = Math.min(timeDiff, this.frame_ms);
      this.integrate(t / 1000, dt / 1000);
      timeDiff -= dt;
      t += dt;
      results.push(this.life.age++);
    }
    return results;
  };

  Particle.prototype.integrate = function(t, dt) {
    return this.integrateRK4(t, dt);
  };

  Particle.prototype.forces = function(state, t) {
    return {
      force: new Vector()
    };
  };

  Particle.prototype.impulse = function(force_dt) {
    this.momentum.add(force_dt);
    return this.velocity = this.momentum.$divide(this.mass);
  };

  Particle.prototype._evaluate = function(t, dt, derivative) {
    var f, state;
    if (dt == null) {
      dt = 0;
    }
    if (derivative == null) {
      derivative = false;
    }
    if (dt !== 0 && derivative) {
      state = {
        position: this.$add(derivative.velocity.$multiply(dt)),
        momentum: this.momentum.$add(derivative.force.$multiply(dt))
      };
    } else {
      state = {
        position: new Vector(this),
        momentum: new Vector(this.momentum)
      };
    }
    state.velocity = state.momentum.$divide(this.mass);
    f = this.forces(state, t + dt);
    return {
      velocity: state.velocity,
      force: f.force
    };
  };

  Particle.prototype.integrateRK4 = function(t, dt) {
    var _map, a, b, c, d;
    _map = function(m1, m2, m3, m4) {
      var v;
      v = new Vector((m1.x + 2 * (m2.x + m3.x) + m4.x) / 6, (m1.y + 2 * (m2.y + m3.y) + m4.y) / 6, (m1.z + 2 * (m2.z + m3.z) + m4.z) / 6);
      return v;
    };
    a = this._evaluate(t, 0);
    b = this._evaluate(t, dt * 0.5, a);
    c = this._evaluate(t, dt * 0.5, b);
    d = this._evaluate(t, dt, c);
    this.add(_map(a.velocity, b.velocity, c.velocity, d.velocity));
    return this.momentum.add(_map(a.force, b.force, c.force, d.force));
  };

  Particle.prototype.integrateEuler = function(t, dt) {
    var f;
    f = this.forces({
      position: new Vector(this),
      momentum: new Vector(this.momentum)
    }, t + dt);
    this.add(this.velocity);
    this.momentum.add(f.force);
    return this.velocity = this.momentum.$divide(this.mass);
  };

  Particle.prototype.collideLine2d = function(wall, precise) {
    var collideEndPt, collided, crossed, curr_dist, curr_pos, dot, end_path, next_dist, next_pos, path, perpend, prev_pt_on_wall, proj, pt, pt2, pt_on_wall, pvec, r, tangent, wall_path;
    if (precise == null) {
      precise = true;
    }
    curr_pos = new Vector(this);
    curr_dist = Math.abs(wall.getDistanceFromPoint(curr_pos));
    collided = Math.abs(curr_dist) < this.radius;
    if (precise) {
      next_pos = this.$add(this.velocity);
      next_dist = Math.abs(wall.getDistanceFromPoint(next_pos));
      crossed = wall.intersectLine(new Line(curr_pos).connect(next_pos));
      if (crossed) {
        next_pos = crossed.$add(this.velocity.$normalize().$multiply(-this.radius / 2));
        next_dist = Math.abs(wall.getDistanceFromPoint(next_pos));
        collided = true;
      }
    }
    if (collided) {
      pt_on_wall = wall.getPerpendicularFromPoint(curr_pos);
      wall_path = wall.$subtract(wall.p1);
      collideEndPt = false;
      if (!wall.withinBounds(pt_on_wall, Const.xy)) {
        if (this.intersectPoint(wall)) {
          collideEndPt = true;
          end_path = this.$subtract(wall);
        }
        if (this.intersectPoint(wall.p1)) {
          collideEndPt = true;
          end_path = this.$subtract(wall.p1);
        }
        if (collideEndPt) {
          wall_path = new Vector(-end_path.y, end_path.x);
        } else {
          return false;
        }
      }
      dot = wall_path.dot(this.velocity);
      proj = wall_path.$multiply(dot / wall_path.dot(wall_path));
      tangent = proj.$subtract(this.velocity);
      this.velocity = proj.$add(tangent);
      this.momentum = this.velocity.$multiply(this.mass);
      if (precise && !collideEndPt) {
        perpend = new Line(pt_on_wall).connect(curr_pos);
        prev_pt_on_wall = wall.getPerpendicularFromPoint(next_pos);
        path = new Line(pt_on_wall).connect(prev_pt_on_wall);
        pvec = path.direction();
        r = (this.radius - curr_dist) / (next_dist - curr_dist);
        pt = pvec.$multiply(r).$add(path);
        pt2 = pt.$add(perpend.direction().$normalize().$multiply(this.radius));
        this.set(pt2.$add(this.velocity.$normalize()));
      }
    }
    return collided;
  };

  Particle.prototype.collideWithinBounds = function(bound) {
    if (this.x - this.radius < bound.x || this.x + this.radius > bound.p1.x) {
      if (this.x - this.radius < bound.x) {
        this.x = bound.x + this.radius;
      } else if (this.x + this.radius > bound.p1.x) {
        this.x = bound.p1.x - this.radius;
      }
      this.velocity.x *= -1;
      this.momentum = this.velocity.$multiply(this.mass);
      return true;
    } else if (this.y - this.radius < bound.y || this.y + this.radius > bound.p1.y) {
      if (this.y - this.radius < bound.y) {
        this.y = bound.y + this.radius;
      } else if (this.y + this.radius > bound.p1.y) {
        this.y = bound.p1.y - this.radius;
      }
      this.velocity.y *= -1;
      this.momentum = this.velocity.$multiply(this.mass);
      return true;
    }
    return false;
  };

  Particle.prototype.collideParticle2d = function(pb) {
    if (this.hasIntersect(pb)) {
      return Particle.collideParticle2d(this, pb, true);
    } else {
      return false;
    }
  };

  Particle.collideParticle2d = function(pa, pb, update, checkOverlap) {
    var d1, d2, dir, dot1n, dot1t, dot2n, dot2t, mag, magDiff, normal, pav, pbv, tangent, v1n, v1t, v2n, v2t;
    if (update == null) {
      update = true;
    }
    if (checkOverlap == null) {
      checkOverlap = true;
    }
    normal = pa.$subtract(pb).normalize();
    tangent = new Vector(-normal.y, normal.x);
    dot1n = normal.dot(pa.velocity);
    dot1t = tangent.dot(pa.velocity);
    dot2n = normal.dot(pb.velocity);
    dot2t = tangent.dot(pb.velocity);
    d1 = (dot1n * (pa.mass - pb.mass) + 2 * pb.mass * dot2n) / (pa.mass + pb.mass);
    d2 = (dot2n * (pb.mass - pa.mass) + 2 * pa.mass * dot1n) / (pa.mass + pb.mass);
    v1n = normal.$multiply(d1);
    v1t = tangent.$multiply(dot1t);
    v2n = normal.$multiply(d2);
    v2t = tangent.$multiply(dot2t);
    pav = v1n.$add(v1t);
    pbv = v2n.$add(v2t);
    if (checkOverlap) {
      mag = pa.magnitude(pb);
      if (mag < pa.radius + pb.radius) {
        dir = pa.$subtract(pb).normalize();
        magDiff = Math.abs(mag - pa.radius - pb.radius) / 1.98;
        pa.add(dir.multiply(magDiff));
        pb.add(dir.multiply(-magDiff));
      }
    }
    if (update) {
      pa.velocity = pav;
      pb.velocity = pbv;
      pa.momentum = pa.velocity.$multiply(pa.mass);
      pb.momentum = pb.velocity.$multiply(pb.mass);
    }
    return [pav, pbv];
  };

  Particle.force_gravitation = function(state, t, pa, pb, g) {
    var d, force, mag, meterToPixel;
    if (g == null) {
      g = 0.0067;
    }
    meterToPixel = 30;
    d = pb.$subtract(state.position);
    mag = d.magnitude() / meterToPixel;
    force = mag === 0 ? 0 : t * g * pa.mass * pb.mass / (mag * mag);
    d.normalize().multiply(force);
    return {
      force: d
    };
  };

  Particle.RK4 = function(c, d, func, dt, t) {
    var a1, a2, a3, c1, c2, c3, c4, d1, d2, d3, d4, dc, dd;
    c1 = c;
    d1 = d;
    a1 = func(c1, d1, 0, t);
    c2 = c + 0.5 * d1 * dt;
    d2 = d + 0.5 * a1 * dt;
    a2 = func(c2, d2, dt / 2, t);
    c3 = c + 0.5 * d2 * dt;
    d3 = d + 0.5 * a2 * dt;
    a3 = func(c3, d3, dt / 2, t);
    c4 = c + d3 * dt;
    d4 = d + a3 * dt;
    dc = (c1 + 2 * (c2 + c3) + c4) / 6;
    dd = (d1 + 2 * (d2 + d3) + d4) / 6;
    return {
      c: c + dc * dt,
      d: d + dd * dt
    };
  };

  return Particle;

})(Circle);

this.Particle = Particle;

//# sourceMappingURL=.map/Particle.js.map