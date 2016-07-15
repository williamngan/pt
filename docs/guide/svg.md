# Pt: SVG Guide

Pt enables you to visualize an idea in a variety of forms and spaces.
SVG is another kind of space, in which every element is in a DOM (Document Object Model).
It is different from Canvas where elements are simply drawn on top of each other.
But don't worry, it's easy to write almost identical code for both SVG and Canvas. This is a quick guide to show you how.

### Set up
First of all, we'll create an `SVGSpace` instead of a `CanvasSpace`.

```language-javascript
var space = new SVGSpace("pt", ready).setup({bgcolor: "#abc"});
```

You may notice a second parameter called `ready`. This is a callback function which we'll define now.
```language-javascript

```