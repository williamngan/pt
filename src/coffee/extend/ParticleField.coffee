# ### (In progress) An area that influence force, velocity, etc of particles inside it
class ParticleField extends Rectangle

  constructor: ()->
    super
    @system = undefined

  # ## check particles to work on
  # @param {particles} array of particles
  # @param {removal} if true and if particle within bound, then remove it from array
  check: (particles, removal=false) ->
    temp = []
    for p in particles
      if @hasIntersect( p ) # within
        @work( p )
      else
        temp.push( p )

    return ( if removal then temp else particles )

  # ## apply the changes to a particle (abstract method), used in check()
  # @param {p} a particle
  work: (p) ->




# namespace
this.ParticleField = ParticleField