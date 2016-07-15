var DOMSpace,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DOMSpace = (function(superClass) {
  extend(DOMSpace, superClass);

  function DOMSpace(id, callback, spaceElement) {
    var _selector;
    if (spaceElement == null) {
      spaceElement = "div";
    }
    this._resizeHandler = bind(this._resizeHandler, this);
    if (!id) {
      id = 'pt';
    }
    DOMSpace.__super__.constructor.call(this, id);
    this.id = this.id[0] === "#" ? this.id.substr(1) : this.id;
    this.space = null;
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.css = {};
    _selector = document.querySelector("#" + this.id);
    if (!_selector) {
      this.space = this._createElement(spaceElement, this.id);
      document.body.appendChild(this.space);
      this.bound = this.space.parentElement;
    } else {
      this.space = _selector;
      this.bound = this.space.parentElement;
    }
    this._mdown = false;
    this._mdrag = false;
    setTimeout(this._ready.bind(this, callback), 50);
    this.bgcolor = false;
    this.ctx = {};
  }

  DOMSpace.prototype._createElement = function(elem, id) {
    var d;
    if (elem == null) {
      elem = "div";
    }
    d = document.createElement(elem);
    d.setAttribute("id", id);
    return d;
  };

  DOMSpace.prototype._ready = function(callback) {
    if (this.bound) {
      this.boundRect = this.bound.getBoundingClientRect();
      this.resize(this.boundRect.width, this.boundRect.height);
      this.autoResize(this._autoResize);
      if (this.bgcolor) {
        this.setCSS("backgroundColor", this.bgcolor);
      }
      this.updateCSS();
      this.space.dispatchEvent(new Event('ready'));
      if (callback) {
        return callback(this.boundRect, this.space);
      }
    } else {
      throw "Cannot initiate #" + this.id + " element";
    }
  };

  DOMSpace.prototype.setCSS = function(key, val, isPx) {
    if (isPx == null) {
      isPx = false;
    }
    this.css[key] = (isPx ? val + "px" : val);
    return this;
  };

  DOMSpace.prototype.updateCSS = function() {
    var k, ref, results, v;
    ref = this.css;
    results = [];
    for (k in ref) {
      v = ref[k];
      results.push(this.space.style[k] = v);
    }
    return results;
  };

  DOMSpace.prototype.display = function() {
    console.warn("space.display(...) function is deprecated as of version 0.2.0. You can now set the DOM element in the constructor. Please see the release note for details.");
    return this;
  };

  DOMSpace.prototype.setup = function(opt) {
    if (opt.bgcolor) {
      this.bgcolor = opt.bgcolor;
    }
    this._autoResize = opt.resize !== false ? true : false;
    return this;
  };

  DOMSpace.prototype._resizeHandler = function(evt) {
    this.boundRect = this.bound.getBoundingClientRect();
    return this.resize(this.boundRect.width, this.boundRect.height, evt);
  };

  DOMSpace.prototype.resize = function(w, h, evt) {
    var k, p, ref;
    this.size.set(w, h);
    this.center = new Vector(w / 2, h / 2);
    ref = this.items;
    for (k in ref) {
      p = ref[k];
      if (p.onSpaceResize != null) {
        p.onSpaceResize(w, h, evt);
      }
    }
    return this;
  };

  DOMSpace.prototype.autoResize = function(auto) {
    if (auto == null) {
      auto = true;
    }
    if (auto) {
      this.css['width'] = '100%';
      this.css['height'] = '100%';
      window.addEventListener('resize', this._resizeHandler);
    } else {
      delete this.css['width'];
      delete this.css['height'];
      window.removeEventListener('resize', this._resizeHandler);
    }
    return this;
  };

  DOMSpace.prototype.clear = function() {
    return this.space.innerHML = "";
  };

  DOMSpace.prototype.animate = function(time) {
    var k, ref, v;
    ref = this.items;
    for (k in ref) {
      v = ref[k];
      v.animate(time, this._timeDiff, this.ctx);
    }
    if (this._timeEnd >= 0 && time > this._timeEnd) {
      cancelAnimationFrame(this._animID);
    }
    return this;
  };

  DOMSpace.attr = function(elem, data) {
    var k, results, v;
    results = [];
    for (k in data) {
      v = data[k];
      results.push(elem.setAttribute(k, v));
    }
    return results;
  };

  DOMSpace.css = function(data) {
    var k, str, v;
    str = "";
    for (k in data) {
      v = data[k];
      if (v) {
        str += k + ": " + v + "; ";
      }
    }
    return str;
  };

  return DOMSpace;

})(Space);

this.DOMSpace = DOMSpace;

//# sourceMappingURL=.map/DOMSpace.js.map