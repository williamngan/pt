describe("Util", function() {
  it("can convert angle to radian", function() {
    return expect(Util.toRadian(47)).toBe(0.8203047484373349);
  });
  it("can convert radian to degree", function() {
    return expect(Util.toDegree(1.2567)).toEqual(72.00360611409054);
  });
  it("can bound a range between 0 to max", function() {
    return expect(Util.boundAngle(-10, true)).toBe(350);
  });
  it("can bound a range between -max/2 to max/2", function() {
    return expect(Util.boundRadian(-Const.two_pi)).toBe(0);
  });
  return it("can equal values with threshold", function() {
    return expect(Util.same(0.123456, 0.1234, 0.0001)).toBe(true);
  });
});

describe("Point", function() {
  it("can be created with 1 parameters", function() {
    return expect(new Point(10).x).toEqual(10);
  });
  it("can be created with 2 parameters", function() {
    return expect(new Point(10, 20).y).toEqual(20);
  });
  it("can be created with 3 parameters", function() {
    return expect(new Point(10, 20, 30).z).toEqual(30);
  });
  it("can be created with an array", function() {
    return expect(new Point([1, 2, 3]).z).toEqual(3);
  });
  it("can be created with another point", function() {
    return expect(new Point(new Point(50, 100)).y).toEqual(100);
  });
  it("can find quadrant top-left", function() {
    return expect(new Point(50, 100).quadrant(new Point(10, 90))).toEqual(Const.top_left);
  });
  it("can find quadrant bottom-right", function() {
    return expect(new Point(50, 100).quadrant(new Point(51, 100.1))).toEqual(Const.bottom_right);
  });
  it("can find quadrant right", function() {
    return expect(new Point(50, 100).quadrant(new Point(50.1, 100), 0.01)).toEqual(Const.right);
  });
  it("can find quadrant top", function() {
    return expect(new Point(50, 100).quadrant(new Point(50, 99))).toEqual(Const.top);
  });
  return it("can check if another point is near", function() {
    return expect(new Point(50.1, 100.1).near(new Point(50, 100), 0.1001)).toEqual(true);
  });
});

describe("Vector", function() {
  it("can be created with 3 parameters", function() {
    return expect(new Vector(10, 20, 30).z).toEqual(30);
  });
  it("can be created with an array", function() {
    return expect(new Vector([1, 2, 3]).z).toEqual(3);
  });
  it("can be created with another point", function() {
    return expect(new Vector(new Point(50, 100)).y).toEqual(100);
  });
  it("can add scalar value", function() {
    return expect(new Vector(10, 20).add(2).y).toEqual(22);
  });
  it("can add list of values", function() {
    return expect(new Vector(10, 20).add(2, 1).y).toEqual(21);
  });
  it("can add scalar and return new point", function() {
    return expect(new Vector(10, 20).$add(2).y).toEqual(22);
  });
  it("can add list of values and return new point", function() {
    return expect(new Vector(10, 20).$add(2, 1).y).toEqual(21);
  });
  it("can add object and return new point", function() {
    return expect(new Vector(10, 20).$add([2, 3]).y).toEqual(23);
  });
  it("can subtract scalar value", function() {
    return expect(new Vector(10, 20).subtract(2).y).toEqual(18);
  });
  it("can subtract list of values", function() {
    return expect(new Vector(10, 20).subtract([2, 3]).y).toEqual(17);
  });
  it("can subtract and return new point", function() {
    return expect(new Vector(10, 20).$subtract(2, 5).y).toEqual(15);
  });
  it("can chain calculations", function() {
    return expect(new Vector(10, 20).subtract([1, 2]).add(100, 100).y).toEqual(118);
  });
  it("can multiply scalar value", function() {
    return expect(new Vector(12).multiply(3).x).toEqual(36);
  });
  it("can multiply another object", function() {
    return expect(new Vector(12, 12, 12).multiply([3, 2, 4]).z).toEqual(48);
  });
  it("can divide scalar value", function() {
    return expect(new Vector(12).divide(4).x).toEqual(3);
  });
  it("can multiply another object", function() {
    return expect(new Vector(12, 12, 12).divide([3, 2, 4]).y).toEqual(6);
  });
  it("can check equality with another point", function() {
    return expect(new Vector(12.434, 2.122, 3.433).equal(12.43401, 2.122, 3.433)).toEqual(false);
  });
  it("can find a minimum point", function() {
    return expect(new Vector(1, 2, 3).min(3, 2, 1).equal(1, 2, 1)).toEqual(true);
  });
  it("can find a maximum point", function() {
    return expect(new Vector(1, 2, 3).max(3, 2, 1).equal(3, 2, 3)).toEqual(true);
  });
  it("can calculate dot product", function() {
    return expect(new Vector(-4, 1).dot(new Vector(1, 2))).toEqual(-2);
  });
  it("can calculate projection", function() {
    return expect(new Vector(1, 2).projection(new Vector(-4, 1)).near(new Point(-2 / 5, -4 / 5, 0), 0.01)).toEqual(true);
  });
  it("can chain complex calcuations", function() {
    return expect(new Vector(1, 2, 3).add(5).subtract(0, 0, 6).multiply(new Vector(5, 0, 1)).$divide([1, 1, 1 / 3]).z).toEqual(6);
  });
  it("can calculate its xy angle", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle() * 10000)).toEqual(10636);
  });
  it("can calculate its yz angle", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle('yz') * 10000)).toEqual(7266);
  });
  it("can calculate its xz angle", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle('xz') * 10000)).toEqual(10121);
  });
  it("can calculate xy angle to another point", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle({
      x: 0.7,
      y: 0.5
    }) * 10000)).toEqual(-11072);
  });
  it("can calculate yz angle to another point", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle("yz", new Point(0.7, 0.5, 1)) * 10000)).toEqual(26779);
  });
  it("can calculate xz angle to another point", function() {
    return expect(Math.floor(new Vector(0.5, 0.9, 0.8).angle("xz", new Point(0.7, 0.5, 1)) * 10000)).toEqual(7853);
  });
  it("can calculate its xyz magnitude", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude() * 10000)).toEqual(296984);
  });
  it("can calculate its xy magnitude", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("xy") * 10000)).toEqual(174928);
  });
  it("can calculate its yz magnitude", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("yz") * 10000)).toEqual(256320);
  });
  it("can calculate its xz magnitude", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("xz") * 10000)).toEqual(283019);
  });
  it("can calculate its xyz magnitude squared", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude(false))).toEqual(882);
  });
  it("can calculate its xz magnitude squared", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("xz", false))).toEqual(801);
  });
  it("can calculate xyz magnitude to another point", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude({
      x: 7,
      y: 5,
      z: 10
    }) * 10000)).toEqual(166132);
  });
  it("can calculate xy magnitude to another point", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("xy", new Point(7, 5)) * 10000)).toEqual(89442);
  });
  it("can calculate yz magnitude to another point", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("yz", {
      y: 5,
      z: 10
    }) * 10000)).toEqual(145602);
  });
  it("can calculate xz magnitude to another point", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("xz", {
      x: 7,
      y: 5,
      z: 10
    }) * 10000)).toEqual(161245);
  });
  it("can calculate its yz magnitude to another pt squared", function() {
    return expect(Math.floor(new Vector(15, 9, 24).magnitude("yz", new Point(0, 5, 19), false))).toEqual(41);
  });
  it("can normalize", function() {
    return expect(new Vector(15, 9, 24).$normalize().magnitude()).toEqual(1);
  });
  return it("can normalize itself", function() {
    return expect(new Vector(15, 9, 24).normalize().x).toBeLessThan(1);
  });
});

describe("Pair", function() {
  it("can connect to another point", function() {
    return expect(new Pair(8, -3).connect(6, 3, 2).p1.equal(new Point(6, 3, 2))).toEqual(true);
  });
  it("can find relative point", function() {
    return expect(new Pair(8, -3, 1).connect(6, 3).relative().size().equal(new Point(6, 3, 0))).toEqual(true);
  });
  it("can add to both points", function() {
      return expect(new Pair(2,2,1).connect(3,4).pointsAdd(1,2,3).equal( new Pair(3,4,4).connect(4,6,3) )).toEqual(true);
    });
  it("can add to both points as new Pair", function() {
      return expect(new Pair(2,2,1).connect(3,4).$pointsAdd(1,2,3).equal( new Pair(3,4,4).connect(4,6,3) )).toEqual(true);
    });
  it("can subtract from both points", function() {
      return expect(new Pair(2,2).connect(3,4,5).pointsSubtract(1,2,3).equal( new Pair(1,0,-3).connect(2,2,2) )).toEqual(true);
    });
  it("can subtract from both points as new Pair", function() {
      return expect(new Pair(2,2).connect(3,4,5).$pointsSubtract(1,2,3).equal( new Pair(1,0,-3).connect(2,2,2) )).toEqual(true);
    });
  it("can multiply with both points", function() {
      return expect(new Pair(1,2).connect(3,2,1).pointsMultiply(2).equal( new Pair(2,4).connect(6,4,2) )).toEqual(true);
    });
  it("can multiply with both points as new Pair", function() {
      return expect(new Pair(1,2).connect(3,2,1).$pointsMultiply(2,3,4).equal( new Pair(2,6).connect(6,6,4) )).toEqual(true);
    });
  it("can divide from both points", function() {
        return expect(new Pair(1,2).connect(3,2,1).pointsDivide(2).equal( new Pair(0.5,1).connect(3/2, 1, 0.5) )).toEqual(true);
      });
  it("can divide with both points as new Pair", function() {
      return expect(new Pair(1,2).connect(3,2,1).$pointsDivide(2,3,4).equal( new Pair(0.5, 2/3).connect(3/2, 2/3, 1/4) )).toEqual(true);
    });
  it("can find bounding box", function() {
    return expect(new Pair(3, 1, -5).connect(-2, 5, 3).bounds().equal(new Rectangle(-2, 1, -5).connect(3, 5, 3))).toEqual(true);
  });
  it("can intepolate between 2 points", function() {
    return expect(new Pair(8, -3).connect(6, 3).interpolate(0.5).equal(new Point(7, 0))).toEqual(true);
  });
  it("can intepolate between relative vector", function() {
    return expect(new Pair(8, -3, 2).connect(6, 3, 1).interpolate(0.5, true).equal(new Point(11, -1.5, 2.5))).toEqual(true);
  });
  it("can find distance", function() {
    return expect(new Pair(3, 2, 1).connect(2, 3, 4).length(false)).toEqual(1 + 1 + 9);
  });
  it("can find width and height", function() {
    return expect(new Pair(3, 2, 1).connect(2, 3, 4).size().equal(new Point(1, 1, 3))).toBe(true);
  });
  it("can move to new location", function() {
    return expect(new Pair(10, 10).connect(30, 20).moveTo(20, -40).p1.equal(new Point(40, -30))).toBe(true);
  });
  return it("can move by certain amount", function() {
    return expect(new Pair(10, 10).connect(30, 20).moveBy(20, -40).p1.equal(new Point(50, -20))).toBe(true);
  });
});

describe("Line", function() {
  it("can calculate slope between 2 points", function() {
    return expect(Line.slope(new Point(3, -2), new Point(9, 2), Const.xy)).toBe(2 / 3);
  });
  it("can calculate x intercept", function() {
    return expect(Line.intercept(new Point(7, 3), new Point(3, -4), Const.xy).xi).toBe(37 / 7);
  });
  it("can calculate y intercept", function() {
    return expect(Line.intercept(new Point(6, 4), new Point(2, 2), Const.xy).yi).toBe(1);
  });
  it("can check perpendicular lines", function() {
    return expect(Line.isPerpendicularLine(new Pair(2, 3).connect(4, -1), new Pair(6, 0).connect(-2, -4))).toBe(true);
  });
  it("can create perpendicular line", function() {
    return expect(new Line(20, 30).connect(120, 70).getPerpendicularLine(0.9, 20, true).p1.x).toBe(117.42781352708208);
  });
  it("can check infinite line intersection", function() {
    return expect(new Line(5, 4.5).connect(10, 2).intersectPath(new Line(0, 3).connect(-4, -5)).equal(new Point(1.6, 6.2))).toBe(true);
  });
  it("can check infinite line intersection in different axis", function() {
    return expect(new Line(0, 5, 4.5).connect(0, 10, 2).intersectPath(new Line(0, 0, 3).connect(0, -4, -5), Const.yz).equal(new Vector(0, 1.6, 6.2))).toBe(true);
  });
  it("can distinguish path and segment intersection", function() {
    return expect(new Line(5, 4.5).connect(10, 2).intersectLine(new Line(0, 3).connect(-4, -5))).toBe(false);
  });
  it("can check line segment intersection", function() {
    return expect(new Line(0, 0).connect(60, 160).intersectPath(new Line(0, 80).connect(80, 0)).equal(new Point(21.81818181818182, 58.18181818181819))).toBe(true);
  });
  return it("can reflect a point along a line", function() {
    return expect(new Vector(228, 100).reflect2D(new Line(200, 100).connect(500, 300)).floor().equal(new Point(210, 125))).toBe(true);
  });
});

describe("Rectangle", function() {
  it("can connect like Pair and calculate center", function() {
    return expect(new Rectangle(2, 1).connect(12, 7).center.equal(new Point(7, 4))).toBe(true);
  });
  it("can resize", function() {
    return expect(new Rectangle(2, 1).connect(12, 7).resizeBy(-2, -2).center.equal(new Point(6, 3))).toBe(true);
  });
  it("can resize from center without moving center", function() {
    return expect(new Rectangle(2, 1).connect(12, 7).resizeCenterBy(-2, -2).center.equal(new Point(7, 4))).toBe(true);
  });
  it("can resize from center", function() {
    return expect(new Rectangle(2, 1).connect(12, 7).resizeCenterBy(-2, -2).equal(new Point(3, 2))).toBe(true);
  });
  it("can find union of 2 bounds", function() {
    return expect(new Rectangle(10, 10).connect(20, 12).$enclose(new Rectangle(8, 8).connect(2.8, 2.8)).equal(new Rectangle(2.8, 2.8).connect(20, 12))).toBe(true);
  });
  it("can check intersection of 2 bounds", function() {
    return expect(new Rectangle(0, 2).connect(2.99, 7).hasIntersect(new Rectangle(3, 2).connect(5, 7))).toBe(false);
  });
  return it("can find intersect bounds", function() {
    return expect(new Rectangle(0, 2).connect(3, 7).hasIntersect(new Rectangle(-2, 3).connect(7, 5), true)[1].equal(new Point(3, 5))).toBe(true);
  });
});

describe("Circle", function() {
  it("can check intersection with circle", function() {
    return expect(new Circle(200, 200).setRadius(100).hasIntersect(new Circle(283, 76).setRadius(50))).toBe(true);
  });
  it("can check non-intersection with circle", function() {
    return expect(new Circle(200, 200).setRadius(100).hasIntersect(new Circle(285, 76).setRadius(50))).toBe(false);
  });
  it("can check ray intersection with circle", function() {
    return expect(new Circle(200, 200, 0, 100).intersectPath(new Line(476, 229).connect(579, 249))[1].near(new Point(299.76532199555754, 194.79896202481237), 0.1)).toBe(true);
  });
  return it("can check line segment intersection with circle", function() {
    return expect(new Circle(200, 200, 0, 100).intersectPath(new Line(41, 140).connect(141, 160))[0].near(new Point(111.18857935162289, 154.03771587032458), 0.1)).toBe(true);
  });
});

describe("Color", function() {
  it("can convert to hex string", function() {
    return expect(new Color(0, 233, 0).hex()).toEqual('#00e900');
  });
  it("can convert to rgba string", function() {
    return expect(new Color(22, 233, 85, 0.3).rgba()).toEqual('rgba(22, 233, 85, 0.3)');
  });
  it("can RGB convert to HSL", function() {
    return expect(Math.abs(Color.RGBtoHSL(22, 233, 85)[1] - 0.83)).toBeLessThan(0.01);
  });
  it("can HSL convert to RGB", function() {
    return expect(Math.abs(Color.HSLtoRGB(117, 0.71, 0.5)[1] - 218)).toBeLessThan(1);
  });
  it("can RGB convert to HSB", function() {
    return expect(Math.abs(Color.RGBtoHSB(254, 210, 8)[0] - 49)).toBeLessThan(1);
  });
  it("can HSB convert to RGB", function() {
    return expect(Math.abs(Color.HSBtoRGB(18, 0.73, 0.11)[2] - 7)).toBeLessThan(1);
  });
  it("can convert mode to HSB", function() {
    return expect(new Color(22, 233, 85).setMode('hsb').hex()).toEqual('#16e954');
  });
  it("can convert mode to HSL", function() {
    return expect(new Color(22, 233, 85).setMode('hsl').hex()).toEqual('#16e955');
  });
  it("can convert mode to RGB", function() {
    return expect(new Color(137, 0.905, 0.913, 1, 'hsb').setMode('rgb').hex()).toEqual('#16e851');
  });
  return it("can convert between RGB and XYZ", function() {
    var rgb, rgb2, xyz;
    rgb = new Color(255, 110, 0);
    xyz = Color.RGBtoXYZ(rgb.x, rgb.y, rgb.z);
    rgb2 = Color.XYZtoRGB(xyz[0], xyz[1], xyz[2]);
    return expect(rgb.x === rgb2[0] && rgb.y === rgb2[1] && rgb.z === rgb2[2]).toBe(true);
  });
});
