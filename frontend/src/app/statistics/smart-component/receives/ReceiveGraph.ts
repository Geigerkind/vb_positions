import { Shape } from "../../../field/shapes/shape";
import { ShapeDto } from "../../../field/dto/shape-dto";
import { TargetPoint } from "../../value/targetPoint";

export class ReceiveGraph extends Shape {
  private best: number = 0;
  private middle: number = 0;
  private worst: number = 0;

  constructor(context: CanvasRenderingContext2D, private targetPoints: TargetPoint[]) {
    super(context);

    this.targetPoints.forEach(tp => {
      const radius = Math.sqrt((tp.x - 6725) * (tp.x - 6725) + (tp.y - 1000) * (tp.y - 1000));
      const over_net = tp.y < 1000;
      if (radius <= 2250 && !over_net) {
        ++this.best;
      } else if (radius <= 4612.5 && !over_net) {
        ++this.middle;
      } else {
        ++this.worst;
      }
    });
  }

  drawShape(): void {
    // Inner circle
    this.context.beginPath();
    this.context.ellipse(
      this.fromDiscreteX(6725),
      this.fromDiscreteY(1000),
      (this.fromDiscreteX(7725) - this.fromDiscreteX(3225)) / 2,
      this.fromDiscreteY(2750),
      0,
      0,
      Math.PI
    );
    this.context.fillStyle = "rgba(95,197,63,0.5)";
    this.context.fill();
    this.context.setLineDash([6]);
    this.context.closePath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = "#003300";
    this.context.stroke();

    // Outer circle
    this.context.beginPath();
    this.context.ellipse(
      this.fromDiscreteX(6725),
      this.fromDiscreteY(1000),
      this.fromDiscreteX(9225) / 2,
      this.fromDiscreteY(5000),
      0,
      0,
      Math.PI
    );
    this.context.setLineDash([6]);
    this.context.closePath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = "#003300";
    this.context.stroke();

    // TargetPoints
    this.targetPoints.forEach(point => this.drawBall(point.x, point.y));

    // Labels
    this.context.font = "40px Roboto";
    this.context.fillStyle = "white";
    this.context.textAlign = "center";
    this.context.fillText(this.getPercentage(this.best), this.fromDiscreteX(6725), this.fromDiscreteY(700));
    this.context.fillText(this.getPercentage(this.middle), this.fromDiscreteX(3225), this.fromDiscreteY(700));
    this.context.fillText(this.getPercentage(this.worst), this.fromDiscreteX(1225), this.fromDiscreteY(700));
  }

  private getPercentage(input: number): string {
    if (input === 0) {
      return "0.0%";
    }
    return `${((input / this.targetPoints.length) * 100).toFixed(1)}%`;
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

  isHit(clickX: number, clickY: number): boolean {
    return false;
  }

  toDto(): ShapeDto {
    // @ts-ignore
    return undefined;
  }
}
