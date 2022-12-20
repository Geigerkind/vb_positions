import { ShapeDto } from "../dto/shape-dto";

export abstract class Shape {
  protected static FIELD_RESOLUTION: number = 9000;

  constructor(protected context: CanvasRenderingContext2D) {}

  public abstract toDto(): ShapeDto;

  public draw(): void {
    this.drawShape();
  }

  protected fromDiscreteX(x: number): number {
    return x * (this.context.canvas.width / Shape.FIELD_RESOLUTION);
  }

  protected fromDiscreteY(y: number): number {
    return y * (this.context.canvas.height / Shape.FIELD_RESOLUTION);
  }

  protected toDiscreteX(x: number): number {
    return Math.max(
      0,
      Math.min(Math.ceil(x * (Shape.FIELD_RESOLUTION / this.context.canvas.width)), Shape.FIELD_RESOLUTION)
    );
  }

  protected toDiscreteY(y: number): number {
    return Math.max(
      0,
      Math.min(Math.ceil(y * (Shape.FIELD_RESOLUTION / this.context.canvas.height)), Shape.FIELD_RESOLUTION)
    );
  }

  abstract drawShape(): void;

  abstract isHit(clickX: number, clickY: number): boolean;
}
