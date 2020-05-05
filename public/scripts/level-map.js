class LevelMap {
  static TILE_SIZE = 32;

  constructor(renderer) {
    this.grid = [
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
      ["#", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", ".", "#", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", "#", "#", "#", ".", ".", "#", ".", "#", ".", "#", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", "#", ".", ".", ".", "#", ".", ".", ".", "#", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", "#", "#", ".", "#", "#", ".", ".", "#"],
      ["#", "#", "#", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", ".", ".", "#", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
      ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ];
    this.width = this.grid[0].length * LevelMap.TILE_SIZE;
    this.height = this.grid.length * LevelMap.TILE_SIZE;

    this.renderer = renderer;
  }

  hasWall(x, y) {
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return true;
    }

    let gridIndexX = Math.floor(x / LevelMap.TILE_SIZE);
    let gridIndexY = Math.floor(y / LevelMap.TILE_SIZE);

    return this.grid[gridIndexY][gridIndexX] === "#";
  }

  render(withGrid) {
    let mapGroupEl = this.renderer.createElement(null, Renderer.TYPES.GROUP, {
      id: "map",
    });

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === "#") {
          this.renderer.createElement(mapGroupEl, Renderer.TYPES.RECTANGLE, {
            x: x * LevelMap.TILE_SIZE,
            y: y * LevelMap.TILE_SIZE,
            width: LevelMap.TILE_SIZE,
            height: LevelMap.TILE_SIZE,
            fill: "rgb(100, 100, 100)",
          });
        }
      }
    }

    if (withGrid) {
      let styles = "stroke-width: 1; stroke-opacity: 0.3; stroke: #FFF;";
      let gridGroup = this.renderer.createElement(null, Renderer.TYPES.GROUP, {
        id: "grid",
      });

      for (let y = 0; y < this.grid.length; y++) {
        this.renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
          x1: 0,
          y1: y * LevelMap.TILE_SIZE,
          x2: this.renderer.width,
          y2: y * LevelMap.TILE_SIZE,
          style: styles,
        });
      }

      for (let x = 0; x < this.grid[0].length; x++) {
        this.renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
          x1: x * LevelMap.TILE_SIZE,
          y1: 0,
          x2: x * LevelMap.TILE_SIZE,
          y2: this.renderer.height,
          style: styles,
        });
      }
    }
  }
}
