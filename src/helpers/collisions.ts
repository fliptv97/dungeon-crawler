import { Line, Vector2D } from "../geometry";
import { ColliderBox } from "../types";

export function collidePointLine(point: Vector2D, line: Line): boolean {
  const d1 = Vector2D.distance(point, line.start);
  const d2 = Vector2D.distance(point, line.end);

  return d1 + d2 >= line.length && d1 + d2 <= line.length;
}

export function collideLineLine(l1: Line, l2: Line): boolean {
  const uA =
    ((l2.end.x - l2.start.x) * (l1.start.y - l2.start.y) - (l2.end.y - l2.start.y) * (l1.start.x - l2.start.x)) /
    ((l2.end.y - l2.start.y) * (l1.end.x - l1.start.x) - (l2.end.x - l2.start.x) * (l1.end.y - l1.start.y));
  const uB =
    ((l1.end.x - l1.start.x) * (l1.start.y - l2.start.y) - (l1.end.y - l1.start.y) * (l1.start.x - l2.start.x)) /
    ((l2.end.y - l2.start.y) * (l1.end.x - l1.start.x) - (l2.end.x - l2.start.x) * (l1.end.y - l1.start.y));

  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

export function collideLineRect(
  line: Line,
  rect: ColliderBox,
): boolean {
  const left
    = collideLineLine(line, Line.create(rect.x, rect.y, rect.x, rect.y + rect.height));
  const right
    = collideLineLine(line, Line.create(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height));
  const top
    = collideLineLine(line, Line.create(rect.x, rect.y, rect.x + rect.width, rect.y));
  const bottom
    = collideLineLine(line, Line.create(rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height));

  return left || right || top || bottom;
}
