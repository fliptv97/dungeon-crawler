class Level {
  static TILE_SIZE = 32;

  static SYMBOLS = {
    PLAYER: "P",
    ENEMY: "E",
    WALL: "#",
  };

  constructor(renderer) {
    this._grid = [
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
    this._width = this._grid[0].length * Level.TILE_SIZE;
    this._height = this._grid.length * Level.TILE_SIZE;

    this._renderer = renderer;

    this._player = null;
    this._enemies = [];
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get player() {
    return this._player;
  }

  get enemies() {
    return this._enemies;
  }

  _hasSomethingAt(x, y, symbol) {
    if (x < 0 || x > this._width || y < 0 || y > this._height) {
      return true;
    }

    let gridIndexX = Math.floor(x / Level.TILE_SIZE);
    let gridIndexY = Math.floor(y / Level.TILE_SIZE);

    return this._grid[gridIndexY][gridIndexX] === symbol;
  }

  hasWall(x, y) {
    return this._hasSomethingAt(x, y, Level.SYMBOLS.WALL);
  }

  render(withGrid) {
    let mapGroupEl = this._renderer.createElement(null, Renderer.TYPES.GROUP, {
      id: "map",
    });

    for (let y = 0; y < this._grid.length; y++) {
      for (let x = 0; x < this._grid[y].length; x++) {
        let cell = this._grid[y][x];

        if (cell === Level.SYMBOLS.PLAYER) {
          this._player = new Player(
            this._renderer,
            this,
            x * Level.TILE_SIZE + Level.TILE_SIZE / 2,
            y * Level.TILE_SIZE + Level.TILE_SIZE / 2
          );
        } else if (cell === Level.SYMBOLS.ENEMY) {
          this._enemies.push(
            new Enemy(
              this._renderer,
              x * Level.TILE_SIZE + Level.TILE_SIZE / 2,
              y * Level.TILE_SIZE + Level.TILE_SIZE / 2
            )
          );
        } else if (cell === Level.SYMBOLS.WALL) {
          // Render wall
          this._renderer.createElement(mapGroupEl, Renderer.TYPES.RECTANGLE, {
            x: x * Level.TILE_SIZE,
            y: y * Level.TILE_SIZE,
            width: Level.TILE_SIZE,
            height: Level.TILE_SIZE,
            fill: "rgb(100, 100, 100)",
          });
        }
      }
    }

    this._enemies.forEach((enemy) => {
      enemy.render();
    });

    this._player.render();

    // GRID RENDERING
    if (withGrid) {
      let styles = "stroke-width: 1; stroke-opacity: 0.3; stroke: #FFF;";
      let gridGroup = this._renderer.createElement(null, Renderer.TYPES.GROUP, {
        id: "grid",
      });

      for (let y = 0; y < this._grid.length; y++) {
        this._renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
          x1: 0,
          y1: y * Level.TILE_SIZE,
          x2: this._renderer.width,
          y2: y * Level.TILE_SIZE,
          style: styles,
        });
      }

      for (let x = 0; x < this._grid[0].length; x++) {
        this._renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
          x1: x * Level.TILE_SIZE,
          y1: 0,
          x2: x * Level.TILE_SIZE,
          y2: this._renderer.height,
          style: styles,
        });
      }
    }
  }
}
