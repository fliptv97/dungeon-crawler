class Enemy {
  constructor(renderer, x, y, r = 5) {
    this._renderer = renderer;
    this._position = new Vector2D(x, y);
    this._radius = r;

    this._el = null;
  }

  get colliderBox() {
    return {
      x: this._position.x - this._radius,
      y: this._position.y - this._radius,
      width: this._radius * 2,
      height: this._radius * 2,
    };
  }

  get radius() {
    return this._radius;
  }

  get position() {
    return this._position;
  }

  render() {
    this._el = this._renderer.createElement(null, Renderer.TYPES.CIRCLE, {
      cx: this._position.x,
      cy: this._position.y,
      r: this._radius,
      fill: "#F00",
    });
  }
}
