var UI,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

UI = (function(superClass) {
  extend(UI, superClass);

  UI.dragTarget = null;

  function UI() {
    UI.__super__.constructor.apply(this, arguments);
    this.dragging = false;
  }

  UI.prototype.animate = function(time, frame, ctx) {
    ctx.fillStyle = '#f00';
    return Form.rect(ctx, this);
  };

  UI.prototype.onMouseAction = function(type, x, y, evt) {
    if (this.intersectPoint(x, y)) {
      if (type === 'drag' && !UI.dragTarget) {
        this.dragging = true;
        UI.dragTarget = this;
      }
    }
    if (this.dragging && type === 'move') {
      this.moveTo(x, y).moveBy(this.size().multiply(-0.5));
    }
    if (type === 'drop') {
      this.dragging = false;
      return UI.dragTarget = null;
    }
  };

  return UI;

})(Rectangle);

this.UI = UI;

//# sourceMappingURL=map/UI.js.map