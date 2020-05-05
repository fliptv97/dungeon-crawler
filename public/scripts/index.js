document.addEventListener("DOMContentLoaded", function () {
  let renderer = new Renderer();
  let levelMap = new LevelMap(renderer);
  let player = new Player(
    renderer,
    levelMap,
    levelMap.TILE_SIZE + levelMap.TILE_SIZE / 2,
    levelMap.TILE_SIZE + levelMap.TILE_SIZE / 2
  );

  let width = levelMap.width;
  let height = levelMap.height;

  renderer.init(width, height);
  renderer.setBackgroundColor("#000");

  levelMap.render(true);

  player.render();
  player.initControlsListener();
});
