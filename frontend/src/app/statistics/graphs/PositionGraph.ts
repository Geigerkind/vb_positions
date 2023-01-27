import { Shape } from "../../field/shapes/shape";
import { TargetPoint } from "../value/targetPoint";
import { ShapeDto } from "../../field/dto/shape-dto";

export class PositionGraph extends Shape {
  private part1: number = 0;
  private part2: number = 0;
  private part3: number = 0;
  private part4: number = 0;
  private part5: number = 0;
  private part6: number = 0;
  private partOut: number = 0;

  constructor(context: CanvasRenderingContext2D, private targetPoints: TargetPoint[]) {
    super(context);

    this.targetPoints.forEach(tp => {
      if (tp.y >= 1000 && tp.y <= 4000) {
        if (tp.x >= 225 && tp.x < 3225) {
          ++this.part4;
        } else if (tp.x >= 3225 && tp.x < 6225) {
          ++this.part3;
        } else if (tp.x >= 6225 && tp.x <= 9225) {
          ++this.part2;
        } else {
          ++this.partOut;
        }
      } else if (tp.y > 4000 && tp.y <= 10000) {
        if (tp.x >= 225 && tp.x < 3225) {
          ++this.part5;
        } else if (tp.x >= 3225 && tp.x < 6225) {
          ++this.part6;
        } else if (tp.x >= 6225 && tp.x <= 9225) {
          ++this.part1;
        } else {
          ++this.partOut;
        }
      } else {
        ++this.partOut;
      }
    });
  }

  drawShape(): void {
    this.targetPoints.forEach(point => this.drawBall(point.x, point.y));
    this.drawPart(225, 1000, 3225, 4000, this.part4);
    this.drawPart(3225, 1000, 6225, 4000, this.part3);
    this.drawPart(6225, 1000, 9225, 4000, this.part2);
    this.drawPart(225, 4000, 3225, 10000, this.part5);
    this.drawPart(3225, 4000, 6225, 10000, this.part6);
    this.drawPart(6225, 4000, 9225, 10000, this.part1);
  }

  private drawBall(xDisc: number, yDisc: number): void {
    this.context.beginPath();
    this.context.ellipse(this.fromDiscreteX(xDisc), this.fromDiscreteY(yDisc), 15, 15, 0, 0, Math.PI * 2);
    this.context.fillStyle = "rgba(0,0,0,0.75)";
    this.context.fill();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#003300";
    this.context.setLineDash([]);
    this.context.stroke();
  }

  private drawPart(x1: number, y1: number, x2: number, y2: number, amount: number): void {
    this.context.beginPath();
    this.context.moveTo(this.fromDiscreteX(x1), this.fromDiscreteY(y1));
    this.context.lineTo(this.fromDiscreteX(x2), this.fromDiscreteY(y1));
    this.context.lineTo(this.fromDiscreteX(x2), this.fromDiscreteY(y2));
    this.context.lineTo(this.fromDiscreteX(x1), this.fromDiscreteY(y2));
    this.context.setLineDash([6]);
    this.context.closePath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = "#003300";
    this.context.stroke();

    this.context.font = "40px Roboto";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(
      this.getPercentage(amount),
      this.fromDiscreteX(x1 + (x2 - x1) / 2),
      this.fromDiscreteY(y1 + (y2 - y1) / 2)
    );
  }

  private getPercentage(input: number): string {
    if (input === 0) {
      return "0.0%";
    }
    return `${((input / this.targetPoints.length) * 100).toFixed(1)}%`;
  }

  isHit(clickX: number, clickY: number): boolean {
    return false;
  }

  toDto(): ShapeDto {
    // @ts-ignore
    return undefined;
  }
}
