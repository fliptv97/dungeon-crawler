const UP_ARROW = "ArrowUp";
const DOWN_ARROW = "ArrowDown";
const LEFT_ARROW = "ArrowLeft";
const RIGHT_ARROW = "ArrowRight";

class Player {
  constructor(renderer, level, x, y, raysCount = 120, fov = 60) {
    this._renderer = renderer;
    this._level = level;
    this._position = new Vector2D(x, y);
    this._raysCount = raysCount;
    this._fov = degreesToRadians(fov);

    this._rotationAngle = Math.PI * 2 - Math.PI / 2;
    this._el = null;
    this._raysGroupEl = null;
    this._rays = [];
    this._callbacks = [];
  }

  get position() {
    return this._position;
  }

  get fov() {
    return this._fov;
  }

  get rotationAngle() {
    return this._rotationAngle;
  }

  get rays() {
    return this._rays;
  }

  initControlsListener() {
    document.addEventListener("keydown", (e) => {
      if (e.code === UP_ARROW) {
        this.move(Level.TILE_SIZE);
      } else if (e.code === DOWN_ARROW) {
        this.move(-Level.TILE_SIZE);
      } else if (e.code === LEFT_ARROW) {
        this.rotate(-90);
      } else if (e.code === RIGHT_ARROW) {
        this.rotate(90);
      }
    });
  }

  onUpdate(cb) {
    this._callbacks.push(cb);
  }

  _triggerCallbacks() {
    this._callbacks.forEach((cb) => {
      cb();
    });
  }

  rotate(angle) {
    this._rotationAngle = normalizeAngle(
      this._rotationAngle + degreesToRadians(angle)
    );

    this._renderRays();
    this._triggerCallbacks();
  }

  move(length) {
    let direction = Vector2D.fromAngle(this._rotationAngle);

    direction.setMagnitude(length);

    let vectorsSum = Vector2D.sum(this._position, direction);

    if (this._level.hasWall(vectorsSum.x, vectorsSum.y)) return;

    this._position.add(direction);

    this._el.setAttribute("cx", this._position.x);
    this._el.setAttribute("cy", this._position.y);

    this._renderRays();
    this._triggerCallbacks();
  }

  _renderRays() {
    this._rays = [];
    this._raysGroupEl.innerHTML = "";

    for (
      let i = 0, rayAngle = this._rotationAngle - this._fov / 2;
      i < this._raysCount;
      i++, rayAngle += this._fov / this._raysCount
    ) {
      let ray = new Ray(this._renderer, this._level, this._position, rayAngle);

      ray.cast();
      ray.render(this._raysGroupEl);

      this._rays.push(ray);
    }
  }

  render() {
    this._raysGroupEl = this._renderer.createElement(
      null,
      Renderer.TYPES.GROUP,
      {
        id: "rays",
      }
    );

    this._el = this._renderer.createElement(null, Renderer.TYPES.CIRCLE, {
      cx: this._position.x,
      cy: this._position.y,
      r: 5,
      fill: "#00F",
    });

    this._renderRays();

    return this._el;
  }
}
