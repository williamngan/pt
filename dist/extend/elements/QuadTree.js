var QuadTree,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

QuadTree = (function(superClass) {
  extend(QuadTree, superClass);

  function QuadTree() {
    QuadTree.__super__.constructor.apply(this, arguments);
    this.quads = false;
    this.items = [];
    this.depth = 0;
    this.max_depth = 6;
    this.max_items = 2;
  }

  QuadTree.prototype.getQuads = function(p, list) {
    var k, q, ref;
    if (list == null) {
      list = [];
    }
    if (this.intersectPoint(p)) {
      list.push(this);
      if (this.quads) {
        ref = this.quads;
        for (k in ref) {
          q = ref[k];
          if (q.intersectPoint(p)) {
            q.getQuads(p, list);
          }
        }
      }
    }
    return list;
  };

  QuadTree.prototype.getItems = function(p) {
    var k, q, ref;
    if (this.intersectPoint(p)) {
      if (!this.quads) {
        return this.items;
      }
      if (this.quads) {
        ref = this.quads;
        for (k in ref) {
          q = ref[k];
          if (q.intersectPoint(p)) {
            return q.getItems(p);
          }
        }
      }
    }
    return [];
  };

  QuadTree.prototype.addToQuad = function(item) {
    var _depth, k, q, ref;
    if (!item) {
      return -1;
    }
    if (this.quads) {
      ref = this.quads;
      for (k in ref) {
        q = ref[k];
        _depth = q.addToQuad(item);
        if (_depth > 0) {
          return _depth;
        }
      }
      return -1;
    }
    if (!this.quads && this.intersectPoint(item)) {
      if (this.items.length >= this.max_items) {
        if (this.depth < this.max_depth) {
          this.splitQuad();
          return this.addToQuad(item);
        } else {
          return -1;
        }
      } else {
        this.items.push(item);
        return this.depth;
      }
    }
    return -1;
  };

  QuadTree.prototype.splitQuad = function() {
    var _depth, i, item, j, k, l, len, len1, q, ref, ref1, ref2, results, t;
    this.quads = this.quadrants();
    ref = this.quads;
    for (k in ref) {
      q = ref[k];
      q.depth = this.depth + 1;
    }
    ref1 = this.items;
    for (i = j = 0, len = ref1.length; j < len; i = ++j) {
      item = ref1[i];
      _depth = this.addToQuad(item);
      if (_depth > this.depth) {
        this.items[i] = null;
      }
    }
    ref2 = this.items;
    results = [];
    for (l = 0, len1 = ref2.length; l < len1; l++) {
      t = ref2[l];
      if (!t) {
        results.push(this.items.splice(t, 1));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  QuadTree.prototype.resetQuad = function() {
    var k, q, ref;
    this.items = [];
    if (this.quads) {
      ref = this.quads;
      for (k in ref) {
        q = ref[k];
        q.resetQuad();
      }
      return this.quads = false;
    }
  };

  return QuadTree;

})(Rectangle);

this.QuadTree = QuadTree;

//# sourceMappingURL=map/QuadTree.js.map