import { ShapeDto } from "../dto/shape-dto";
import { Shape } from "./shape";
import { Actor } from "../entity/actor";
import { HalfCircle } from "./half-circle";
import { PlayerRole } from "../value/player-role";
import { Triangle } from "./triangle";
import { Circle } from "./circle";

export class ShapeFactory {
  public static fromDto(actor: Actor, shapeDto: ShapeDto, context: CanvasRenderingContext2D): Shape {
    const field_positions = new Map(shapeDto.f);
    switch (actor.player_role) {
      case PlayerRole.Setter:
        return new HalfCircle(actor, context, field_positions);
      case PlayerRole.MiddleBlocker:
        return new Triangle(actor, context, false, field_positions);
      case PlayerRole.Libero:
        return new Triangle(actor, context, false, field_positions);
      case PlayerRole.OutsideHitter:
        return new Circle(actor, context, false, field_positions);
      case PlayerRole.OppositeHitter:
        return new Circle(actor, context, true, field_positions);
    }
  }
}
