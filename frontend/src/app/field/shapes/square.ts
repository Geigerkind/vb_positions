import { ActorShape } from "./actor-shape";
import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";

export class Square extends ActorShape {
  private static RELATIVE_SIZE: number = 0.016 * 2.5;
  private static SIZE_MAX: number = 40;

  constructor(actor: Actor, context: CanvasRenderingContext2D, field_positions?: Map<string, ShapeFieldPosition>) {
    super(actor, context, field_positions);
  }

  get size(): number {
    return Math.min(
      Math.max(this.context.canvas.width, this.context.canvas.height) * Square.RELATIVE_SIZE,
      Square.SIZE_MAX
    );
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + this.size * 1.6);
  }

  drawPosition(): void {
    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.currentPosition().value.toString(), this.x, this.y + this.size / 2 - 2);
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.lineWidth = 4;
    this.context.strokeStyle = "#003300";
    this.context.setLineDash([]);
    this.context.moveTo(this.x - this.size, this.y + this.size);
    this.context.lineTo(this.x + this.size, this.y + this.size);
    this.context.lineTo(this.x + this.size, this.y - this.size);
    this.context.lineTo(this.x - this.size, this.y - this.size);
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = "red";
    this.context.fill();
  }

  isHit(clickX: number, clickY: number): boolean {
    return (
      clickX >= this.x - this.size &&
      clickX <= this.x + this.size &&
      clickY >= this.y - this.size &&
      clickY <= this.y + this.size
    );
  }
}
