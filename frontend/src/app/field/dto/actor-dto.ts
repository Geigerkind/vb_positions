import { PlayerRole } from "../value/player-role";
import { ShapeDto } from "./shape-dto";

export interface ActorDto {
  u: string;
  p: number;
  pr: PlayerRole;
  pn: string;
  s: ShapeDto;
}
