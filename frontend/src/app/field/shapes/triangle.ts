import {Shape} from "./shape";
import {Actor} from "../entity/actor";
import {ShapeType} from "../value/shape-type";
import {ShapeDto} from "../dto/shape-dto";

export class Triangle extends Shape {
  private static WIDTH: number = 40;
  private static HEIGHT: number = 40;
  public readonly shape_type: ShapeType = ShapeType.Triangle;

  constructor(actor: Actor, context: CanvasRenderingContext2D, x: number, y: number, private dashed: boolean) {
    super(actor, context, x, y);
  }

  drawActorName(): void {
    if (!this.actor.player_name) {
      return;
    }

    this.context.font = "20px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.actor.player_name, this.x, this.y + Triangle.HEIGHT * 1.6);
  }

  drawPosition(): void {
    this.context.font = "40px Roboto";
    this.context.fillStyle = "#000000";
    this.context.textAlign = "center";
    this.context.fillText(this.currentPosition().value.toString(), this.x - 2, this.y + 25);
  }

  drawShape(): void {
    this.context.beginPath();
    this.context.lineWidth = 4;
    this.context.strokeStyle = '#003300';
    if (this.dashed) {
      this.context.setLineDash([6]);
    } else {
      this.context.setLineDash([]);
    }
    this.context.moveTo(this.x - Triangle.WIDTH, this.y + Triangle.HEIGHT);
    this.context.lineTo(this.x + Triangle.WIDTH, this.y + Triangle.HEIGHT);
    this.context.lineTo(this.x, this.y - Triangle.HEIGHT);
    this.context.closePath();
    this.context.stroke();
    this.context.fillStyle = 'red';
    this.context.fill();
  }

  isHit(clickX: number, clickY: number): boolean {
    return clickX >= this.x - Triangle.WIDTH && clickX <= this.x + Triangle.WIDTH && clickY >= this.y - Triangle.HEIGHT && clickY <= this.y + Triangle.HEIGHT;
  }

  copy(): Shape {
    return new Triangle(this.actor.copy(), this.context, this.x, this.y, this.dashed);
  }

  toDto(): ShapeDto {
    return {
      actor: this.actor.toDto(),
      dashed: this.dashed,
      shape_type: this.shape_type,
      x_percent: this.x_percent,
      y_percent: this.y_percent
    }
  }

}
