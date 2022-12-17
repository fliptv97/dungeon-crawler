import { Renderer } from "./renderer";
import { Level } from "./level";
import { Scene } from "./scene";

// MINIMAP
const mapRenderer = new Renderer();
const level = new Level(mapRenderer);

mapRenderer.init(level.width, level.height, "minimap-container");
mapRenderer.setBackgroundColor("#000");

level.render(true);

// SCENE
const sceneRenderer = new Renderer();
const scene = new Scene(sceneRenderer, level);

sceneRenderer.init(640, 480, "scene-container");
sceneRenderer.setBackgroundColor("#000");

scene.render();

// LISTENERS
if (!level.player) {
  throw new Error("Player isn't initialized");
}

level.player.initControlsListener();
level.player.onUpdate(() => {
  scene.render();
});
