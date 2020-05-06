class Scene {
  static GROUP_NAME = "scene";

  constructor(renderer, level) {
    this._renderer = renderer;
    this._level = level;

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

    // WALLS RENDERING
    let area = this._renderer.width * this._renderer.height;
    let widthPerRay = this._renderer.width / this._level.player.rays.length;

    this._level.player.rays.forEach((ray, i) => {
      let distance =
        ray.distance * Math.cos(ray.angle - this._level.player.rotationAngle);
      let distanceProjectionPlane =
        this._renderer.width / 2 / Math.tan(this._level.player.fov / 2);
      let height =
        ((Level.TILE_SIZE - 10) / distance) * distanceProjectionPlane;
      let color = map(Math.pow(distance, 2), 0, area, 210, 0);

      this._renderer.createElement(this._groupEl, Renderer.TYPES.RECTANGLE, {
        x: i * widthPerRay,
        y: (this._renderer.height - height) / 2,
        width: widthPerRay + 1, // + 1 to fix line between
        height: height,
        style: `fill: rgb(${color}, ${color}, ${color});`,
      });
    });

    // Checking if enemy visible
    let enemiesToRender = this._level.enemies.filter((enemy) => {
      let enemyColliderBox = enemy.colliderBox;

      return this._level.player.rays.some((ray) =>
        collideLineRect(
          ray.startPoint.x,
          ray.startPoint.y,
          ray.endPoint.x,
          ray.endPoint.y,
          enemyColliderBox.x,
          enemyColliderBox.y,
          enemyColliderBox.width,
          enemyColliderBox.height
        )
      );
    });

    enemiesToRender.forEach((enemy) => {
      let distance = Vector2D.distance(
        this._level.player.position.x,
        this._level.player.position.y,
        enemy.position.x,
        enemy.position.y
      );
      let angle = Math.atan2(
        enemy.position.y - this._level.player.position.y,
        enemy.position.x - this._level.player.position.x
      );

      angle = normalizeAngle(angle) - this._level.player.rotationAngle;

      let fixedDistance = distance * Math.cos(angle);
      let distanceProjectionPlane =
        this._renderer.width / 2 / Math.tan(this._level.player.fov / 2);
      let height =
        ((Level.TILE_SIZE - 10) / fixedDistance) * distanceProjectionPlane;
      let x = map(
        angle,
        degreesToRadians(-30),
        degreesToRadians(30),
        0,
        this._renderer.width
      );

      let color = map(Math.pow(fixedDistance, 2), 0, area, 240, 0);

      this._renderer.createElement(this._groupEl, Renderer.TYPES.RECTANGLE, {
        x: x - height / 2,
        y: (this._renderer.height - height) / 2,
        width: height,
        height: height,
        style: `fill: rgb(0, 0, ${color})`,
      });
    });
  }
}
