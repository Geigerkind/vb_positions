import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShape } from "./actor-shape";
import { Position } from "../value/position";

export class Circle extends ActorShape {
  private static RADIUS: number = 25;

  constructor(
    actor: Actor,
    context: CanvasRenderingContext2D,
    private dashed: boolean,
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
      Circle.RADIUS * this.sizeCoefficientX(),
      Circle.RADIUS * this.sizeCoefficientY(),
      0,
      0,
      Math.PI * 2
    );
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
    const currentPosition = this.currentPosition();
    if (!currentPosition) {
      return;
    }

    this.context.font = "30px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(currentPosition.value.toString(), this.x, this.y + 12);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + Circle.RADIUS * this.sizeCoefficientY() * 1.5 + 5);
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - Circle.RADIUS * this.sizeCoefficientX() &&
      clickX <= this.x + Circle.RADIUS * this.sizeCoefficientX() &&
      clickY >= this.y - Circle.RADIUS * this.sizeCoefficientY() &&
      clickY <= this.y + Circle.RADIUS * this.sizeCoefficientY()
    );
  }

  copy(actor: Actor): ActorShape {
    return new Circle(actor, this.context, this.dashed, this.fieldPosition, this.rotationOffset);
  }
}
