import { Vector2D } from "./Vector2D";

export class Line {
  static create(startX: number, startY: number, endX: number, endY: number): Line {
    const start = new Vector2D(startX, startY);
    const end = new Vector2D(endX, endY);

    return new Line(start, end);
  }

  length: number;

  constructor(public start: Vector2D, public end: Vector2D) {
    this.length = Vector2D.distance(start, end);
  }
}
