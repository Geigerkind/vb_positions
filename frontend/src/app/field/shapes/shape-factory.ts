import { Actor } from "../entity/actor";
import { HalfCircle } from "./half-circle";
import { PlayerRole } from "../value/player-role";
import { Triangle } from "./triangle";
import { Circle } from "./circle";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShapeDto } from "../dto/actor-shape-dto";
import { ActorShape } from "./actor-shape";

export class ShapeFactory {
  public static fromActorDto(actor: Actor, shapeDto: ActorShapeDto, context: CanvasRenderingContext2D): ActorShape {
    const field_positions = new Map(
      shapeDto.f.map(dto => [
        dto.u,
        {
          x: dto.x,
          y: dto.y,
        } as ShapeFieldPosition,
      ])
    );
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
