class LevelMap {
    TILE_SIZE = 48;

    constructor(renderer) {
        this.grid = [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ];
        this.width = this.grid[0].length * this.TILE_SIZE;
        this.height = this.grid.length * this.TILE_SIZE;

        this.renderer = renderer;
    }

    hasWall(x, y) {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            return true;
        }

        let gridIndexX = Math.floor(x / this.TILE_SIZE);
        let gridIndexY = Math.floor(y / this.TILE_SIZE);

        return this.grid[gridIndexY][gridIndexX] === '#';
    }

    render(withGrid) {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === "#") {
                    this.renderer.createElement(null, Renderer.TYPES.RECTANGLE, {
                        x: x * this.TILE_SIZE,
                        y: y * this.TILE_SIZE,
                        width: this.TILE_SIZE,
                        height: this.TILE_SIZE,
                        fill: "rgb(100, 100, 100)",
                    });
                }
            }
        }

        if (withGrid) {
            let styles = "stroke-width: 1; stroke: #FFF;";
            let gridGroup = this.renderer.createElement(null, Renderer.TYPES.GROUP, {
                id: "grid"
            });

            for (let y = 0; y < this.grid.length; y++) {
                this.renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
                    x1: 0,
                    y1: y * this.TILE_SIZE,
                    x2: this.renderer.getWidth(),
                    y2: y * this.TILE_SIZE,
                    style: styles
                });
            }

            for (let x = 0; x < this.grid[0].length; x++) {
                this.renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
                    x1: x * this.TILE_SIZE,
                    y1: 0,
                    x2: x * this.TILE_SIZE,
                    y2: this.renderer.getHeight(),
                    style: styles
                });
            }
        }
    }
}
