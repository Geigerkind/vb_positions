import { ShapeDto } from "../dto/shape-dto";

export abstract class Shape {
  public static FIELD_RESOLUTION_Y: number = 10225;
  public static FIELD_RESOLUTION_X: number = 9450;

  constructor(protected context: CanvasRenderingContext2D) {}

  public abstract toDto(): ShapeDto;

  public draw(): void {
    this.drawShape();
  }

  protected fromDiscreteX(x: number): number {
    return x * (this.context.canvas.width / Shape.FIELD_RESOLUTION_X);
  }

  protected fromDiscreteY(y: number): number {
    return y * (this.context.canvas.height / Shape.FIELD_RESOLUTION_Y);
  }

  protected toDiscreteX(x: number): number {
    return Math.max(
      0,
      Math.min(Math.ceil(x * (Shape.FIELD_RESOLUTION_X / this.context.canvas.width)), Shape.FIELD_RESOLUTION_X)
    );
  }

  protected toDiscreteY(y: number): number {
    return Math.max(
      0,
      Math.min(Math.ceil(y * (Shape.FIELD_RESOLUTION_Y / this.context.canvas.height)), Shape.FIELD_RESOLUTION_Y)
    );
  }

  abstract drawShape(): void;

  abstract isHit(clickX: number, clickY: number): boolean;
}
