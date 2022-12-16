import { Shape } from "./shape";
import { Actor } from "../entity/actor";
import { ShapeType } from "../value/shape-type";
import { ShapeDto } from "../dto/shape-dto";

export class HalfCircle extends Shape {
  private static RELATIVE_RADIUS: number = 0.018;
  public readonly shape_type: ShapeType = ShapeType.HalfCircle;

  constructor(actor: Actor, context: CanvasRenderingContext2D, x: number, y: number) {
    super(actor, context, x, y);
  }

  get radius(): number {
    return this.context.canvas.width * HalfCircle.RELATIVE_RADIUS;
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI, true);
    this.context.fillStyle = "red";
    this.context.fill();
    this.context.setLineDash([]);
    this.context.closePath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#003300";
    this.context.stroke();
  }

  drawPosition(): void {
    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.currentPosition().value.toString(), this.x, this.y - 10);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + this.radius / 2);
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - this.radius &&
      clickX <= this.x + this.radius &&
      clickY >= this.y - this.radius &&
      clickY <= this.y
    );
  }

  copy(): Shape {
    return new HalfCircle(this.actor.copy(), this.context, this.x, this.y);
  }

  toDto(): ShapeDto {
    return {
      actor: this.actor.toDto(),
      shape_type: this.shape_type,
      x_percent: this.x_percent,
      y_percent: this.y_percent,
    };
  }
}
