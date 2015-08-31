### (Note: The finalized start guide is [now posted here](https://medium.com/p/758f2e082da5/edit))

# Pt - a quick start guide

This is a quick start guide of Pt. Pt is experimental and fun. You can read more about [the motivations here](https://medium.com/@williamngan).

Let's get started. This guide talks about the basic concepts of Pt,
and I would like it to be understandable to people who are learning to code. Please bear with me if it seems dull.
I'll just assume you can read basic html and javascript code and nothing else. If you already know javascript well, check out the demos and the docs.

If you like spoiler, here's [the end result](http://williamngan.github.io/pt/docs/start.html) before we even begin. Don't click it!

Okay, we'll first create an html file, which grants us the power to show cats and stuff on the interweb. (If you don't have a text editor for coding, try the free [Atom](https://atom.io/))
Let's save it as `start.html`. It looks like this:

```html
<html>
<head>
    <title>Pt - getting started</title>
    <script type="text/javascript" src="pt.min.js"></script>
</head>
<body>
    <div id="pt" style="width: 500px; height: 500px;"></div>
    <script type="text/javascript">
        // Our exciting code will go inside here
    </script>
</body>
</html>
```

Inside `<head>`, we add a title and include the pt javascript library file.
And inside `<body>`, we add a 500px by 500px container element,
and also include another `<script>` block, into which the most exciting code will go.

It's that simple! Next, we will jump start our artistic career by drawing a dot.

Pt is based on the concepts of Point, Form, and Space.
([Read more here](https://medium.com/@williamngan))
For simplicity, let's imagine Space as your canvas, Form as your brush, and Point as your idea.

We'll set up a space in javascript, like this:

```javascript
space = new CanvasSpace().display()
```

What this means is that we'll create a Space using html5 canvas.
By default, this will look for an element in your html that has an attribute `id="pt"`, and add a `<canvas>` element inside it.

We can customize this by passing *parameters* into it. For CanvasSpace, you can optionally specify the container element by its `id`,
and also specify an id and background color for the canvas.

```javascript
space = new CanvasSpace("hello", "#f1f1f1").display( "#pt" )
```

The code above will create a canvas with a light grey background, displayed inside a container element whose `id="pt"`.

Done! The advanced coder will notice (with furious anger :scream:) that we're missing stuff like the damn semicolon and the annoying `var` and the sacred *namespace*.
Let's not worry about being correct for now. Let's have fun and make a mess.

Next we'll make the Form, which is like our brush. The basic `Form` class that comes with Pt will work with `CanvasSpace`.
We just need to create it like this:

```javascript
form = new Form(space)
```

Notice the Form takes a parameter, which is the `space` we just created.
This defines the context and links the form to the space.
In plain language, it's saying we will be using this brush for this canvas.

You may ask: where is the action? Here is the action:

```javascript
dot = new Point( 250, 250 )
bot = {
    animate: function( time, fs, context ) {
        form.point( dot )
    }
}

space.add( bot )
space.play()
```

Let's take a look at what's going on.

First, we create a `dot`, which is a Point at position `250, 250` (x and y coordinates). See, it is a point in space. It is known.

Secondly, we need someone to pick up our brush and draw our dot.
So we create a `bot`, which is an advanced robot to go into space and draw the dot.
Inside the robot it has a function called `animate`.
When it's put into space, via `space.add( bot )`, it will execute the animate function, and do `form.point( dot )`,
which applies the Form to draw the dot as a visible point.

The `bot` is an example of a object in javascript. Any object that defines a function `animate` can be added to space using `space.add(...)`.

And there are other convenient drawing functions in Form, such as `form.circle`, `form.triangle`, etc. You can even extend Form to draw
all kinds of crazy stuff.

Lastly, after all these preparations, the space comes alive when we hit `space.play()`.

Let's behold this minimalistic beauty we created. During intermission, think about Point, Form, and Space a bit more.
This scary looking diagram here is a recap of what we just discussed.

--

Perhaps the dot is not what you imagined it to be. Perhaps you're thinking about a blue circle like Kandinsky.
Let's revise the code like this:

```javascript
dot = new Circle( 250, 250 ).setRadius( 50 )
bot = {
    animate: function( time, fs, context ) {
        form.fill( "#5AF" ).stroke( false )
        form.circle( dot )
    }
}
```

Here we changed the dot from a Point to a Circle, and we set the circle's radius to 50px. Inside the `bot`'s animate function,
we pick a blue fill color and no stroke color for our brush, and use it to draw a circle. Voila!

Notice the parameters `(time, fs, ...)` in `animate` function? These help you keep track of the passing of time and doing things with it.

The first parameter `time` simply tells you, in milliseconds (1/1000th of a second) the time that has passed.

The second parameter `fs` is the milliseconds it took to refresh the drawing.
(Think of the animation as a sequence of frames, shown one after another). If you calculate `1000/fs`, then you'll know the current *frame rate*,
ie, how many frames were shown per second. 60 fps is great, 30 fps is ok. Side effects of low frame rate may include nausea, headache, and depression.

Let's revise our code and do something fun with time.

```javascript
dot = new Circle( 250, 250 ).setRadius( 50 )
bot = {
    animate: function( time, fs, context ) {
        form.fill( "#999" )
        form.text( new Point( 20, 20 ), "frame rate is "+(1000/fs) )

        form.fill( "#5AF" ).stroke( false )
        dot.setRadius( Math.abs(500 - time % 1000)/20 + 20 )
        form.circle( dot )
    }
}
```

The code now looks a bit frightening, but it's worth it because now our circle is pulsating! Let's go through it.

First we set the fill color to a medium grey, and use it to draw text at position `(20, 20)`.
We calculate the frame rate as `1000/fs` and display it as text.

Then we modify the circle's radius based on time. What's that crazy formula? If you imagine the time passing in milliseconds:

`0...1...345...1000 (one second)...1231...1983...2000 (two seconds)...2314...2781...3000 (three seconds)`

So if we take the remainder of dividing time by 1000 (`time % 1000`), we'll get this:
`0...1...345...0....................231.....983....0...................314....781...0`

Then if we subtract it from 500 and make it an absolute value which is always positive (`Math.abs`), we'll get this:
`500.499.155...500..................269.....483....500.................186....281...500`

And we divide it by 20 because we want to:
`25..25..8.....25...................13......24.....25...................9......14...25`

So the final radius of the circle is at least 20px, plus a dynamic value based on time. `( Math.abs(...)/20 + 20 )`
`45..45..28.....45..................33......44.....45...................29.....34...45`

And this is why I feel that code is like clay. With your mind's eye, you can see it, and when you can see it, you can touch and mold it.
It's fun and exciting. [And it's not brain surgery, is it?](https://www.youtube.com/watch?v=THNPmhBl-8I)

Let's mold it a bit more. What if we can make it move? First, we will create another circle, called `another`, obviously.
Then we'll ask the bot to draw it like what we did with the `dot`.
The only difference is that we'll draw it with no fill color, but with a 5px orange outline. `stroke("#fc0", 5)`

```javascript
...
another = new Circle( 100, 100 ).setRadius( 50 )

bot = {
    animate: function( time, fs, context ) {
        ...
        form.fill( false ).stroke( "#fc0", 5 )
        form.circle( another )
    }
}
```

Another thing our `bot` can do is to observe the "events" happening in space, such as when user clicks or moves the mouse.
First we ask for space to get all mouse events, via `space.bindMouse()`.
Then, in addition to `animate`, we add another callback function in the bot called `onMouseAction`.
(Also notice the comma at the end of `animate` and before `onMouseAction`... it's how we tell javascript explicity that there are two functions in an object)
So it looks like this:

```javascript
bot = {
    animate: function(...) {

    },

    onMouseAction: function(type, x, y, evt) {

    }
}

space.add( bot )
space.bindMouse()
space.play()
```

The `onMouseAction` function has parameters `(type, x, y, evt)`. `type` gives you a "string", which is a piece text to tell you
what the type of action is, such as "move", "drag", "drop", and "down". `x` and `y` then gives you the current mouse position.

We'll make the `another` circle move with the mouse, by adding a simple logic into `onMouseAction`:

```javascript
bot = {
    onMouseAction: function(type, x, y, evt) {
        if (type == "move") {
            another.set( x, y )
        }
    }
}
```

If you move your mouse around, you should see the orange circle is following your cursor.

Now these two circles are begging us to do something with them.
One thing that Circle in Pt can do is to check if it intersects with another circle. Let's try:

```javascript
bot = {
    animate: function( time, fs, context ) {
        ...
        hits = another.intersectCircle( dot )
        if (hits.length > 0) {
            form.stroke( "#fff" ).fill("#0C9")
            form.points( hits, 5, true )
        }
    }
}
</script>
```

We start by checking for intersection using `another.intersectCicle( dot )`.
If intersection occurs, this function will give us two intersection points in a list called an *array*.
We store the points array in a variable called `hits`.

Next we check if `hits` array has more than 0 items in it, using an `if (...)` statement.
In plain language, it says "if (hits array has more than 0 items), then do the things inside the curly braces { ... }".

Here we simply draw the intersection points as circular points with 5px radius, by calling the convenient function `form.points(hits, 5, true)`.
The last parameter value `true` means the point will be circular. If it's set to `false` or omitted, then the points are rectangular.

And why stop here? For example, you can connect the `hits` points with a line. It's as simple as:

```
form.line( new Line( hits[0] ).to( hits[1] ) )
```

We create a new Line by specifying its two end points as the `hits` points.
We use the array index notation (`something[0]`) to get the point out of the array. Notice that the first item in an array is at position `0`.
Finally we simply asks our Form to draw the line. (`form.line( ... )`)

Whoa, take a look at what we have achieved with less than 40 lines of code. :stuck_out_tongue_closed_eyes: Congratulations!
Now it's your turn to put your imaginative forces to work. Take a look at the demos, and the docs, and if you haven't, learn to code!

P.S. Many free javascript learning resources online like [this](https://www.codecademy.com/en/tracks/javascript) and [this](http://eloquentjavascript.net/) and [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript)) and many others. There are also many great graphics library such as [processing](http://processing.org), [d3.js](http://d3js.org),
[paper.js](http://paperjs.org), and [three.js](http://threejs.org). Try out all of them!
