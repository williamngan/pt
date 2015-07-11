
# # Particle Emitter
class ParticleEmitter extends Vector

  # ## Constructor
  # @param {system} Particle System
  # @param {position} position of the emitter
  # @param {frequency} number of particles to emit per second
  constructor: ( ) ->
    super

    @system = null
    @lastTime = 0
    @animateID = -1 # for Space loop

  # ## Set frequency of emisson. f = how many per second.
  frequency: (f) -> @period = 1000 / f

  # ## emit a particle (abstract method)
  emit: ->
    # override to define an emitter function
    # e.g @system.add( new Particle( @position ) )

  # ## animate function to be called by Space
  animate: ( time, frame, ctx ) ->
    if time - @lastTime > @period
      @emit()
      @lastTime = time



# namespace
this.ParticleEmitter = ParticleEmitter