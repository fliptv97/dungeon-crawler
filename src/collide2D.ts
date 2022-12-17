import { Vector2D } from "./vector2D";

export function collidePointLine(
  pointX: number,
  pointY: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  const d1 = Vector2D.distance(pointX, pointY, x1, y1);
  const d2 = Vector2D.distance(pointX, pointY, x2, y2);

  const lineLength = Vector2D.distance(x1, y1, x2, y2);

  return d1 + d2 >= lineLength && d1 + d2 <= lineLength;
}

export function collideLineLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): boolean {
  const uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  const uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

export function collideLineRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  const left = collideLineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const right = collideLineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const top = collideLineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const bottom = collideLineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  return left || right || top || bottom;
}
