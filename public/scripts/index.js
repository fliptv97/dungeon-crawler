document.addEventListener("DOMContentLoaded", function () {
  let mapRenderer = new Renderer();
  let sceneRenderer = new Renderer();
  let levelMap = new LevelMap(mapRenderer);
  let player = new Player(
    mapRenderer,
    levelMap,
    LevelMap.TILE_SIZE + LevelMap.TILE_SIZE / 2,
    LevelMap.TILE_SIZE + LevelMap.TILE_SIZE / 2
  );
  let levelView = new Scene(sceneRenderer, player);

  let width = levelMap.width;
  let height = levelMap.height;

  mapRenderer.init(width, height, "minimap-container");
  mapRenderer.setBackgroundColor("#000");

  sceneRenderer.init(640, 480, "scene-container");
  sceneRenderer.setBackgroundColor("#000");

  levelMap.render(true);
  player.render();
  levelView.render();

  // Listeners
  player.initControlsListener();
  player.onUpdate(() => {
    levelView.render();
  });
});
