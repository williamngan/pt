var DOMSpace,
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
    DOMSpace.__super__.constructor.apply(this, arguments);
    this.space = document.querySelector("#" + this.id);
    this.css = {
      width: "100%",
      height: "100%"
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
    var frame, frame_rect;
    if (parent_id == null) {
      parent_id = "#pt";
    }
    if (!this.appended) {
      frame = document.querySelector(parent_id);
      frame_rect = frame.getBoundingClientRect();
      if (frame) {
        this.resize(frame_rect.width, frame_rect.height);
        window.addEventListener('resize', (function(evt) {
          frame_rect = frame.getBoundingClientRect();
          return this.resize(frame_rect.width, frame_rect.height, evt);
        }).bind(this));
        if (this.space.parentNode !== frame) {
          frame.appendChild(this.space);
        }
        this.appended = true;
        setTimeout((function() {
          this.space.dispatchEvent(new Event('ready'));
          if (readyCallback) {
            return readyCallback(frame_rect.width, frame_rect.height, this.space);
          }
        }).bind(this));
      } else {
        throw 'Cannot add canvas to element ' + parent_id;
      }
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

  DOMSpace.prototype.bindCanvas = function(evt, callback) {
    return this.space.addEventListener(evt, callback);
  };

  DOMSpace.prototype.bindMouse = function(_bind) {
    if (_bind == null) {
      _bind = true;
    }
    if (_bind) {
      this.space.addEventListener("mousedown", this._mouseDown.bind(this));
      this.space.addEventListener("mouseup", this._mouseUp.bind(this));
      this.space.addEventListener("mouseover", this._mouseOver.bind(this));
      this.space.addEventListener("mouseout", this._mouseOut.bind(this));
      return this.space.addEventListener("mousemove", this._mouseMove.bind(this));
    } else {
      this.space.removeEventListener("mousedown", this._mouseDown.bind(this));
      this.space.removeEventListener("mouseup", this._mouseUp.bind(this));
      this.space.removeEventListener("mouseover", this._mouseOver.bind(this));
      this.space.removeEventListener("mouseout", this._mouseOut.bind(this));
      return this.space.removeEventListener("mousemove", this._mouseMove.bind(this));
    }
  };

  DOMSpace.prototype._mouseAction = function(type, evt) {
    var k, px, py, ref, results, v;
    ref = this.items;
    results = [];
    for (k in ref) {
      v = ref[k];
      px = evt.offsetX || evt.layerX;
      py = evt.offsetY || evt.layerY;
      if (v.onMouseAction != null) {
        results.push(v.onMouseAction(type, px, py, evt));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  DOMSpace.prototype._mouseDown = function(evt) {
    this._mouseAction("down", evt);
    return this._mdown = true;
  };

  DOMSpace.prototype._mouseUp = function(evt) {
    this._mouseAction("up", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    this._mdown = false;
    return this._mdrag = false;
  };

  DOMSpace.prototype._mouseMove = function(evt) {
    this._mouseAction("move", evt);
    if (this._mdown) {
      this._mdrag = true;
      return this._mouseAction("drag", evt);
    }
  };

  DOMSpace.prototype._mouseOver = function(evt) {
    return this._mouseAction("over", evt);
  };

  DOMSpace.prototype._mouseOut = function(evt) {
    this._mouseAction("out", evt);
    if (this._mdrag) {
      this._mouseAction("drop", evt);
    }
    return this._mdrag = false;
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