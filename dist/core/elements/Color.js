var Color,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Color = (function(superClass) {
  extend(Color, superClass);

  function Color(args) {
    Color.__super__.constructor.apply(this, arguments);
    this.alpha = arguments.length >= 4 ? Math.min(1, Math.max(arguments[3], 0)) : 1;
    this.mode = arguments.length >= 5 ? arguments[4] : 'rgb';
  }

  Color.XYZ = {
    D65: {
      x: 95.047,
      y: 100,
      z: 108.883
    }
  };

  Color.parseHex = function(hex, asColor) {
    var hexValue, rgb;
    if (asColor == null) {
      asColor = false;
    }
    if (hex.indexOf('#') === 0) {
      hex = hex.substr(1);
    }
    if (hex.length === 3) {
      hex = "" + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 8) {
      this.alpha = hex.substr(6) & 0xFF / 255;
      hex = hex.substring(0, 6);
    }
    hexValue = parseInt(hex, 16);
    rgb = [hexValue >> 16, hexValue >> 8 & 0xFF, hexValue & 0xFF];
    if (asColor) {
      return new Color(rgb[0], rgb[1], rgb[2]);
    } else {
      return rgb;
    }
  };

  Color.prototype.setMode = function(m) {
    m = m.toLowerCase();
    if (m !== this.mode) {
      switch (this.mode) {
        case 'hsl':
          this.copy(Point.get(Color.HSLtoRGB(this.x, this.y, this.z)));
          break;
        case 'hsb':
          this.copy(Point.get(Color.HSBtoRGB(this.x, this.y, this.z)));
          break;
        case 'lab':
          this.copy(Point.get(Color.LABtoRGB(this.x, this.y, this.z)));
          break;
        case 'lch':
          this.copy(Point.get(Color.LCHtoRGB(this.x, this.y, this.z)));
          break;
        case 'xyz':
          this.copy(Point.get(Color.XYZtoRGB(this.x, this.y, this.z)));
      }
      switch (m) {
        case 'hsl':
          this.copy(Point.get(Color.RGBtoHSL(this.x, this.y, this.z)));
          break;
        case 'hsb':
          this.copy(Point.get(Color.RGBtoHSB(this.x, this.y, this.z)));
          break;
        case 'lab':
          this.copy(Point.get(Color.RGBtoLAB(this.x, this.y, this.z)));
          break;
        case 'lch':
          this.copy(Point.get(Color.RGBtoLCH(this.x, this.y, this.z)));
          break;
        case 'xyz':
          this.copy(Point.get(Color.RGBtoXYZ(this.x, this.y, this.z)));
      }
    }
    this.mode = m;
    return this;
  };

  Color.prototype.hex = function() {
    var _hexstring, cs, ct, n;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    _hexstring = function(n) {
      n = n.toString(16);
      if (n.length < 2) {
        return '0' + n;
      } else {
        return n;
      }
    };
    ct = (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = cs.length; j < len; j++) {
        n = cs[j];
        results.push(_hexstring(n));
      }
      return results;
    })();
    return '#' + ct[0] + ct[1] + ct[2];
  };

  Color.prototype.rgb = function() {
    var cs;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    return "rgb(" + cs[0] + ", " + cs[1] + ", " + cs[2] + ")";
  };

  Color.prototype.rgba = function() {
    var cs;
    if (this.mode === 'rgb') {
      this.floor();
    }
    cs = this.values(this.mode !== 'rgb');
    return "rgba(" + cs[0] + ", " + cs[1] + ", " + cs[2] + ", " + this.alpha + ")";
  };

  Color.prototype.values = function(toRGB) {
    var cs, v;
    if (toRGB == null) {
      toRGB = false;
    }
    cs = [this.x, this.y, this.z];
    if (toRGB && this.mode !== 'rgb') {
      switch (this.mode) {
        case 'hsl':
          cs = Color.HSLtoRGB(this.x, this.y, this.z);
          break;
        case 'hsb':
          cs = Color.HSBtoRGB(this.x, this.y, this.z);
          break;
        case 'lab':
          cs = Color.LABtoRGB(this.x, this.y, this.z);
          break;
        case 'lch':
          cs = Color.LCHtoRGB(this.x, this.y, this.z);
          break;
        case 'xyz':
          cs = Color.XYZtoRGB(this.x, this.y, this.z);
      }
    }
    return (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = cs.length; j < len; j++) {
        v = cs[j];
        results.push(Math.floor(v));
      }
      return results;
    })();
  };

  Color.prototype.clone = function() {
    var c;
    c = new Color(this.x, this.y, this.z, this.alpha);
    c.mode = this.mode;
    return c;
  };

  Color.RGBtoHSL = function(r, g, b, normalizedInput, normalizedOutput) {
    var d, h, l, max, min, s;
    if (!normalizedInput) {
      r /= 255;
      g /= 255;
      b /= 255;
    }
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = (max + min) / 2;
    s = h;
    l = h;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
    }
    if (normalizedOutput) {
      return [h / 60, s, l];
    } else {
      return [h * 60, s, l];
    }
  };

  Color.HSLtoRGB = function(h, s, l, normalizedInput, normalizedOutput) {
    var b, g, hue2rgb, p, q, r;
    if (s === 0) {
      if (normalizedOutput) {
        return [1, 1, 1];
      } else {
        return [255, 255, 255];
      }
    } else {
      if (!normalizedInput) {
        h /= 360;
      }
      q = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
      p = 2 * l - q;
      hue2rgb = function(p, q, t) {
        if (t < 0) {
          t += 1;
        } else if (t > 1) {
          t -= 1;
        }
        if (t * 6 < 1) {
          return p + (q - p) * t * 6;
        } else if (t * 2 < 1) {
          return q;
        } else if (t * 3 < 2) {
          return p + (q - p) * ((2 / 3) - t) * 6;
        } else {
          return p;
        }
      };
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
      if (normalizedOutput) {
        return [r, g, b];
      } else {
        return [r * 255, g * 255, b * 255];
      }
    }
  };

  Color.RGBtoHSB = function(r, g, b, normalizedInput, normalizedOutput) {
    var d, h, max, min, s, v;
    if (!normalizedInput) {
      r /= 255;
      g /= 255;
      b /= 255;
    }
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    d = max - min;
    s = max === 0 ? 0 : d / max;
    v = max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
    }
    if (normalizedOutput) {
      return [h / 60, s, v];
    } else {
      return [h * 60, s, v];
    }
  };

  Color.HSBtoRGB = function(h, s, v, normalizedInput, normalizedOutput) {
    var f, i, p, q, rgb, t;
    if (!normalizedInput) {
      h /= 360;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      case 5:
        rgb = [v, p, q];
        break;
      default:
        rgb = [0, 0, 0];
    }
    if (normalizedOutput) {
      return rgb;
    } else {
      return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255];
    }
  };

  Color.RGBtoLAB = function(r, g, b, normalizedInput, normalizedOutput) {
    var xyz;
    if (normalizedInput) {
      r *= 255;
      g *= 255;
      b *= 255;
    }
    xyz = Color.RGBtoXYZ(r, g, b);
    return Color.XYZtoLAB(xyz[0], xyz[1], xyz[2]);
  };

  Color.LABtoRGB = function(L, a, b, normalizedInput, normalizedOutput) {
    var rgb, xyz;
    if (normalizedInput) {
      L *= 100;
      a = (a - 0.5) * 127;
      b = (b - 0.5) * 127;
    }
    xyz = Color.LABtoXYZ(L, a, b);
    rgb = Color.XYZtoRGB(xyz[0], xyz[1], xyz[2]);
    if (normalizedOutput) {
      return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    } else {
      return rgb;
    }
  };

  Color.RGBtoLCH = function(r, g, b, normalizedInput, normalizedOutput) {
    var lab, lch;
    if (normalizedInput) {
      r *= 255;
      g *= 255;
      b *= 255;
    }
    lab = Color.RGBtoLAB(r, g, b);
    lch = Color.LABtoLCH(lab[0], lab[1], lab[2]);
    if (normalizedOutput) {
      return [lch[0] / 100, lch[1] / 100, lch[2] / 360];
    } else {
      return lch;
    }
  };

  Color.LCHtoRGB = function(L, c, h, normalizedInput, normalizedOutput) {
    var lab, rgb, xyz;
    if (normalizedInput) {
      L *= 100;
      c *= 100;
      h *= 360;
    }
    lab = Color.LCHtoLAB(L, c, h);
    xyz = Color.LABtoXYZ(lab[0], lab[1], lab[2]);
    rgb = Color.XYZtoRGB(xyz[0], xyz[1], xyz[2]);
    if (normalizedOutput) {
      return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    } else {
      return rgb;
    }
  };

  Color.XYZtoRGB = function(x, y, z, normalizedInput, normalizedOutput) {
    var c, i, j, len, rgb;
    if (!normalizedInput) {
      x = x / 100;
      y = y / 100;
      z = z / 100;
    }
    rgb = [x * 3.2404542 + y * -1.5371385 + z * -0.4985314, x * -0.9692660 + y * 1.8760108 + z * 0.0415560, x * 0.0556434 + y * -0.2040259 + z * 1.0572252];
    for (i = j = 0, len = rgb.length; j < len; i = ++j) {
      c = rgb[i];
      if (c < 0) {
        rgb[i] = 0;
      } else {
        rgb[i] = Math.min(1, c > 0.0031308 ? 1.055 * (Math.pow(c, 1 / 2.4)) - 0.055 : 12.92 * c);
      }
    }
    if (normalizedOutput) {
      return rgb;
    } else {
      return [Math.round(rgb[0] * 255), Math.round(rgb[1] * 255), Math.round(rgb[2] * 255)];
    }
  };

  Color.RGBtoXYZ = function(r, g, b, normalizedInput, normalizedOutput) {
    if (!normalizedInput) {
      r = r / 255;
      g = g / 255;
      b = b / 255;
    }
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    if (!normalizedOutput) {
      r = r * 100;
      g = g * 100;
      b = b * 100;
    }
    return [r * 0.4124564 + g * 0.3575761 + b * 0.1804375, r * 0.2126729 + g * 0.7151522 + b * 0.0721750, r * 0.0193339 + g * 0.1191920 + b * 0.9503041];
  };

  Color.XYZtoLAB = function(x, y, z) {
    var calc, cy;
    x = x / Color.XYZ.D65.x;
    y = y / Color.XYZ.D65.y;
    z = z / Color.XYZ.D65.z;
    calc = function(n) {
      if (n > 0.008856) {
        return Math.pow(n, 1 / 3);
      } else {
        return (7.787 * n) + 16 / 116;
      }
    };
    cy = calc(y);
    return [(116 * cy) - 16, 500 * (calc(x) - cy), 200 * (cy - calc(z))];
  };

  Color.LABtoXYZ = function(L, a, b) {
    var calc, x, xyz, y, z;
    y = (L + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    calc = function(n) {
      var nnn;
      nnn = Math.pow(n, 3);
      if (nnn > 0.008856) {
        return nnn;
      } else {
        return (n - 16 / 116) / 7.787;
      }
    };
    xyz = [Math.min(Color.XYZ.D65.x, Color.XYZ.D65.x * calc(x)), Math.min(Color.XYZ.D65.y, Color.XYZ.D65.y * calc(y)), Math.min(Color.XYZ.D65.y, Color.XYZ.D65.z * calc(z))];
    return xyz;
  };

  Color.XYZtoLUV = function(x, y, z) {
    var L, refU, refV, u, v;
    u = (4 * x) / (x + (15 * y) + (3 * z));
    v = (9 * y) / (x + (15 * y) + (3 * z));
    y = y / 100;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    refU = (4 * Color.XYZ.D65.x) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    refV = (9 * Color.XYZ.D65.y) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    L = (116 * y) - 16;
    return [L, 13 * L * (u - refU), 13 * L * (v - refV)];
  };

  Color.LUVtoXYZ = function(L, u, v) {
    var cubeY, refU, refV, x, y;
    y = (L + 16) / 116;
    cubeY = y * y * y;
    y = cubeY > 0.008856 ? cubeY : (y - 16 / 116) / 7.787;
    refU = (4 * Color.XYZ.D65.x) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    refV = (9 * Color.XYZ.D65.y) / (Color.XYZ.D65.x + (15 * Color.XYZ.D65.y) + (3 * Color.XYZ.D65.z));
    u = u / (13 * L) + refU;
    v = v / (13 * L) + refV;
    y = y * 100;
    x = -1 * (9 * y * u) / ((u - 4) * v - u * v);
    return [x, y, (9 * y - (15 * v * y) - (v * x)) / (3 * v)];
  };

  Color.LABtoLCH = function(L, a, b) {
    var h;
    h = Math.atan2(b, a);
    h = h > 0 ? 180 * h / Math.PI : 360 - (180 * Math.abs(h) / Math.PI);
    return [L, Math.sqrt(a * a + b * b), h];
  };

  Color.LCHtoLAB = function(L, c, h) {
    var radH;
    radH = Math.PI * h / 180;
    return [L, Math.cos(radH) * c, Math.sin(radH) * c];
  };

  Color.LUVtoLCH = function(L, u, v) {
    return LABtoLCH(L, u, v);
  };

  Color.LCHtoLUV = function(L, c, h) {
    return LCHtoLAB(L, c, h);
  };

  return Color;

})(Vector);

this.Color = Color;

//# sourceMappingURL=.map/Color.js.map