// CONSTANTS
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

const TILE_SIZE = 40;
const LEVEL_MAP = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", ".", ".", ".", ".", ".", ".", ".", ".", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
];

// SETUP
document.addEventListener("DOMContentLoaded", function () {
  let width = LEVEL_MAP[0].length * TILE_SIZE;
  let height = LEVEL_MAP.length * TILE_SIZE;
  let renderer = new Renderer();
  let player = new Player(renderer, TILE_SIZE / 2, TILE_SIZE / 2);

  renderer.init(width, height);
  renderer.setBackgroundColor("#000");

  renderMap(renderer);
  renderGrid(renderer);

  player.render();
  player.castRays();

  document.addEventListener("keydown", e => {
    if (e.keyCode === UP_ARROW) {
      player.move(TILE_SIZE);
    } else if (e.keyCode === DOWN_ARROW) {
      player.move(-TILE_SIZE);
    } if (e.keyCode === LEFT_ARROW) {
      player.rotate(-90);
    } if (e.keyCode === RIGHT_ARROW) {
      player.rotate(90);
    }
  });
});

// ADDITIONAL RENDER FUNCTIONS
function renderGrid(renderer) {
  let styles = "stroke-width: 1; stroke: #FFF;";
  let gridGroup = renderer.createElement(null, Renderer.TYPES.GROUP, {
    id: "grid"
  });

  for (let y = 0; y < LEVEL_MAP.length; y++) {
    renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
      x1: 0,
      y1: y * TILE_SIZE,
      x2: renderer.getWidth(),
      y2: y * TILE_SIZE,
      style: styles
    });
  }

  for (let x = 0; x < LEVEL_MAP[0].length; x++) {
    renderer.createElement(gridGroup, Renderer.TYPES.LINE, {
      x1: x * TILE_SIZE,
      y1: 0,
      x2: x * TILE_SIZE,
      y2: renderer.getHeight(),
      style: styles
    });
  }
}

function renderMap(renderer) {
  for (let y = 0; y < LEVEL_MAP.length; y++) {
    for (let x = 0; x < LEVEL_MAP[y].length; x++) {
      if (LEVEL_MAP[y][x] === "#") {
        renderer.createElement(null, Renderer.TYPES.RECTANGLE, {
          x: x * TILE_SIZE,
          y: y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          fill: "rgb(100, 100, 100)",
        });
      }
    }
  }
}
