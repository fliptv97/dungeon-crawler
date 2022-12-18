import { Renderer } from "../Renderer";
import { Vector2D } from "../geometry";

import { ColliderBox } from "../types";

export class Enemy {
  #renderer: Renderer;
  #position: Vector2D;
  #radius: number;

  constructor(renderer: Renderer, position: Vector2D, r = 5) {
    this.#renderer = renderer;
    this.#position = position;
    this.#radius = r;
  }

  get position() {
    return this.#position;
  }

  get radius() {
    return this.#radius;
  }

  get colliderBox(): ColliderBox {
    return {
      x: this.#position.x - this.#radius,
      y: this.#position.y - this.#radius,
      width: this.#radius * 2,
      height: this.#radius * 2,
    };
  }

  render() {
    this.#renderer.add(null, "circle", {
      cx: this.#position.x,
      cy: this.#position.y,
      r: this.#radius,
      fill: "#f00",
    });
  }
}
