import { Point } from './point';
import { Scene } from './scene';

export abstract class CanvasObject {
  constructor(
    public position: Point
  ) {}

  public abstract draw(scene: Scene): void;
}
