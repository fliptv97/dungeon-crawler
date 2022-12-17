import { Level } from "./level";
import { Renderer } from "./renderer";
import { Vector2D } from "./vector2D";
import { Ray } from "./ray";
import { degreesToRadians, normalizeAngle } from "./helpers";

const UP_ARROW = "ArrowUp";
const DOWN_ARROW = "ArrowDown";
const LEFT_ARROW = "ArrowLeft";
const RIGHT_ARROW = "ArrowRight";

export class Player {
  #renderer: Renderer;
  #level: Level;
  #position: Vector2D;
  #raysCount: number;
  #fov: number;

  #rotationAngle = Math.PI * 2 - Math.PI / 2;
  #el?: SVGElement;
  #raysGroupEl?: SVGElement;
  #rays: Ray[] = [];
  #callbacks: (() => void)[] = [];

  constructor(renderer: Renderer, level: Level, position: Vector2D, raysCount = 120, fov = 60) {
    this.#renderer = renderer;
    this.#level = level;
    this.#position = position;
    this.#raysCount = raysCount;
    this.#fov = degreesToRadians(fov);
  }

  get position() {
    return this.#position;
  }

  get fov() {
    return this.#fov;
  }

  get rotationAngle() {
    return this.#rotationAngle;
  }

  get rays() {
    return this.#rays;
  }

  initControlsListener(): void {
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

  onUpdate(cb: () => void): void {
    this.#callbacks.push(cb);
  }

  #triggerCallbacks() {
    this.#callbacks.forEach((cb) => {
      cb();
    });
  }

  rotate(angle: number): void {
    this.#rotationAngle = normalizeAngle(
      this.#rotationAngle + degreesToRadians(angle)
    );

    this.#renderRays();
    this.#triggerCallbacks();
  }

  move(length: number): void {
    const direction = Vector2D.fromAngle(this.#rotationAngle);

    direction.setMagnitude(length);

    const vectorsSum = Vector2D.sum(this.#position, direction);

    if (this.#level.hasWall(vectorsSum.x, vectorsSum.y)) {
      return;
    }

    this.#position.add(direction);

    if (!this.#el) {
      throw new Error("Player: There's no element");
    }

    this.#el.setAttribute("cx", this.#position.x.toString());
    this.#el.setAttribute("cy", this.#position.y.toString());

    this.#renderRays();
    this.#triggerCallbacks();
  }

  #renderRays(): void {
    this.#rays = [];

    if (this.#raysGroupEl) {
      this.#raysGroupEl.innerHTML = "";
    }

    for (
      let i = 0, rayAngle = this.#rotationAngle - this.#fov / 2;
      i < this.#raysCount;
      i++, rayAngle += this.#fov / this.#raysCount
    ) {
      const ray = new Ray(this.#renderer, this.#level, this.#position, rayAngle);

      ray.cast();
      ray.render(this.#raysGroupEl);

      this.#rays.push(ray);
    }
  }

  render(): SVGElement {
    this.#raysGroupEl = this.#renderer.createElement(
      null,
      Renderer.ELEMENT_TYPES.GROUP,
      {
        id: "rays",
      }
    );

    this.#el = this.#renderer.createElement(null, Renderer.ELEMENT_TYPES.CIRCLE, {
      cx: this.#position.x,
      cy: this.#position.y,
      r: 5,
      fill: "#00F",
    });

    this.#renderRays();

    return this.#el;
  }
}
