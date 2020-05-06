class Ray {
  constructor(renderer, level, position, angle) {
    this._renderer = renderer;
    this._level = level;
    this._position = position;
    this._angle = normalizeAngle(angle);
    this._wallHitX = 0;
    this._wallHitY = 0;
    this._distance = 0;

    this._isRayFacingDown = this._angle > 0 && this._angle < Math.PI;
    this._isRayFacingUp = !this._isRayFacingDown;
    this._isRayFacingRight =
      this._angle < 0.5 * Math.PI || this._angle > 1.5 * Math.PI;
    this._isRayFacingLeft = !this._isRayFacingRight;
  }

  get startPoint() {
    return this._position;
  }

  get endPoint() {
    return new Vector2D(this._wallHitX, this._wallHitY);
  }

  get angle() {
    return this._angle;
  }

  get distance() {
    return this._distance;
  }

  cast() {
    let tileSize = Level.TILE_SIZE;

    let xIntercept;
    let yIntercept;
    let xStep;
    let yStep;

    // HORIZONTAL
    let foundHorizontalWallHit = false;
    let horizontalWallHitX = 0;
    let horizontalWallHitY = 0;

    // y-coordinate of the closest horizontal grid intersection
    yIntercept = Math.floor(this._position.y / tileSize) * tileSize;
    yIntercept += this._isRayFacingDown ? tileSize : 0;

    // x-coordinate of the closest horizontal grid intersection
    xIntercept =
      this._position.x +
      (yIntercept - this._position.y) / Math.tan(this._angle);

    yStep = tileSize;
    yStep *= this._isRayFacingUp ? -1 : 1;

    xStep = tileSize / Math.tan(this._angle);
    xStep *= this._isRayFacingLeft && xStep > 0 ? -1 : 1;
    xStep *= this._isRayFacingRight && xStep < 0 ? -1 : 1;

    let nextHorizontalTouchX = xIntercept;
    let nextHorizontalTouchY = yIntercept;

    if (this._isRayFacingUp) nextHorizontalTouchY--;

    // Trying to find a wall
    while (
      nextHorizontalTouchX >= 0 &&
      nextHorizontalTouchX <= this._level.width &&
      nextHorizontalTouchY >= 0 &&
      nextHorizontalTouchY <= this._level.height
    ) {
      if (this._level.hasWall(nextHorizontalTouchX, nextHorizontalTouchY)) {
        foundHorizontalWallHit = true;
        horizontalWallHitX = nextHorizontalTouchX;
        horizontalWallHitY = nextHorizontalTouchY;

        break;
      } else {
        nextHorizontalTouchX += xStep;
        nextHorizontalTouchY += yStep;
      }
    }

    // VERTICAL
    let foundVerticalWallHit = false;
    let verticalWallHitX = 0;
    let verticalWallHitY = 0;

    // x-coordinate of the closest vertical grid intersection
    xIntercept = Math.floor(this._position.x / tileSize) * tileSize;
    xIntercept += this._isRayFacingRight ? tileSize : 0;

    // y-coordinate of the closest vertical grid intersection
    yIntercept =
      this._position.y +
      (xIntercept - this._position.x) * Math.tan(this._angle);

    xStep = tileSize;
    xStep *= this._isRayFacingLeft ? -1 : 1;

    yStep = tileSize * Math.tan(this._angle);
    yStep *= this._isRayFacingUp && yStep > 0 ? -1 : 1;
    yStep *= this._isRayFacingDown && yStep < 0 ? -1 : 1;

    let nextVerticalTouchX = xIntercept;
    let nextVerticalTouchY = yIntercept;

    if (this._isRayFacingLeft) nextVerticalTouchX--;

    // Trying to find a wall
    while (
      nextVerticalTouchX >= 0 &&
      nextVerticalTouchX <= this._level.width &&
      nextVerticalTouchY >= 0 &&
      nextVerticalTouchY <= this._level.height
    ) {
      if (this._level.hasWall(nextVerticalTouchX, nextVerticalTouchY)) {
        foundVerticalWallHit = true;
        verticalWallHitX = nextVerticalTouchX;
        verticalWallHitY = nextVerticalTouchY;

        break;
      } else {
        nextVerticalTouchX += xStep;
        nextVerticalTouchY += yStep;
      }
    }

    // Calculate distances
    let horizontalHitDistance = foundHorizontalWallHit
      ? this._position.distance(
          new Vector2D(horizontalWallHitX, horizontalWallHitY)
        )
      : Number.MAX_VALUE;
    let verticalHitDistance = foundVerticalWallHit
      ? this._position.distance(
          new Vector2D(verticalWallHitX, verticalWallHitY)
        )
      : Number.MAX_VALUE;

    this._wallHitX =
      horizontalHitDistance < verticalHitDistance
        ? horizontalWallHitX
        : verticalWallHitX;
    this._wallHitY =
      horizontalHitDistance < verticalHitDistance
        ? horizontalWallHitY
        : verticalWallHitY;
    this._distance = Math.min(horizontalHitDistance, verticalHitDistance);
  }

  render(parent = null) {
    this._el = this._renderer.createElement(parent, Renderer.TYPES.LINE, {
      x1: this._position.x,
      y1: this._position.y,
      x2: this._wallHitX,
      y2: this._wallHitY,
      style: "stroke-width: 1; stroke-opacity: 0.5; stroke: #FFF;",
    });

    return this._el;
  }
}
