# ### (In progress)  A very basic particle emitter
class ParticleEmitter extends Vector

  # ## Constructor
  constructor: ( ) ->
    super

    @system = null
    @lastTime = 0
    @period = 0
    @animateID = -1 # for Space loop

  # ## Initiate with an instance of a `ParticleSystem`
  init: ( system ) ->
    @system = system

  # ## Set frequency of emisson.
  # @param `f` how many per second.
  frequency: (f) ->
    @period = 1000 / f
    return @

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