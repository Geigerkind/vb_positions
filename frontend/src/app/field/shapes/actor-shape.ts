import { Shape } from "./shape";
import { Actor } from "../entity/actor";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { Position } from "../value/position";
import { ShapeFieldPositionDto } from "../dto/shape-field-position-dto";
import { ActorShapeDto } from "../dto/actor-shape-dto";

export abstract class ActorShape extends Shape {
  protected static BASE_SIZE_RESOLUTION_X_1M_IN_PIXEL: number = 40;
  protected static BASE_SIZE_RESOLUTION_Y_1M_IN_PIXEL: number = 76;
  protected static readonly ACTOR_COLOR: string = "#34abcd";
  protected rotationOffset?: Position;
  protected fieldPosition: ShapeFieldPosition;

  protected constructor(
    public actor: Actor,
    context: CanvasRenderingContext2D,
    field_position?: ShapeFieldPosition,
    rotationOffset?: Position
  ) {
    super(context);
    if (field_position) {
      this.fieldPosition = field_position;
    } else {
      this.setPosition(this.fromDiscreteX(4500 + 225 / 2), this.fromDiscreteY(5500));
    }
    this.rotationOffset = rotationOffset;
  }

  toDto(): ActorShapeDto {
    return {
      f: {
        x: Number(this.fieldPosition.x.toFixed(0)).valueOf(),
        y: Number(this.fieldPosition.y.toFixed(0)).valueOf(),
      } as ShapeFieldPositionDto,
      ro: this.rotationOffset ? this.rotationOffset.value : "NULL",
    };
  }

  public override draw(): void {
    super.draw();
    this.drawPosition();
    this.drawActorName();
  }

  protected currentPosition(): Position | undefined {
    if (!this.rotationOffset) {
      return undefined;
    }
    return this.actor.position.rotate(this.rotationOffset);
  }

  abstract drawPosition(): void;

  abstract drawActorName(): void;

  public setPosition(x: number, y: number): void {
    this.fieldPosition = {
      x: this.toDiscreteX(x),
      y: this.toDiscreteY(y),
    };
  }

  get x(): number {
    return this.fromDiscreteX(this.getFieldPosition().x);
  }

  get y(): number {
    return this.fromDiscreteY(this.getFieldPosition().y);
  }

  public getFieldPosition(): ShapeFieldPosition {
    return this.fieldPosition!;
  }

  public setRotationProperties(rotationPosition?: Position): void {
    this.rotationOffset = rotationPosition;
  }

  protected sizeCoefficientX(): number {
    return this.context.canvas.width / 9 / ActorShape.BASE_SIZE_RESOLUTION_X_1M_IN_PIXEL;
  }

  protected sizeCoefficientY(): number {
    return this.context.canvas.height / 10 / ActorShape.BASE_SIZE_RESOLUTION_Y_1M_IN_PIXEL;
  }
}
