import { Level } from "./level";
import { Renderer } from "./renderer";
import { Vector2D } from "./vector2D";
import { map, normalizeAngle, degreesToRadians } from "./helpers";
import { collideLineRect } from "./collide2D";

export class Scene {
  static GROUP_NAME = "scene" as const;

  #renderer: Renderer;
  #level: Level;
  #groupEl?: SVGElement;

  constructor(renderer: Renderer, level: Level) {
    this.#renderer = renderer;
    this.#level = level;
  }

  #initGroup(): void {
    if (!this.#groupEl) {
      this.#groupEl = this.#renderer.createElement(null, Renderer.ELEMENT_TYPES.GROUP, {
        id: Scene.GROUP_NAME,
      });
    } else {
      this.#groupEl.innerHTML = "";
    }
  }

  #getWallsToRender() {
    const area = this.#renderer.width * this.#renderer.height;
    const player = this.#level.player;

    if (!player) {
      throw new Error("Scene: There's no Player instance in Level");
    }

    const widthPerRay = this.#renderer.width / player.rays.length;

    return player.rays.map((ray, i) => {
      const distance =
        ray.distance * Math.cos(ray.angle - player.rotationAngle);
      const distanceProjectionPlane =
        this.#renderer.width / 2 / Math.tan(player.fov / 2);
      const height =
        ((Level.TILE_SIZE - 10) / distance) * distanceProjectionPlane;
      const color = map(Math.pow(distance, 2), 0, area, 210, 0);

      return {
        distance,
        attrs: {
          x: i * widthPerRay,
          y: (this.#renderer.height - height) / 2,
          width: widthPerRay + 1, // + 1 to fix line between
          height: height,
          style: `fill: rgb(${color}, ${color}, ${color});`,
          "data-distance": distance,
        },
      };
    });
  }

  #getEnemiesToRender() {
    const area = this.#renderer.width * this.#renderer.height;
    const player = this.#level.player;

    if (!player) {
      throw new Error("Scene: There's no Player instance in Level");
    }

    const visibleEnemies = this.#level.enemies.filter((enemy) => {
      const enemyColliderBox = enemy.colliderBox;

      return player.rays.some((ray) =>
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

    return visibleEnemies.map((enemy) => {
      const distance = Vector2D.distance(
        player.position.x,
        player.position.y,
        enemy.position.x,
        enemy.position.y
      );
      let angle = Math.atan2(
        enemy.position.y - player.position.y,
        enemy.position.x - player.position.x
      );

      angle = normalizeAngle(angle) - player.rotationAngle;

      const fixedDistance = distance * Math.cos(angle);
      const distanceProjectionPlane =
        this.#renderer.width / 2 / Math.tan(player.fov / 2);
      const height =
        ((Level.TILE_SIZE - 10) / fixedDistance) * distanceProjectionPlane;
      const x = map(
        angle,
        degreesToRadians(-30),
        degreesToRadians(30),
        0,
        this.#renderer.width
      );

      const color = map(Math.pow(fixedDistance, 2), 0, area, 240, 0);

      return {
        distance: fixedDistance,
        attrs: {
          x: x - height / 2,
          y: (this.#renderer.height - height) / 2,
          width: height,
          height: height,
          style: `fill: rgb(0, 0, ${color})`,
          "data-distance": fixedDistance,
        },
      };
    });
  }

  render(): void | never {
    this.#initGroup();

    const wallsToRender = this.#getWallsToRender();
    const enemiesToRender = this.#getEnemiesToRender();

    const objectsToRender = [...wallsToRender, ...enemiesToRender];
    const groupEl = this.#groupEl;

    if (!groupEl) {
      throw new Error("Scene: There's no groupEl");
    }

    objectsToRender
      .sort((a, b) => b.distance - a.distance)
      .forEach((obj) => {
        this.#renderer.createElement(
          groupEl,
          Renderer.ELEMENT_TYPES.RECTANGLE,
          obj.attrs
        );
      });
  }
}
