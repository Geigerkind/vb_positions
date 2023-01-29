import { Position } from "../value/position";
import { PlayerRole } from "../value/player-role";
import { generate_uuid } from "../../shared/util/generate_uuid";
import { ActorDto } from "../dto/actor-dto";
import { ShapeFactory } from "../shapes/shape-factory";
import { ActorShape } from "../shapes/actor-shape";

export class Actor {
  private _UUID: string;
  private _shape: ActorShape;

  get UUID(): string {
    return this._UUID;
  }

  get shape(): ActorShape {
    return this._shape;
  }

  constructor(
    public readonly position: Position,
    public readonly player_role: PlayerRole,
    public readonly player_name?: string,
    UUID?: string,
    shape?: ActorShape
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
    const actor = new Actor(
      new Position(actorDto.p),
      actorDto.pr,
      actorDto.pn === "NULL" ? undefined : actorDto.pn,
      actorDto.u
    );
    const shape = ShapeFactory.fromActorDto(actor, actorDto.s, context);
    actor.setShape(shape);
    return actor;
  }

  public toDto(): ActorDto {
    return {
      pn: this.player_name ?? "NULL",
      pr: this.player_role,
      p: this.position.value,
      u: this.UUID,
      s: this.shape.toDto(),
    };
  }

  public setShape(shape: ActorShape): void {
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

  copy(): Actor {
    const actor = new Actor(this.position, this.player_role, this.player_name, undefined, undefined);
    actor.setShape(this.shape.copy(actor));
    return actor;
  }
}
