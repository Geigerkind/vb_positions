import {PlayerRole} from "../value/player-role";

export interface ActorDto {
  UUID: string;
  position: number;
  player_role: PlayerRole;
  player_name?: string;
}
