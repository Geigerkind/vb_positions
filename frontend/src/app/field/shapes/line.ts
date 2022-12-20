import { Shape } from "./shape";
import { ShapeDto } from "../dto/shape-dto";
import { ShapeFieldPosition } from "../value/shape-field-position";

export class Line extends Shape {
  private positions: ShapeFieldPosition[] = [];

  constructor(context: CanvasRenderingContext2D) {
    super(context);
  }

  addPosition(x: number, y: number): void {
    this.positions.push({
      x: this.toDiscreteX(x),
      y: this.toDiscreteY(y),
    });
  }

  drawShape(): void {
    if (this.positions.length <= 1) {
      return;
    }
    this.context.beginPath();
    this.context.moveTo(this.fromDiscreteX(this.positions[0].x), this.fromDiscreteY(this.positions[0].y));
    for (let i = 1; i < this.positions.length; ++i) {
      this.context.lineTo(this.fromDiscreteX(this.positions[i].x), this.fromDiscreteY(this.positions[i].y));
    }
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#003300";
    this.context.stroke();
  }

  isHit(x: number, y: number): boolean {
    const clickX = this.toDiscreteX(x);
    const clickY = this.toDiscreteY(y);

    let lastPosition = this.positions[0];
    for (let i = 1; i < this.positions.length; ++i) {
      const currentPosition = this.positions[i];
      if (lastPosition.x < currentPosition.x) {
        const betweenX = lastPosition.x <= clickX && currentPosition.x >= clickX;
        if (lastPosition.y < currentPosition.y) {
          if (betweenX && lastPosition.y <= clickY && currentPosition.y >= clickY) {
            return true;
          }
        } else {
          if (betweenX && lastPosition.y >= clickY && currentPosition.y <= clickY) {
            return true;
          }
        }
      } else {
        const betweenX = lastPosition.x >= clickX && currentPosition.x <= clickX;
        if (lastPosition.y < currentPosition.y) {
          if (betweenX && lastPosition.y <= clickY && currentPosition.y >= clickY) {
            return true;
          }
        } else {
          if (betweenX && lastPosition.y >= clickY && currentPosition.y <= clickY) {
            return true;
          }
        }
      }
      lastPosition = currentPosition;
    }

    return false;
  }

  toDto(): ShapeDto {
    // @ts-ignore
    return undefined;
  }
}
