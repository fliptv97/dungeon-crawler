export class Vector2D {
  static fromAngle(angle: number): Vector2D {
    return new Vector2D(Math.cos(angle), Math.sin(angle));
  }

  static distance(v1: Vector2D, v2: Vector2D): number {
    return v2.subtract(v1).getMagnitude();
  }

  static sum(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  constructor(public x: number, public y: number) { }

  add(x: Vector2D | number, y?: number) {
    if (x instanceof Vector2D) {
      this.x += x.x || 0;
      this.y += x.y || 0;
    } else {
      this.x += x || 0;
      this.y += y || 0;
    }

    return this;
  }

  subtract(x: Vector2D | number, y?: number) {
    if (x instanceof Vector2D) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
    } else {
      this.x -= x || 0;
      this.y -= y || 0;
    }

    return this;
  }

  multiply(num: number) {
    this.x *= num;
    this.y *= num;

    return this;
  }

  heading(): number {
    return Math.atan2(this.x, this.y);
  }

  distance(vector: Vector2D): number {
    const copy = new Vector2D(vector.x, vector.y);

    return copy.subtract(this).getMagnitude();
  }

  normalize() {
    const length = this.getMagnitude();

    if (length !== 0) {
      this.multiply(1 / length);
    }

    return this;
  }

  getMagnitudeSquare(): number {
    return this.x * this.x + this.y * this.y;
  }

  getMagnitude(): number {
    return Math.sqrt(this.getMagnitudeSquare());
  }

  setMagnitude(length: number) {
    return this.normalize().multiply(length);
  }
}
