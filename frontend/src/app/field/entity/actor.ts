import {Position} from "../value/position";
import {PlayerRole} from "../value/player-role";
import {generate_uuid} from "../../shared/util/generate_uuid";
import {ActorDto} from "../dto/actor-dto";

export class Actor {

  private _UUID: string;

  get UUID(): string {
    return this._UUID;
  }

  constructor(public readonly position: Position, public readonly player_role: PlayerRole, public readonly player_name?: string, UUID?: string) {
    if (UUID) {
      this._UUID = UUID;
    } else {
      this._UUID = generate_uuid();
    }
  }

  public static fromDto(actorDto: ActorDto): Actor {
    return new Actor(new Position(actorDto.position), actorDto.player_role, actorDto.player_name, actorDto.UUID);
  }

  public toDto(): ActorDto {
    return {
      player_name: this.player_name,
      player_role: this.player_role,
      position: this.position.value,
      UUID: this.UUID
    };
  }

  public copy(): Actor {
    return new Actor(this.position, this.player_role, this.player_name);
  }

  toString(): string {
    if (this.player_name) {
      return `${this.player_name} (${this.position.value}) - ${this.player_role.toString()}`;
    }
    return `Unnamed actor (${this.position.value}) - ${this.player_role.toString()}`;
  }
}
