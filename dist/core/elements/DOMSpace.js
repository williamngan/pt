var DOMSpace,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DOMSpace = (function(superClass) {
  extend(DOMSpace, superClass);

  function DOMSpace(id, bgcolor, context) {
    if (id == null) {
      id = 'pt_space';
    }
    if (bgcolor == null) {
      bgcolor = false;
    }
    if (context == null) {
      context = 'html';
    }
    this._resizeHandler = bind(this._resizeHandler, this);
    DOMSpace.__super__.constructor.apply(this, arguments);
    this.space = document.querySelector("#" + this.id);
    this.css = {
      width: "100%",
      height: "100%"
    };
    this.bound = null;
    this.boundRect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };
    this.appended = true;
    if (!this.space) {
      this._createSpaceElement();
    }
    this._mdown = false;
    this._mdrag = false;
    this.bgcolor = bgcolor;
    this.ctx = {};
  }

  DOMSpace.prototype._createSpaceElement = function() {
    this.space = document.createElement("div");
    this.space.setAttribute("id", this.id);
    return this.appended = false;
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

  DOMSpace.prototype.display = function(parent_id, readyCallback) {
    if (parent_id == null) {
      parent_id = "#pt";
    }
    if (!this.appended) {
      this.bound = document.querySelector(parent_id);
      this.boundRect = this.bound.getBoundingClientRect();
      if (this.bound) {
        this.resize(this.boundRect.width, this.boundRect.height);
        this.autoResize(true);
        if (this.space.parentNode !== this.bound) {
          this.bound.appendChild(this.space);
        }
        this.appended = true;
        setTimeout((function() {
          this.space.dispatchEvent(new Event('ready'));
          if (readyCallback) {
            return readyCallback(this.boundRect.width, this.boundRect.height, this.space);
          }
        }).bind(this));
      } else {
        throw 'Cannot add canvas to element ' + parent_id;
      }
    }
    return this;
  };

  DOMSpace.prototype._resizeHandler = function(evt) {
    this.boundRect = this.bound.getBoundingClientRect();
    return this.resize(this.boundRect.width, this.boundRect.height, evt);
  };

  DOMSpace.prototype.autoResize = function(auto) {
    if (auto == null) {
      auto = true;
    }
    if (auto) {
      window.addEventListener('resize', this._resizeHandler);
    } else {
      window.removeEventListener('resize', this._resizeHandler);
    }
    return this;
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