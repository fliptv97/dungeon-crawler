document.addEventListener("DOMContentLoaded", function () {
  // MINIMAP
  let mapRenderer = new Renderer();
  let level = new Level(mapRenderer);

  mapRenderer.init(level.width, level.height, "minimap-container");
  mapRenderer.setBackgroundColor("#000");

  level.render(true);

  // SCENE
  let sceneRenderer = new Renderer();
  let scene = new Scene(sceneRenderer, level);

  sceneRenderer.init(640, 480, "scene-container");
  sceneRenderer.setBackgroundColor("#000");

  scene.render();

  // LISTENERS
  level.player.initControlsListener();
  level.player.onUpdate(() => {
    scene.render();
  });
});
