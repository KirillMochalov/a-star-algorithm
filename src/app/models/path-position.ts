export class PathPosition {
  public g?: number;
  public h?: number;
  public f?: number;
  public parent?: PathPosition;

  constructor(
    public x: number,
    public y: number
  ) {}
}
