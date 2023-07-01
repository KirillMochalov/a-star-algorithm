import { CanvasObject } from './canvas-object';
import { Scene } from './scene';
import { Point } from './point';

export class Line extends CanvasObject {
  endPosition?: Point;

  draw(scene: Scene) {
    if (this.endPosition) {
      scene.ctx.strokeStyle = '#FFFFFF';
      scene.ctx.beginPath();
      scene.ctx.moveTo(
        this.position.x * scene.gridWidth + (scene.gridWidth / 2),
        this.position.y * scene.gridWidth + (scene.gridWidth / 2)
      );
      scene.ctx.lineTo(
        this.endPosition.x * scene.gridWidth + (scene.gridWidth / 2),
        this.endPosition.y * scene.gridWidth + (scene.gridWidth / 2)
      );
      scene.ctx.stroke();
      scene.ctx.closePath();
    }
  }
}
