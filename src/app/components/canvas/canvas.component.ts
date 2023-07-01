import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Scene } from '../../models/scene';
import { Wall } from '../../models/wall';
import { Point } from '../../models/point';
import { PathPoint } from '../../models/path-point';
import { Line } from '../../models/line';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  scene?: Scene;
  drawMode?: 'wall' | 'start_point' | 'end_point';
  startPoint?: PathPoint;
  endPoint?: PathPoint;
  algorithmTime = 0;

  ngAfterViewInit() {
    const ctx: CanvasRenderingContext2D | null | undefined = this.canvas?.nativeElement.getContext('2d');
    if (ctx) {
      // Creating scene
      this.scene = new Scene(ctx, 420, 420);

      setInterval(() => {
        this.scene?.draw();
      }, 100);
    }
  }

  onClick(event: MouseEvent) {
    if (this.scene) {
      const elemLeft = this.scene.ctx.canvas.offsetLeft + this.scene.ctx.canvas.clientLeft;
      const elemTop = this.scene.ctx.canvas.offsetTop + this.scene.ctx.canvas.clientTop;

      const x = Math.floor((event.x - elemLeft) / 30);
      const y = Math.floor((event.y - elemTop) / 30);

      const objectsOnPoint = this.scene.getObjectsOnPoint(new Point(x, y)).filter(object => !(object instanceof Line));

      if (this.drawMode === 'wall') {
        const hasWall = objectsOnPoint.find(object => object instanceof Wall);
        if (hasWall) {
          this.scene.removeOnPoint(new Point(x, y));
        } else {
          this.scene.addObject(new Wall(new Point(x, y)));
        }
      }

      if (!objectsOnPoint.length) {
        if (this.drawMode === 'start_point') {
          const existingPointPath = this.scene.objects.findIndex(object => object instanceof PathPoint && object.char === 'S');
          if (existingPointPath > -1) {
            this.scene.objects.splice(existingPointPath, 1);
          }

          const pathPoint = new PathPoint(new Point(x, y));
          pathPoint.char = 'S';
          this.scene.addObject(pathPoint);
          this.startPoint = pathPoint;
        }

        if (this.drawMode === 'end_point') {
          const existingPointPath = this.scene.objects.findIndex(object => object instanceof PathPoint && object.char === 'E');
          if (existingPointPath > -1) {
            this.scene.objects.splice(existingPointPath, 1);
          }

          const pathPoint = new PathPoint(new Point(x, y));
          pathPoint.char = 'E';
          this.scene.addObject(pathPoint);
          this.endPoint = pathPoint;
        }

        this.scene.draw();
      }
    }

    this.findPath();
  }

  findPath() {
    if (this.startPoint && this.endPoint && this.scene) {
      // Clearing old path
      this.scene.objects = this.scene.objects.filter(object => !(object instanceof Line));

      // Saving current time
      const currentTime = Date.now();

      const path = this.scene.findPath(this.startPoint.position, this.endPoint.position);

      this.algorithmTime = Date.now() - currentTime;

      path
        .map((pathPoint, index) => {
          const nextPoint = path[index + 1];

          if (!nextPoint) {
            return null;
          }
          const line = new Line(pathPoint);
          line.endPosition = nextPoint;

          return line;
        })
        .filter((line): line is Line => !!line)
        .forEach(line => this.scene?.addObject(line));

      this.scene.draw();
    }
  }
}
