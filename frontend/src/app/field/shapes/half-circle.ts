import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShape } from "./actor-shape";

export class HalfCircle extends ActorShape {
  private static RELATIVE_RADIUS: number = 0.018 * 3.2;
  private static RADIUS_MAX: number = 50;

  constructor(actor: Actor, context: CanvasRenderingContext2D, field_positions?: Map<string, ShapeFieldPosition>) {
    super(actor, context, field_positions);
  }

  get radius(): number {
    return Math.min(
      Math.max(this.context.canvas.width, this.context.canvas.height) * HalfCircle.RELATIVE_RADIUS,
      HalfCircle.RADIUS_MAX
    );
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI, true);
    this.context.fillStyle = ActorShape.ACTOR_COLOR;
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
}
