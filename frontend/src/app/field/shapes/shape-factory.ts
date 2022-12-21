import { Actor } from "../entity/actor";
import { HalfCircle } from "./half-circle";
import { PlayerRole } from "../value/player-role";
import { Triangle } from "./triangle";
import { Circle } from "./circle";
import { ShapeFieldPosition } from "../value/shape-field-position";
import { ActorShapeDto } from "../dto/actor-shape-dto";
import { ActorShape } from "./actor-shape";
import { LineShapeDto } from "../dto/line-shape-dto";
import { Line } from "./line";
import { Square } from "./square";

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
      case PlayerRole.DefensiveSpecialist:
        return new Square(actor, context, field_positions);
      case PlayerRole.OutsideHitter:
        return new Circle(actor, context, false, field_positions);
      case PlayerRole.OppositeHitter:
        return new Circle(actor, context, true, field_positions);
    }
  }

  public static fromLineDto(lineDto: LineShapeDto, context: CanvasRenderingContext2D): Line {
    const maxPos = Math.max(...Object.keys(lineDto.f).map(str => Number(str)));
    const positions: ShapeFieldPosition[] = [];
    for (let i = 0; i <= maxPos; ++i) {
      positions.push({
        x: Number(lineDto.f[i.toString()].x),
        y: Number(lineDto.f[i.toString()].y),
      } as ShapeFieldPosition);
    }

    return new Line(context, positions);
  }
}
