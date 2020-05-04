class Ray {
  constructor(renderer, position, angle) {
    this._rendered = renderer;
    this.position = position;
    this.direction = Vector2D.fromAngle(angle);
  }

  setAngle(angle) {
    this.direction = Vector2D.fromAngle(angle);
  }

  cast(line) {
    const x1 = line.startPoint.x;
    const y1 = line.startPoint.y;
    const x2 = line.endPoint.x;
    const y2 = line.endPoint.y;
    const x3 = this.position.x;
    const y3 = this.position.y;
    // We need to sum to form small line, like starting point
    const x4 = this.position.x + this.direction.x;
    const y4 = this.position.y + this.direction.y;

    // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
    // It just works, I don't know math...
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denominator === 0) return null;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -(((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator);

    if (t >= 0 && t <= 1 && u >= 0) {
      const px = x1 + t * (x2 - x1);
      const py = y1 + t * (y2 - y1);

      return new Vector2D(px, py);
    }

    return null;
  }
}
