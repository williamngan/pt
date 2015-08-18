# ### A particle system keeps track of particles, and regulate them with rules specific to a system. It can also hold constant values from gravitational to cosmic, and specify whether a god may play dice here.
class ParticleSystem

  # ## Create a ParticleSystem to track a set of particles
  constructor : () ->

    # ## a property to store particles in this system as an Array
    @count = 0
    @particles = []

    # ## a property to track time in milliseconds
    @time = 0

    # @animateID = -1


  # ## add a particle to the system
  # @param `particle` a Particle
  # @return this system
  add : ( particle ) ->
    particle.id = @count++
    @particles.push( particle )
    return @


  # ## remove a particle which has a `particle.life` property. This marks the `particle.life.complete` as `true` for removal in next cycle.
  # @param `particle` a Particle
  # @return this system
  remove: (particle) ->
    if particle and particle.life then particle.life.complete = true
    return @


  # ## animate callback function which is called by` Space.play()`. Override this callback function to specify other animation loops
  # @param `time, frame, ctx` parameters for current time, fps, and rendering context, which will be passed by `Space` in callback
  animate : ( time, frame, ctx ) ->
    @time++

    _remove = []; # to be removed

    for p, i in @particles

      # if life is complete, mark for removal
      if p.life.complete
        _remove.push( i )

      # if active, animate it
      else if p.life.active
        p.animate( time, frame, ctx )

    # remove completed particles
    if _remove.length > 0
      for index in _remove
        @particles.splice(index, 1)



# namespace
this.ParticleSystem = ParticleSystem

