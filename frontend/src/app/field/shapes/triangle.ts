import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShape } from "./actor-shape";
import { Position } from "../value/position";

export class Triangle extends ActorShape {
  private static SIZE: number = 25;

  constructor(
    actor: Actor,
    context: CanvasRenderingContext2D,
    private dashed: boolean,
    field_position?: ShapeFieldPosition,
    rotationOffset?: Position
  ) {
    super(actor, context, field_position, rotationOffset);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + Triangle.SIZE * this.sizeCoefficientY() * 1.6 + 5);
  }

  drawPosition(): void {
    const currentPosition = this.currentPosition();
    if (!currentPosition) {
      return;
    }

    this.context.font = "30px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(currentPosition.value.toString(), this.x - 2, this.y + 20);
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.lineWidth = 4;
    this.context.strokeStyle = "#003300";
    if (this.dashed) {
      this.context.setLineDash([6]);
    } else {
      this.context.setLineDash([]);
    }
    this.context.moveTo(
      this.x - Triangle.SIZE * this.sizeCoefficientX(),
      this.y + Triangle.SIZE * this.sizeCoefficientY()
    );
    this.context.lineTo(
      this.x + Triangle.SIZE * this.sizeCoefficientX(),
      this.y + Triangle.SIZE * this.sizeCoefficientY()
    );
    this.context.lineTo(this.x, this.y - Triangle.SIZE * this.sizeCoefficientY());
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = ActorShape.ACTOR_COLOR;
    this.context.fill();
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - Triangle.SIZE * this.sizeCoefficientX() &&
      clickX <= this.x + Triangle.SIZE * this.sizeCoefficientX() &&
      clickY >= this.y - Triangle.SIZE * this.sizeCoefficientY() &&
      clickY <= this.y + Triangle.SIZE * this.sizeCoefficientY()
    );
  }

  copy(actor: Actor): ActorShape {
    return new Triangle(actor, this.context, this.dashed, this.fieldPosition, this.rotationOffset);
  }
}
