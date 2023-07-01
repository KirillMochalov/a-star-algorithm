import { CanvasObject } from './canvas-object';
import { Scene } from './scene';

export class PathPoint extends CanvasObject {
  public char = '';

  draw(scene: Scene): void {
    scene.ctx.strokeStyle = '#FFFFFF';
    scene.ctx.beginPath();
    scene.ctx.arc(
      (this.position.x * scene.gridWidth) + scene.gridWidth / 2,
      (this.position.y * scene.gridWidth) + scene.gridWidth / 2,
      scene.gridWidth / 2,
      0,
      Math.PI * 2
    );
    scene.ctx.stroke();
    scene.ctx.closePath();

    scene.ctx.fillStyle = '#FFFFFF';
    scene.ctx.font = "12px serif";
    scene.ctx.fillText(
      this.char,
      (this.position.x * scene.gridWidth) + scene.gridWidth / 2 - 3,
      (this.position.y * scene.gridWidth) + scene.gridWidth / 2 + 4
    );
  }
}
