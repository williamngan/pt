# Pt: A quick start guide

This guide discusses the main concepts of Pt, and walks through the code to create a simple interactive sketch with Pt.

**If you are learning to code, 
there's also [a friendlier, non-technical guide](https://medium.com/@williamngan/758f2e082da5) to get you started.**

As you know, Pt is based on the ideas of *Point*, *Form*, and *Space*. So we'll be creating a space, a form, and a point (and their extensions). 

The simplest way to create a space is to use CanvasSpace, which is included in the core library.

```javascript
var space = new CanvasSpace().display();
```

This assumes you have, in your html, a container element with id="pt". For example `<div id="pt"></div>`. 
The code above will try to find that element, and create a `<canvas>` element inside it.

You can also specify the canvas id and background color, along with a specific container element.

```javascript
var space = new CanvasSpace("hello", "#f1f1f1").display( "#pt" );
```

The code above will create a light-grey canvas with id "hello", and put it inside a container element with id "pt".

After creating a space, we will create a *Form* to work with that space. A form is like a brush, a way of visualizing the points.
The *Form* class works with html canvas and draws basic shapes. We create an instance of it by passing `space` into it.

```javascript
var form = new Form(space);
```

You may realize that *Space* and *Form* can be extended to create different kinds of expressions in different media. 
Can it control a robot to graffiti a clumsy circle on a wall? It's possible!

Now let's create a point. Just a simple point.

```javascript
var dot = new Point( 250, 250 );
```

How do we put this point into space and draw it with the form we just created? 
All instances of Space let you add objects into it, as long as the object includes an `animate` callback function.








