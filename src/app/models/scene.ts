import { CanvasObject } from './canvas-object';
import { Point } from './point';
import { PathPosition } from './path-position';
import { Wall } from './wall';

export class Scene {
  public backgroundColor = '#000000';
  public objects: CanvasObject[] = [];
  public gridWidth = 30;

  constructor(
    public ctx: CanvasRenderingContext2D,
    public width: number,
    public height: number
  ) {}

  public draw() {
    // Clearing scene
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Drawing objects
    this.objects.forEach(object => object.draw(this));

    // Drawing grid
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < Math.ceil(this.width / this.gridWidth); i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridWidth, 0);
      this.ctx.lineTo(i * this.gridWidth, this.height);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    for (let i = 0; i < Math.ceil(this.height / this.gridWidth); i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridWidth);
      this.ctx.lineTo(this.width, i * this.gridWidth);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  public addObject(object: CanvasObject) {
    this.objects.push(object);
  }

  public removeOnPoint(point: Point) {
    this.objects = this.objects.filter(object => object.position.x !== point.x || object.position.y !== point.y);
  }

  public getObjectsOnPoint(point: Point) {
    return this.objects.filter(object => object.position.x === point.x && object.position.y === point.y);
  }

  public findPath(startPoint: Point, endPoint: Point): Point[] {
    const gridWidth = Math.floor(this.width / this.gridWidth);
    const gridHeight = Math.floor(this.height / this.gridWidth);
    const openList: PathPosition[] = [
      new PathPosition(startPoint.x, startPoint.y)
    ];
    const closedList: PathPosition[] = [];

    while (openList.length) {
      const currentPoint = openList.pop();

      if (!currentPoint) {
        break;
      }

      if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
        const path: PathPosition[] = [];
        let p: PathPosition | undefined = currentPoint;

        while (p) {
          path.push(p);
          p = p.parent;
        }

        return path.map(p => new Point(p.x, p.y));
      }

      // Adding current point to closed list
      closedList.push(currentPoint);

      // Getting neighbors
      const neighbors: PathPosition[] = [];

      for (let i = currentPoint.x - 1; i <= currentPoint.x + 1; i++) {
        for (let j = currentPoint.y - 1; j <= currentPoint.y + 1; j++) {
          const isWall = !!this.getObjectsOnPoint(new Point(i, j))
            .filter(object => object instanceof Wall)
            .length;

          if (
            !isWall
            && (i !== currentPoint.x || j !== currentPoint.y)
            && i >= 0
            && i < gridWidth
            && j >= 0
            && j < gridHeight
          ) {
            neighbors.push(new PathPosition(i, j));
          }
        }
      }

      // Handling neighbors
      neighbors
        .filter(neighbor => {
          const inClosedList = closedList.find(point => point.x === neighbor.x && point.y === neighbor.y);
          return !inClosedList;
        })
        .forEach(neighbor => {
          const newG = (currentPoint.g ?? 0) + 1;
          const existingPoint = openList.find(point => point.x === neighbor.x && point.y === neighbor.y);

          if (existingPoint) {
            if (!existingPoint.g || newG < existingPoint.g) {
              existingPoint.g = newG;
              existingPoint.h = Math.sqrt(Math.pow(endPoint.x - existingPoint.x, 2) + Math.pow(endPoint.y - existingPoint.y, 2));
              existingPoint.f = existingPoint.g + existingPoint.h;
              existingPoint.parent = currentPoint;
            }
          } else {
            neighbor.g = newG;
            neighbor.h = Math.sqrt(Math.pow(endPoint.x - neighbor.x, 2) + Math.pow(endPoint.y - neighbor.y, 2));
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = currentPoint;
            openList.push(neighbor);
          }
        });

      // Resorting open list
      openList.sort((a, b) => (b.f ?? 0) - (a.f ?? 0));

    }

    return [];
  }
}
