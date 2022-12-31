import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShape } from "./actor-shape";

export class Circle extends ActorShape {
  private static RELATIVE_RADIUS: number = 0.016 * 3;
  private static RADIUS_MAX: number = 40;

  constructor(
    actor: Actor,
    context: CanvasRenderingContext2D,
    private dashed: boolean,
    field_positions?: Map<string, ShapeFieldPosition>
  ) {
    super(actor, context, field_positions);
  }

  get radius(): number {
    return Math.min(
      Math.max(this.context.canvas.width, this.context.canvas.height) * Circle.RELATIVE_RADIUS,
      Circle.RADIUS_MAX
    );
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = ActorShape.ACTOR_COLOR;
    this.context.fill();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#003300";
    if (this.dashed) {
      this.context.setLineDash([6]);
    } else {
      this.context.setLineDash([]);
    }
    this.context.stroke();
  }

  drawPosition(): void {
    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.currentPosition().value.toString(), this.x, this.y + 12);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + this.radius * 1.5);
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - this.radius &&
      clickX <= this.x + this.radius &&
      clickY >= this.y - this.radius &&
      clickY <= this.y + this.radius
    );
  }
}
