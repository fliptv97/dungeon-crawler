import { Renderer } from "./Renderer";
import { Player } from "./entities/Player";
import { Enemy } from "./entities/Enemy";
import { Vector2D } from "./geometry/Vector2D";

type MapSymbol = typeof SYMBOLS[keyof typeof SYMBOLS];

export const TILE_SIZE = 32;

const SYMBOLS = {
  PLAYER: "P",
  ENEMY: "E",
  WALL: "#",
} as const;

export class Level {
  #grid: string[][] = [];
  #width: number;
  #height: number;
  #renderer: Renderer;
  #player: Player;
  #enemies: Enemy[] = [];

  constructor(renderer: Renderer) {
    this.#grid = [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", ".", ".", "E", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", ".", "#", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", "#", "#", "#", ".", ".", "#", ".", "#", ".", "#", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", "#", ".", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", "#", "#", "E", "#", "#", ".", ".", "#"],
      ["#", "#", "#", "#", ".", ".", ".", "E", ".", "E", ".", ".", ".", "#"],
      ["#", ".", ".", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", "P", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ];
    this.#width = this.#grid[0].length * TILE_SIZE;
    this.#height = this.#grid.length * TILE_SIZE;

    this.#renderer = renderer;
    this.#player = new Player(this.#renderer, this, new Vector2D(0, 0));
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get player() {
    return this.#player;
  }

  get enemies() {
    return this.#enemies;
  }

  #hasSomethingAt(x: number, y: number, symbol: MapSymbol): boolean {
    if (x < 0 || x > this.#width || y < 0 || y > this.#height) {
      return true;
    }

    const gridIndexX = Math.floor(x / TILE_SIZE);
    const gridIndexY = Math.floor(y / TILE_SIZE);

    return this.#grid[gridIndexY][gridIndexX] === symbol;
  }

  #forEachCell(cb: (cell: string, x: number, y: number) => void): void {
    this.#grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        cb(cell, x, y);
      });
    });
  }

  hasWall(x: number, y: number): boolean {
    return this.#hasSomethingAt(x, y, SYMBOLS.WALL);
  }

  render(withGrid: boolean): void {
    const mapGroupEl = this.#renderer.add(null, "g", {
      id: "map",
    });

    this.#forEachCell((cell, x, y) => {
      if (cell === SYMBOLS.PLAYER) {
        this.#player.position = new Vector2D(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
      } else if (cell === SYMBOLS.ENEMY) {
        const position = new Vector2D(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2);
        const enemy = new Enemy(this.#renderer, position);

        this.#enemies.push(enemy);
      } else if (cell === SYMBOLS.WALL) {
        this.#renderer.add(mapGroupEl, "rect", {
          x: x * TILE_SIZE,
          y: y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          fill: "rgb(100, 100, 100)",
        });
      }
    });

    this.#enemies.forEach((enemy) => {
      enemy.render();
    });

    if (this.#player) {
      this.#player.render();
    }

    // GRID RENDERING
    if (withGrid) {
      const styles = "stroke-width: 1; stroke-opacity: 0.3; stroke: #FFF;";
      const gridGroup = this.#renderer.add(null, "g", {
        id: "grid",
      });

      for (let y = 0; y < this.#grid.length; y++) {
        this.#renderer.add(gridGroup, "line", {
          x1: 0,
          y1: y * TILE_SIZE,
          x2: this.#renderer.width,
          y2: y * TILE_SIZE,
          style: styles,
        });
      }

      for (let x = 0; x < this.#grid[0].length; x++) {
        this.#renderer.add(gridGroup, "line", {
          x1: x * TILE_SIZE,
          y1: 0,
          x2: x * TILE_SIZE,
          y2: this.#renderer.height,
          style: styles,
        });
      }
    }
  }
}
