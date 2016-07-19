# Pt: SVG Guide

Pt enables you to express an idea in a variety of forms and spaces.
SVG is another kind of space, in which every element is in a DOM (Document Object Model).
But don't worry, it's easy to write almost identical code for both SVG and Canvas. This is a quick guide to show you how.

### Set up
First of all, we'll create an `SVGSpace` instead of a `CanvasSpace`.

```language-javascript
var space = new SVGSpace("pt", ready);
```

You may notice a second parameter called `ready`. This is a callback function which we'll define now:

```language-javascript
function ready(bounds, elem) {
  form.scope("item", elem ); // initiate the scope which uses the svg dom as parent node
  space.bindMouse();
  space.play();
}
```

Because of how DOM works (it's kind of a pain), we have to wait till the DOM elements are ready before we can use them.
Hence we use a callback function `ready` to put all the initiation code inside.

The one additional function we use here is `form.scope("item", elem)`.
This initiates the container element (second parameter, passed from callback function) for our svg space ,
and give it a custom name called "item", which will be used to identify child elements inside it.


### Scope
In `<canvas>`, elements are simply painted on top of each other,
and in each cycle everything is usually wiped and repainted.
In DOM, elements persist. We may clear and recreate them again and again like `<canvas>`, but that will be very slow.
It'll be better if we keep track of DOM elements and update their attributes when needed.

`SVGForm` solves this with a function called `enterScope(item)`.
It's a way of saying: Hey, take note of new and existing elements in this group and update them as needed.
The `item` parameter is simply the animate-able object you added to space.

In short, and in most cases, you may simply add this `enterScope` function in the beginning of `animate` callback function, and that's it.

```language-javascript
space.add({
  animate: function(time, fps, context) {
    // enter group scope. "this" refers to this object we are adding to space
    form.enterScope( this );

    // do stuff here, no additional changes needed.
    form.fill("#f00").point( new Point( 100, 100 ) );
  }
});
```


### Examples
To recap: first initiate a parent scope in a ready callback function,
and then in the beginning of your object's `animate` function, call the `enterScope` function. Done!

If you want to change it back to CanvasSpace, simply change `SVGSpace` to `CanvasSpace`, and `SVGForm` to `Form` in the instantiation.
The `scope` functions have no effects in CanvasSpace and won't break your code.

Take a look at the source code in the [SVG demos](../../demo/index.html?name=svgform.scope). It's pretty straightforward.