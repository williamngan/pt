# Pt: Migration Guide

### v0.2.0: Space constructor
In Pt v0.2.0, we refactored the constructor function for Space to make it simpler and clearer.

Previously in 0.1.x, the old constructor function works like this:

```language-javascript
// new CanvasSpace( canvas_id, bgcolor ).display( container_id, readyCallback, devicePixelSupport);
// for example:

new CanvasSpace().display("#myDiv")
new CanvasSpace("myCanvas", "#F00").display("#myDiv", readyFunc, true)
```

The container and canvas id has been a source of confusion for some users. The new constructor function now works like this:

```language-javascript
// new CanvasSpace( domID, readyCallback ).setup( properties );
// for example:

new CanvasSpace()
new CanvasSpace("#elem")
new CanvasSpace("#elem", readyFunc).setup({ bgcolor: "#F00", retina: true })
```

You can now simply pass an id to the constructor,
and it's smart enough to find out whether it's a container like `<div>` or `<canvas>` and fill in the rest.
A new `setup` function lets you pass parameters to initialize the space, as each type of space may offer different kind of setups.
Also notice that the ready callback is now an optional second parameter in the constructor.

### v0.2.0: SVG
`SVGSpace` and `SVGForm` are now in the *core* library. If you don't need anything else in *extend* library and wants to save a tiny bit of bandwidth, you may use `pt-core.min.js` instead of `pt.min.js`.
Otherwise no change is neeed.

`getScope` function is now called [`enterScope`](http://localhost:2016/docs/#func-SVGForm-enterScope) in v0.2.0 to make it clearer.
The old function name will continue to work, but will print a warning in the console.