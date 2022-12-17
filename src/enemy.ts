import { Renderer } from "./renderer";
import { Vector2D } from "./vector2D";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Enemy {
  #el?: SVGElement;
  #renderer: Renderer;
  #position: Vector2D;
  #radius: number;

  constructor(renderer: Renderer, x: number, y: number, r = 5) {
    this.#renderer = renderer;
    this.#position = new Vector2D(x, y);
    this.#radius = r;
  }

  get colliderBox(): Box {
    return {
      x: this.#position.x - this.#radius,
      y: this.#position.y - this.#radius,
      width: this.#radius * 2,
      height: this.#radius * 2,
    };
  }

  get radius() {
    return this.#radius;
  }

  get position() {
    return this.#position;
  }

  render() {
    this.#el = this.#renderer.createElement(null, Renderer.ELEMENT_TYPES.CIRCLE, {
      cx: this.#position.x,
      cy: this.#position.y,
      r: this.#radius,
      fill: "#F00",
    });
  }
}
