import { Renderer } from "./renderer";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { Vector2D } from "./vector2D";

type SYMBOLS = typeof Level.SYMBOLS[keyof typeof Level.SYMBOLS];

export class Level {
  static TILE_SIZE = 32 as const;

  static SYMBOLS = {
    PLAYER: "P",
    ENEMY: "E",
    WALL: "#",
  } as const;

  #grid: string[][] = [];
  #width: number;
  #height: number;
  #renderer: Renderer;
  #player?: Player;
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
    this.#width = this.#grid[0].length * Level.TILE_SIZE;
    this.#height = this.#grid.length * Level.TILE_SIZE;

    this.#renderer = renderer;
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

  #hasSomethingAt(x: number, y: number, symbol: SYMBOLS): boolean {
    if (x < 0 || x > this.#width || y < 0 || y > this.#height) {
      return true;
    }

    const gridIndexX = Math.floor(x / Level.TILE_SIZE);
    const gridIndexY = Math.floor(y / Level.TILE_SIZE);

    return this.#grid[gridIndexY][gridIndexX] === symbol;
  }

  hasWall(x: number, y: number): boolean {
    return this.#hasSomethingAt(x, y, Level.SYMBOLS.WALL);
  }

  render(withGrid: boolean): void {
    const mapGroupEl = this.#renderer.createElement(null, Renderer.ELEMENT_TYPES.GROUP, {
      id: "map",
    });

    for (let y = 0; y < this.#grid.length; y++) {
      for (let x = 0; x < this.#grid[y].length; x++) {
        const cell = this.#grid[y][x];

        if (cell === Level.SYMBOLS.PLAYER) {
          this.#player = new Player(
            this.#renderer,
            this,
            new Vector2D(
              x * Level.TILE_SIZE + Level.TILE_SIZE / 2,
              y * Level.TILE_SIZE + Level.TILE_SIZE / 2
            )
          );
        } else if (cell === Level.SYMBOLS.ENEMY) {
          this.#enemies.push(
            new Enemy(
              this.#renderer,
              x * Level.TILE_SIZE + Level.TILE_SIZE / 2,
              y * Level.TILE_SIZE + Level.TILE_SIZE / 2
            )
          );
        } else if (cell === Level.SYMBOLS.WALL) {
          this.#renderer.createElement(mapGroupEl, Renderer.ELEMENT_TYPES.RECTANGLE, {
            x: x * Level.TILE_SIZE,
            y: y * Level.TILE_SIZE,
            width: Level.TILE_SIZE,
            height: Level.TILE_SIZE,
            fill: "rgb(100, 100, 100)",
          });
        }
      }
    }

    this.#enemies.forEach((enemy) => {
      enemy.render();
    });

    if (this.#player) {
      this.#player.render();
    }

    // GRID RENDERING
    if (withGrid) {
      const styles = "stroke-width: 1; stroke-opacity: 0.3; stroke: #FFF;";
      const gridGroup = this.#renderer.createElement(null, Renderer.ELEMENT_TYPES.GROUP, {
        id: "grid",
      });

      for (let y = 0; y < this.#grid.length; y++) {
        this.#renderer.createElement(gridGroup, Renderer.ELEMENT_TYPES.LINE, {
          x1: 0,
          y1: y * Level.TILE_SIZE,
          x2: this.#renderer.width,
          y2: y * Level.TILE_SIZE,
          style: styles,
        });
      }

      for (let x = 0; x < this.#grid[0].length; x++) {
        this.#renderer.createElement(gridGroup, Renderer.ELEMENT_TYPES.LINE, {
          x1: x * Level.TILE_SIZE,
          y1: 0,
          x2: x * Level.TILE_SIZE,
          y2: this.#renderer.height,
          style: styles,
        });
      }
    }
  }
}
