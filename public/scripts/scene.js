class Scene {
  static GROUP_NAME = "scene";

  constructor(renderer, player) {
    this._renderer = renderer;
    this._player = player;

    this._groupEl = null;
  }

  render() {
    if (!this._groupEl) {
      this._groupEl = this._renderer.createElement(null, Renderer.TYPES.GROUP, {
        id: Scene.GROUP_NAME,
      });
    } else {
      this._groupEl.innerHTML = "";
    }

    let area = this._renderer.width * this._renderer.height;
    let widthPerRay = this._renderer.width / this._player.rays.length;

    this._player.rays.forEach((ray, i) => {
      let distance =
        ray.distance * Math.cos(ray.angle - this._player.rotationAngle);
      let distanceProjectionPlane =
        this._renderer.width / 2 / Math.tan(this._player.fov / 2);
      let height = (LevelMap.TILE_SIZE / distance) * distanceProjectionPlane;
      let color = map(Math.pow(distance, 2), 0, area, 240, 0);

      this._renderer.createElement(this._groupEl, Renderer.TYPES.RECTANGLE, {
        x: i * widthPerRay,
        y: (this._renderer.height - height) / 2,
        width: widthPerRay + 1, // + 1 to fix line between
        height: height,
        style: `fill: rgb(${color}, ${color}, ${color});`,
      });
    });
  }
}
