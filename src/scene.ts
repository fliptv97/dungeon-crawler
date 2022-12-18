import { Level, TILE_SIZE } from "./Level";
import { Renderer } from "./Renderer";
import { normalizeAngle, degreesToRadians, map } from "./helpers";
import { collideLineRect } from "./helpers/collisions";
import { Line } from "./geometry/Line";

export class Scene {
  #renderer: Renderer;
  #level: Level;
  #groupEl?: SVGElement;

  constructor(renderer: Renderer, level: Level) {
    this.#renderer = renderer;
    this.#level = level;
  }

  #initGroup(): void {
    if (!this.#groupEl) {
      this.#groupEl = this.#renderer.add(null, "g", {
        id: "scene",
      });
    } else {
      this.#groupEl.innerHTML = "";
    }
  }

  #getWallsToRender() {
    const area = this.#renderer.width * this.#renderer.height;

    const widthPerRay = this.#renderer.width / this.#level.player.rays.length;

    return this.#level.player.rays.map((ray, i) => {
      const distance = ray.distance * Math.cos(ray.angle - this.#level.player.rotationAngle);
      const distanceProjectionPlane = this.#renderer.width / 2 / Math.tan(this.#level.player.fov / 2);
      const height = ((TILE_SIZE - 10) / distance) * distanceProjectionPlane;
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

    const visibleEnemies = this.#level.enemies.filter((enemy) => (
      this.#level.player.rays.some((ray) => (
        collideLineRect(new Line(ray.startPoint, ray.endPoint), enemy.colliderBox)
      ))
    ));

    return visibleEnemies.map((enemy) => {
      const distance = this.#level.player.position.distance(enemy.position);
      const angle = normalizeAngle(Math.atan2(
        enemy.position.y - this.#level.player.position.y,
        enemy.position.x - this.#level.player.position.x
      )) - this.#level.player.rotationAngle;

      const fixedDistance = distance * Math.cos(angle);
      const distanceProjectionPlane = this.#renderer.width / 2 / Math.tan(this.#level.player.fov / 2);
      const height = ((TILE_SIZE - 10) / fixedDistance) * distanceProjectionPlane;
      const x = map(angle, degreesToRadians(-30), degreesToRadians(30), 0, this.#renderer.width);

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

  render(): void {
    this.#initGroup();

    // After this.#initGroup we sure, that we have this.#group field 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const groupEl = this.#groupEl!;

    const wallsToRender = this.#getWallsToRender();
    const enemiesToRender = this.#getEnemiesToRender();

    const objectsToRender = [...wallsToRender, ...enemiesToRender];

    objectsToRender
      .sort((a, b) => b.distance - a.distance)
      .forEach((obj) => {
        this.#renderer.add(groupEl, "rect", obj.attrs);
      });
  }
}
