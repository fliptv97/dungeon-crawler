const UP_ARROW = "ArrowUp";
const DOWN_ARROW = "ArrowDown";
const LEFT_ARROW = "ArrowLeft";
const RIGHT_ARROW = "ArrowRight";

class Player {
  constructor(renderer, levelMap, x, y, fov = 60) {
    this._renderer = renderer;
    this._levelMap = levelMap;
    this._position = new Vector2D(x, y);
    this._fov = degreesToRadians(fov);

    this._rotationAngle = Math.PI / 2;
    this._el = null;
  }

  initControlsListener() {
    document.addEventListener("keydown", (e) => {
      if (e.code === UP_ARROW) {
        this.move(this._levelMap.TILE_SIZE);
      } else if (e.code === DOWN_ARROW) {
        this.move(-this._levelMap.TILE_SIZE);
      } else if (e.code === LEFT_ARROW) {
        this.rotate(-90);
      } else if (e.code === RIGHT_ARROW) {
        this.rotate(90);
      }
    });
  }

  rotate(angle) {
    this._rotationAngle += degreesToRadians(angle);

    this._renderRays();
  }

  move(length) {
    let direction = Vector2D.fromAngle(this._rotationAngle);

    direction.setMagnitude(length);

    let vectorsSum = Vector2D.sum(this._position, direction);

    if (this._levelMap.hasWall(vectorsSum.x, vectorsSum.y)) return;

    this._position.add(direction);

    this._el.setAttribute("cx", this._position.x);
    this._el.setAttribute("cy", this._position.y);

    this._renderRays();
  }

  _renderRays() {
    Renderer.removeElement("rays");

    let raysGroupEl = this._renderer.createElement(null, Renderer.TYPES.GROUP, {
      id: "rays",
    });

    for (
      let i = 0, rayAngle = this._rotationAngle - this._fov / 2;
      i < 60;
      i++, rayAngle += this._fov / 60
    ) {
      let ray = new Ray(
        this._levelMap,
        this._renderer,
        this._position,
        rayAngle
      );

      ray.cast();
      ray.render(raysGroupEl);
    }
  }

  render() {
    this._el = this._renderer.createElement(null, Renderer.TYPES.CIRCLE, {
      cx: this._position.x,
      cy: this._position.y,
      r: 5,
      fill: "#FFF",
    });

    this._renderRays();

    return this._el;
  }
}
