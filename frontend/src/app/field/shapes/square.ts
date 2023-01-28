import { ActorShape } from "./actor-shape";
import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";

export class Square extends ActorShape {
  private static SIZE: number = 30;

  constructor(actor: Actor, context: CanvasRenderingContext2D, field_positions?: Map<string, ShapeFieldPosition>) {
    super(actor, context, field_positions);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + Square.SIZE * this.sizeCoefficientY() * 1.6 + 5);
  }

  drawPosition(): void {
    const currentPosition = this.currentPosition();
    if (!currentPosition) {
      return;
    }

    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(
      currentPosition.value.toString(),
      this.x,
      this.y + (Square.SIZE / 2) * this.sizeCoefficientY() - 2
    );
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.lineWidth = 4;
    this.context.strokeStyle = "#003300";
    this.context.setLineDash([]);
    this.context.moveTo(this.x - Square.SIZE * this.sizeCoefficientX(), this.y + Square.SIZE * this.sizeCoefficientY());
    this.context.lineTo(this.x + Square.SIZE * this.sizeCoefficientX(), this.y + Square.SIZE * this.sizeCoefficientY());
    this.context.lineTo(this.x + Square.SIZE * this.sizeCoefficientX(), this.y - Square.SIZE * this.sizeCoefficientY());
    this.context.lineTo(this.x - Square.SIZE * this.sizeCoefficientX(), this.y - Square.SIZE * this.sizeCoefficientY());
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = ActorShape.ACTOR_COLOR;
    this.context.fill();
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - Square.SIZE * this.sizeCoefficientX() &&
      clickX <= this.x + Square.SIZE * this.sizeCoefficientX() &&
      clickY >= this.y - Square.SIZE * this.sizeCoefficientY() &&
      clickY <= this.y + Square.SIZE * this.sizeCoefficientY()
    );
  }
}
