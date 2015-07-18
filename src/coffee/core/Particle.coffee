# ### A particle with physics
class Particle extends Circle

  # derivative of momentum is force (F=dp/dt)
  # derivative of position is velocity (v=dx/dt)
  # derivative of velocity is acceleration (a=dv/dt)
  # Force = mass * acceleration (F=ma)
  # Momentum = mass * velocity (p=mv)

  # ## Create a new Particle. Like a Circle, specify its center position with a `radius` property to define its radius.
  # @param `args` Similar to Point constructor, use comma-separated values, an array, or a Point object as parameters to specify the center of circle. Optionally include a 4th parameter to set the radius directly, or use `setRadius()` afterwards.
  # @eg `new Particle()` `new Particle(1,2,3)` `new Particle(1,2,3,100)`
  # @return a new Circle object
  constructor: () ->
    super

    # ## A property to store this particle's id
    @id = 0

    # ## A property to track this particle's states. An object with properties `.age` and `.maxAge` and a boolean proeprty `.active`
    @life = {age: 0, maxAge: 0, active: true, complete: false}

    # ## A property to track this particle's momentum as a Vector
    @momentum = new Vector()

    # ## A property to track this particle's velocity as a Vector
    @velocity = new Vector()

    # ## A property to specify this particle's mass value. Default is 2.
    @mass = 2

    # ## A property to specify this particle's friction. Defaulti is 0.
    @friction = 0

    # A property to specify how many frames per milliseconds, for timeStep integration. Default is 20 ms (1000/48 (48 fps) = ~20ms).
    @frame_ms = 20


  # ## Play the particle for one time-step.
  # @param `time` current time in milliseconds
  # @param `timeDiff` time difference between last and current step, ie, the time of a frame.
  play: ( time, timeDiff ) ->
    t = 0
    while timeDiff > 0
      dt = Math.min( timeDiff, @frame_ms )
      @integrate(t/1000, dt/1000 ); # unit is seconds
      timeDiff -= dt
      t += dt
      @life.age++



  # ## Integrate function using Runge-Kutta-4. Override this function to specify other integrator, such as Euler or Verlet.
  # @param `t` current time in *seconds*
  # @param `dt` time difference between last and current step, in *seconds*
  integrate: (t, dt) ->
    @integrateRK4(t, dt)


  # ## Calculate all forces acting on this particle. This is called by integrate function. Override this function to implement specific force calculations.
  # @param `state` a object with `position` and `momentum` Vectors
  # @param `t` curent time in seconds
  # @eg `p.forces( {position: new Vector(), momentum: new Vector()}, t+dt )`
  # @return an object with `force` property
  forces: (state, t) ->
    return {force: new Vector()}

  # ## Apply an impulse to this particle's `momentum` and `velocity` properties
  # @param `force_dt` a force Vector
  impulse: ( force_dt ) ->
    @momentum.add( force_dt )
    @velocity = @momentum.$divide( @mass )


  # For RK4 integration: update position, momentum and velocity. calculate force.
  _evaluate : (t, dt=0, derivative=false) ->

    # integrate at time dt
    if dt != 0 and derivative

      state = {
        position: @$add( derivative.velocity.$multiply( dt ) )
        momentum: @momentum.$add( derivative.force.$multiply( dt ) )
      }

    else
      state = { position: new Vector(@), momentum: new Vector(@momentum) }

    # recalculate velocity
    state.velocity = state.momentum.$divide( @mass )

    # calculate force
    f = @forces( state, t+dt )

    return { velocity: state.velocity, force: f.force }


  # ## Runge-Kutta-4 integration
  # @param `t` current time in *seconds*
  # @param `dt` time difference between last and current step, in *seconds*
  integrateRK4: (t, dt) ->

    # rk4 calculations (adapted based on the algorithm on gafferongames.com)
    _map = (m1, m2, m3, m4) ->
      v = new Vector(
        (m1.x + 2*(m2.x+m3.x) + m4.x) / 6
        (m1.y + 2*(m2.y+m3.y) + m4.y) / 6
        (m1.z + 2*(m2.z+m3.z) + m4.z) / 6
      )

      return v

    a = @_evaluate(t, 0)
    b = @_evaluate(t, dt*0.5, a)
    c = @_evaluate(t, dt*0.5, b)
    d = @_evaluate(t, dt, c)

    @add( _map( a.velocity, b.velocity, c.velocity, d.velocity ) )
    @momentum.add( _map( a.force, b.force, c.force, d.force ) )


  # ## Simple Euler integration using momentum
  # @param `t` current time in *seconds*
  # @param `dt` time difference between last and current step, in *seconds*
  integrateEuler: (t, dt) ->

    f = @forces( { position: new Vector(@), momentum: new Vector(@momentum) }, t+dt )
    @add( @velocity )
    @momentum.add( f.force )
    @velocity = @momentum.$divide( @mass )


  # ## check Collision with a line segment (wall), and calculate the resulting velocity and momentum
  # @param `wall` a Line object to check collision against
  # @param `precise` a boolean value to specify a precise collision calculation. If `true`, then the particle position will be recalculated to match the exact collision position with the line. Default is true.
  # @return a boolean value to indicate if collision occurs
  collideLine2d: ( wall, precise=true ) ->

    # this can be optimized by calculating the normalized velocity and wall vectors (used in various Line functions)

    curr_pos = new Vector(@)
    curr_dist = Math.abs( wall.getDistanceFromPoint( curr_pos ) )
    collided = Math.abs(curr_dist) < @radius

    # if precision is on, find the next position and check if the next position completely crossed the wall (when speed is very fast)
    if precise
      next_pos = @$add( @velocity )
      next_dist = Math.abs( wall.getDistanceFromPoint( next_pos ) )
      crossed = wall.intersectLine( new Line( curr_pos ).to( next_pos ) )

      if crossed
        next_pos = crossed.$add( @velocity.$normalize().$multiply(-@radius/2) )
        next_dist = Math.abs( wall.getDistanceFromPoint( next_pos ) )
        collided = true

    if collided

      pt_on_wall = wall.getPerpendicularFromPoint( curr_pos ) # normal point on wall
      wall_path = wall.$subtract( wall.p1 )

      collideEndPt = false

      # intersecting with wall segment
      if !wall.withinBounds( pt_on_wall, Const.xy )

        # check if colliding with end pt
        if @intersectPoint( wall )
          collideEndPt = true
          end_path = @$subtract( wall )

        if @intersectPoint( wall.p1 )
          collideEndPt = true
          end_path = @$subtract( wall.p1 )

        if collideEndPt
          wall_path = new Vector( -end_path.y, end_path.x ) # treating it like colliding with zero-radius point

        else
          return false

      # find project and resulting velocity
      dot = wall_path.dot( @velocity )
      proj = wall_path.$multiply( (dot / wall_path.dot( wall_path )) )
      tangent = proj.$subtract( @velocity )

      @velocity = proj.$add(tangent)
      @momentum = @velocity.$multiply( @mass )


      # Recalculate last position before collision if precision needed
      if precise and !collideEndPt

        # normal on wall to curr_pos
        perpend = new Line( pt_on_wall ).to( curr_pos )

        # line segment of two points on wall
        prev_pt_on_wall = wall.getPerpendicularFromPoint( next_pos )
        path = new Line( pt_on_wall ).to( prev_pt_on_wall )
        pvec = path.direction()

        # interpolate the point where the collision occurs
        r = (@radius-curr_dist) / (next_dist-curr_dist)
        pt = pvec.$multiply( r ).$add( path )
        pt2 = pt.$add( perpend.direction().$normalize().$multiply( @radius ) )

        # set new position
        @set( pt2.$add( @velocity.$normalize() ) )

    return collided


  # ## Check if a particle hits the boundaries within a box, and calculate the resulting velocity and momentum. Precise collision positioning are not implemented.
  # @param `bound` a Rectangle object to specify a bounding box`
  # @return a boolean value to indicate if collision occurs
  collideWithinBounds: ( bound ) ->

    if @x - @radius < bound.x or @x + @radius > bound.p1.x

      if @x - @radius < bound.x # fast but not totally accurate. Would be better to check the trajectory like in collideLine2D.
        @x = bound.x + @radius;
      else if @x + @radius > bound.p1.x
        @x = bound.p1.x - @radius;

      @velocity.x *= -1
      @momentum = @velocity.$multiply( @mass )
      return true

    else if @y - @radius < bound.y or @y + @radius > bound.p1.y
      if @y - @radius < bound.y
        @y = bound.y + @radius;
      else if @y + @radius > bound.p1.y
        @y = bound.p1.y - @radius;

      @velocity.y *= -1
      @momentum = @velocity.$multiply( @mass )
      return true

    return false


  # ## Check 2D collision with another particle, and calculate the resulting velocity and momentum. Precise collision positioning are not implemented.
  # @param `pb` another Particle
  # @return an array of 2 Vectors, representing this and the other particle's resulting velocity. Or `false` if collision doesn't occur.
  collideParticle2d: ( pb ) ->

    if @hasIntersect( pb )
      return Particle.collideParticle2d( @, pb, true )

    else
      return false


  # ## Static function to calculate velocity and momentum after 2D collision, without precise coliision positioning. Remember to check intersection/collision before calling this.
  # @param `pa, pb` two Particles
  # @param `update` a boolean value to update the velocity and momentum of the two particle directly if set to `true`. Default is true.
  # @return an array of 2 Vectors, representing this and the other particle's resulting velocity.
  @collideParticle2d: (pa, pb, update=true, checkOverlap=true) ->

    # normal and tangent vector of 2 particles on contact
    normal = pa.$subtract(pb).normalize()
    tangent = new Vector( -normal.y, normal.x )

    # dot products
    dot1n = normal.dot( pa.velocity )
    dot1t = tangent.dot( pa.velocity )
    dot2n = normal.dot( pb.velocity )
    dot2t = tangent.dot( pb.velocity )

    # final velocity (one dimension)
    d1 = ( dot1n * (pa.mass - pb.mass) + 2 * pb.mass * dot2n ) / (pa.mass + pb.mass)
    d2 = ( dot2n * (pb.mass - pa.mass) + 2 * pa.mass * dot1n ) / (pa.mass + pb.mass)

    # final veloctiy (vector)
    v1n = normal.$multiply( d1 )
    v1t = tangent.$multiply( dot1t )
    v2n = normal.$multiply( d2 )
    v2t = tangent.$multiply( dot2t )

    pav = v1n.$add( v1t )
    pbv = v2n.$add( v2t )

    # check if two particles are overlapping, if so, push them apart
    if checkOverlap
      mag = pa.magnitude( pb );
      if mag < pa.radius + pb.radius
        dir= pa.$subtract( pb ).normalize()
        magDiff = Math.abs(mag - pa.radius - pb.radius) / 1.98;
        pa.add( dir.multiply( magDiff ) );
        pb.add( dir.multiply( -magDiff ) );

    if update
      pa.velocity = pav
      pb.velocity = pbv

      pa.momentum = pa.velocity.$multiply( pa.mass )
      pb.momentum = pb.velocity.$multiply( pb.mass )

    return [pav, pbv]


  # ## Static function to calculate gravitational forces between 2 particles. This can be used as an implementation of `forces()` function
  # @param `state` a object with `position` and `momentum` Vectors
  # @param `t` curent time in seconds
  # @param `pa, pb` two Particles
  # @param `g` optional gravitational constant. Defaults to 0.0067.
  # @return an object with `force` property
  @force_gravitation: (state, t, pa, pb, g=0.0067) ->
    meterToPixel = 30

    d = pb.$subtract( state.position )
    mag = d.magnitude() / meterToPixel
    force = if mag == 0 then 0 else t * g * pa.mass * pb.mass / (mag*mag)
    d.normalize().multiply( force )

    return {force: d}


  # ## Static function of Runge-Kutta-4 integrator (adopted from gafferongames.com)
  # @param `c, d` the derivative of c is d. If c is position, then d is velocity.
  # @param `func` acceleration function(c, d, dt, t)
  # @param `dt` change in time
  # @param `t` current time
  # @return an object with `{c, d}` properties where the derivative of c is d.
  @RK4: (c, d, func, dt, t) ->

    c1 = c
    d1= d
    a1 = func(c1, d1, 0, t)

    c2 = c + 0.5*d1*dt
    d2 = d + 0.5*a1*dt
    a2 = func(c2, d2, dt/2, t)

    c3 = c + 0.5*d2*dt
    d3 = d + 0.5*a2*dt
    a3 = func(c3, d3, dt/2, t)

    c4 = c + d3*dt
    d4 = d + a3*dt

    dc = (c1 + 2*(c2+c3) + c4) / 6
    dd = (d1 + 2*(d2+d3) + d4) / 6

    return { c: c + dc*dt, d: d + dd*dt }

# namespace
this.Particle = Particle