import { PlayerRole } from "../value/player-role";
import { ActorShapeDto } from "./actor-shape-dto";

export interface ActorDto {
  u: string;
  p: number;
  pr: PlayerRole;
  pn: string;
  s: ActorShapeDto;
}
