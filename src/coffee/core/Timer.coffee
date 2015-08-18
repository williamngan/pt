# ### Use a timer not to measure time, but to introduce rhythm. The conceptual hums of "one two three, one two three", when transfigured into patterns of sounds or words or dances, gives rise to various forms of aesthetic experiences. If time is a river, then timers are the mills we build along its banks.
class Timer

  # ## Create a Timer
  # @param `d` duration of the timer in milliseconds
  constructor: ( d=1000 ) ->
    @duration = d
    @_time = 0
    @_ease = (t,b,c,d) -> t/d
    @_intervalID = -1


  # ## Start or restart the timer
  # @param `reset` a boolean value to restart the timer from the beginning if set to `true`.
  start: (reset) ->
    diff = Math.min( Date.now() - @_time, @duration)

    if reset or diff >= @duration
      @_time = Date.now()


  # set an easing function to use in `check()`. See `Easing` class for a set of predefined easing functions
  # @param `ease` an easing function with 4 parameters `(current_time, start_value, change_in_value, duration_time)` and must return a number between 0 to 1
  setEasing: (ease) ->
    @_ease = ease


  # ## Check % of time that has elapsed currently.
  # @return a number between 0 to 1
  check: () ->
    diff = Math.min( Date.now() - @_time, @duration)
    return @_ease( diff, 0, 1, @duration )


  # Track time (using `setInterval()`)
  # @param `callback` a callback function which may include a `(t)` parameter to get current elapsed percentage (value between 0 to 1)
  # @return the intervalID from `setInterval()`
  track: ( callback ) ->
    clearInterval( @_intervalID )
    @start(true)
    me = @
    @_intervalID = setInterval( ( () ->
      t = me.check()
      callback( t )
      if t >= 1 then clearInterval( me._intervalID )
    ), 25 )
    return @_intervalID



# namespace
this.Timer = Timer