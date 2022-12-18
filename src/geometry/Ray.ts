import { Level, TILE_SIZE } from "../Level";
import { Renderer } from "../Renderer";
import { Vector2D } from "./Vector2D";
import { normalizeAngle } from "../helpers/geometry";

export class Ray {
  #renderer: Renderer;
  #level: Level;
  #position: Vector2D;
  #el?: SVGElement;

  #angle: number;
  #wallHitX = 0;
  #wallHitY = 0;
  #distance = 0;

  #isRayFacingDown: boolean;
  #isRayFacingUp: boolean;
  #isRayFacingRight: boolean;
  #isRayFacingLeft: boolean;

  constructor(renderer: Renderer, level: Level, position: Vector2D, angle: number) {
    this.#renderer = renderer;
    this.#level = level;
    this.#position = position;
    this.#angle = normalizeAngle(angle);

    this.#isRayFacingDown = this.#angle > 0 && this.#angle < Math.PI;
    this.#isRayFacingUp = !this.#isRayFacingDown;
    this.#isRayFacingRight =
      this.#angle < 0.5 * Math.PI || this.#angle > 1.5 * Math.PI;
    this.#isRayFacingLeft = !this.#isRayFacingRight;
  }

  get startPoint() {
    return this.#position;
  }

  get endPoint() {
    return new Vector2D(this.#wallHitX, this.#wallHitY);
  }

  get angle() {
    return this.#angle;
  }

  get distance() {
    return this.#distance;
  }

  cast(): void {
    let xIntercept;
    let yIntercept;
    let xStep;
    let yStep;

    // HORIZONTAL
    let foundHorizontalWallHit = false;
    let horizontalWallHitX = 0;
    let horizontalWallHitY = 0;

    // y-coordinate of the closest horizontal grid intersection
    yIntercept = Math.floor(this.#position.y / TILE_SIZE) * TILE_SIZE;
    yIntercept += this.#isRayFacingDown ? TILE_SIZE : 0;

    // x-coordinate of the closest horizontal grid intersection
    xIntercept =
      this.#position.x +
      (yIntercept - this.#position.y) / Math.tan(this.#angle);

    yStep = TILE_SIZE;
    yStep *= this.#isRayFacingUp ? -1 : 1;

    xStep = TILE_SIZE / Math.tan(this.#angle);
    xStep *= this.#isRayFacingLeft && xStep > 0 ? -1 : 1;
    xStep *= this.#isRayFacingRight && xStep < 0 ? -1 : 1;

    let nextHorizontalTouchX = xIntercept;
    let nextHorizontalTouchY = yIntercept;

    if (this.#isRayFacingUp) {
      nextHorizontalTouchY--;
    }

    // Trying to find a wall
    while (
      nextHorizontalTouchX >= 0 &&
      nextHorizontalTouchX <= this.#level.width &&
      nextHorizontalTouchY >= 0 &&
      nextHorizontalTouchY <= this.#level.height
    ) {
      if (this.#level.hasWall(nextHorizontalTouchX, nextHorizontalTouchY)) {
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
    xIntercept = Math.floor(this.#position.x / TILE_SIZE) * TILE_SIZE;
    xIntercept += this.#isRayFacingRight ? TILE_SIZE : 0;

    // y-coordinate of the closest vertical grid intersection
    yIntercept =
      this.#position.y +
      (xIntercept - this.#position.x) * Math.tan(this.#angle);

    xStep = TILE_SIZE;
    xStep *= this.#isRayFacingLeft ? -1 : 1;

    yStep = TILE_SIZE * Math.tan(this.#angle);
    yStep *= this.#isRayFacingUp && yStep > 0 ? -1 : 1;
    yStep *= this.#isRayFacingDown && yStep < 0 ? -1 : 1;

    let nextVerticalTouchX = xIntercept;
    let nextVerticalTouchY = yIntercept;

    if (this.#isRayFacingLeft) {
      nextVerticalTouchX--;
    }

    // Trying to find a wall
    while (
      nextVerticalTouchX >= 0 &&
      nextVerticalTouchX <= this.#level.width &&
      nextVerticalTouchY >= 0 &&
      nextVerticalTouchY <= this.#level.height
    ) {
      if (this.#level.hasWall(nextVerticalTouchX, nextVerticalTouchY)) {
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
    const horizontalHitDistance = foundHorizontalWallHit
      ? this.#position.distance(
        new Vector2D(horizontalWallHitX, horizontalWallHitY)
      )
      : Number.MAX_VALUE;
    const verticalHitDistance = foundVerticalWallHit
      ? this.#position.distance(
        new Vector2D(verticalWallHitX, verticalWallHitY)
      )
      : Number.MAX_VALUE;

    this.#wallHitX =
      horizontalHitDistance < verticalHitDistance
        ? horizontalWallHitX
        : verticalWallHitX;
    this.#wallHitY =
      horizontalHitDistance < verticalHitDistance
        ? horizontalWallHitY
        : verticalWallHitY;
    this.#distance = Math.min(horizontalHitDistance, verticalHitDistance);
  }

  render(parent: HTMLElement | SVGElement | null = null): SVGElement {
    this.#el = this.#renderer.add(parent, "line", {
      x1: this.#position.x,
      y1: this.#position.y,
      x2: this.#wallHitX,
      y2: this.#wallHitY,
      style: "stroke-width: 1; stroke-opacity: 0.5; stroke: #FFF;",
    });

    return this.#el;
  }
}
