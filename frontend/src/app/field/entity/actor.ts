import { Position } from "../value/position";
import { PlayerRole } from "../value/player-role";
import { generate_uuid } from "../../shared/util/generate_uuid";
import { ActorDto } from "../dto/actor-dto";
import { Shape } from "../shapes/shape";
import { ShapeFactory } from "../shapes/shape-factory";

export class Actor {
  private _UUID: string;
  private _shape: Shape;

  get UUID(): string {
    return this._UUID;
  }

  get shape(): Shape {
    return this._shape;
  }

  constructor(
    public readonly position: Position,
    public readonly player_role: PlayerRole,
    public readonly player_name?: string,
    UUID?: string,
    shape?: Shape
  ) {
    if (UUID) {
      this._UUID = UUID;
    } else {
      this._UUID = generate_uuid();
    }

    if (shape) {
      this._shape = shape;
    }
  }

  public static fromDto(actorDto: ActorDto, context: CanvasRenderingContext2D): Actor {
    const actor = new Actor(new Position(actorDto.p), actorDto.pr, actorDto.pn, actorDto.u);
    const shape = ShapeFactory.fromDto(actor, actorDto.s, context);
    actor.setShape(shape);
    return actor;
  }

  public toDto(): ActorDto {
    return {
      pn: this.player_name,
      pr: this.player_role,
      p: this.position.value,
      u: this.UUID,
      s: this.shape.toDto(),
    };
  }

  public setShape(shape: Shape): void {
    this._shape = shape;
  }

  public draw(): void {
    this.shape.draw();
  }

  toString(): string {
    if (this.player_name) {
      return `${this.player_name} (${this.position.value}) - ${this.player_role.toString()}`;
    }
    return `Unnamed actor (${this.position.value}) - ${this.player_role.toString()}`;
  }
}
