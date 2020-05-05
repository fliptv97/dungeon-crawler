class Vector2D {
  static fromAngle(angle) {
    return new Vector2D(Math.cos(angle), Math.sin(angle));
  }

  static sum(v1, v2) {
    if (v1 instanceof Vector2D && v2 instanceof Vector2D) {
      return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
      };
    }

    return new Error("v1 or v2 isn't instance of Vector2D");
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x, y) {
    if (x instanceof Vector2D) {
      this.x += x.x || 0;
      this.y += x.y || 0;
    } else {
      this.x += x || 0;
      this.y += y || 0;
    }

    return this;
  }

  subtract(x, y) {
    if (x instanceof Vector2D) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
    } else {
      this.x -= x || 0;
      this.y -= y || 0;
    }

    return this;
  }

  multiply(num) {
    this.x *= num;
    this.y *= num;

    return this;
  }

  heading() {
    return Math.atan2(this.x, this.y);
  }

  distance(vector) {
    let copy = new Vector2D(vector.x, vector.y);

    return copy.subtract(this).getMagnitude();
  }

  normalize() {
    let length = this.getMagnitude();

    if (length !== 0) this.multiply(1 / length);

    return this;
  }

  getMagnitudeSquare() {
    return this.x * this.x + this.y * this.y;
  }

  getMagnitude() {
    return Math.sqrt(this.getMagnitudeSquare());
  }

  setMagnitude(length) {
    return this.normalize().multiply(length);
  }
}
