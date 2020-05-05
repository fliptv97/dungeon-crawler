const UP_ARROW = 'ArrowUp';
const DOWN_ARROW = 'ArrowDown';
const LEFT_ARROW = 'ArrowLeft';
const RIGHT_ARROW = 'ArrowRight';

class Player {
  constructor(renderer, levelMap, x, y, fov = 60) {
    this._renderer = renderer;
    this._levelMap = levelMap;
    this._position = new Vector2D(x, y);
    this._fov = fov;

    this._fovHeading = 0;
    this._el = null;
  }

  initControlsListener() {
    document.addEventListener("keydown", e => {
      if (e.code === UP_ARROW) {
        this.move(this._levelMap.TILE_SIZE);
      } else if (e.code === DOWN_ARROW) {
        this.move(-this._levelMap.TILE_SIZE);
      } if (e.code === LEFT_ARROW) {
        this.rotate(-90);
      } if (e.code === RIGHT_ARROW) {
        this.rotate(90);
      }
    });
  }

  rotate(angle) {
    this._fovHeading += degreesToRadians(angle);
  }

  move(length) {
    let direction = Vector2D.fromAngle(this._fovHeading);

    direction.setMagnitude(length);

    let vectorsSum = Vector2D.sum(this._position, direction);

    if (this._levelMap.hasWall(vectorsSum.x, vectorsSum.y)) return;

    this._position.add(direction);

    this._el.setAttribute("cx", this._position.x);
    this._el.setAttribute("cy", this._position.y);
  }

  render() {
    this._el = this._renderer.createElement(null, Renderer.TYPES.CIRCLE, {
      cx: this._position.x,
      cy: this._position.y,
      r: 5,
      fill: "#FFF",
    });
  }
}
