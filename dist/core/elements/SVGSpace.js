var SVGSpace,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SVGSpace = (function(superClass) {
  extend(SVGSpace, superClass);

  function SVGSpace(id, callback) {
    var b, s;
    SVGSpace.__super__.constructor.call(this, id, callback, 'svg');
    if (this.space.nodeName.toLowerCase() !== "svg") {
      s = this._createElement("svg", this.id + "_svg");
      this.space.appendChild(s);
      this.bound = this.space;
      this.space = s;
      b = this.bound.getBoundingClientRect();
      this.resize(b.width, b.height);
    }
  }

  SVGSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "svg";
    }
    d = document.createElementNS("http://www.w3.org/2000/svg", elem);
    if (id) {
      d.setAttribute("id", id);
    }
    return d;
  };

  SVGSpace.svgElement = function(parent, name, id) {
    var elem;
    if (!parent || !parent.appendChild) {
      parent = this.space;
      if (!parent) {
        throw "parent parameter needs to be a DOM node";
      }
    }
    elem = document.querySelector("#" + id);
    if (!elem) {
      elem = document.createElementNS("http://www.w3.org/2000/svg", name);
      elem.setAttribute("id", id);
      elem.setAttribute("class", id.substring(0, id.indexOf("-")));
      parent.appendChild(elem);
    }
    return elem;
  };

  SVGSpace.prototype.remove = function(item) {
    var i, len, t, temp;
    temp = this.space.querySelectorAll("." + SVGForm._scopeID(item));
    for (i = 0, len = temp.length; i < len; i++) {
      t = temp[i];
      t.parentNode.removeChild(t);
    }
    delete this.items[item.animateID];
    return this;
  };

  SVGSpace.prototype.removeAll = function() {
    while (this.space.firstChild) {
      this.space.removeChild(this.space.firstChild);
      return this;
    }
  };

  return SVGSpace;

})(DOMSpace);

this.SVGSpace = SVGSpace;

//# sourceMappingURL=.map/SVGSpace.js.map