import { CanvasObject } from './canvas-object';
import { Scene } from './scene';

export class Wall extends CanvasObject {
  public color = '#707070';

  override draw(scene: Scene) {
    scene.ctx.fillStyle = this.color;
    scene.ctx.fillRect(
      this.position.x * scene.gridWidth,
      this.position.y * scene.gridWidth,
      scene.gridWidth,
      scene.gridWidth
    );
  }
}
