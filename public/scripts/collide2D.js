function collidePointLine(pointX, pointY, x1, y1, x2, y2) {
  let d1 = Vector2D.distance(pointX, pointY, x1, y1);
  let d2 = Vector2D.distance(pointX, pointY, x2, y2);

  let lineLength = Vector2D.distance(x1, y1, x2, y2);

  return d1 + d2 >= lineLength && d1 + d2 <= lineLength;
}

function collideLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  let uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  let uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

function collideLineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  let left = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  // prettier-ignore
  let right = this.collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw,ry + rh);
  let top = this.collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  // prettier-ignore
  let bottom = this.collideLineLine(x1, y1, x2, y2, rx,ry + rh, rx + rw,ry + rh);

  return left || right || top || bottom;
}
