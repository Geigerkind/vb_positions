import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShape } from "./actor-shape";
import { Position } from "../value/position";

export class HalfCircle extends ActorShape {
  private static RADIUS: number = 40;

  constructor(
    actor: Actor,
    context: CanvasRenderingContext2D,
    field_position?: ShapeFieldPosition,
    rotationOffset?: Position
  ) {
    super(actor, context, field_position, rotationOffset);
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.ellipse(
      this.x,
      this.y,
      HalfCircle.RADIUS * this.sizeCoefficientX(),
      HalfCircle.RADIUS * this.sizeCoefficientY(),
      0,
      0,
      Math.PI,
      true
    );
    this.context.fillStyle = ActorShape.ACTOR_COLOR;
    this.context.fill();
    this.context.setLineDash([]);
    this.context.closePath();
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#003300";
    this.context.stroke();
  }

  drawPosition(): void {
    const currentPosition = this.currentPosition();
    if (!currentPosition) {
      return;
    }

    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(currentPosition.value.toString(), this.x, this.y - 10);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(
      this.actor.player_name,
      this.x,
      this.y + (HalfCircle.RADIUS / 2) * this.sizeCoefficientY() + 3
    );
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - HalfCircle.RADIUS * this.sizeCoefficientX() &&
      clickX <= this.x + HalfCircle.RADIUS * this.sizeCoefficientX() &&
      clickY >= this.y - HalfCircle.RADIUS * this.sizeCoefficientY() &&
      clickY <= this.y
    );
  }
}
