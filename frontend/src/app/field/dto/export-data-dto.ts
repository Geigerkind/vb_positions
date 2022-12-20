import { ActorDto } from "./actor-dto";
import { RotationDto } from "./rotation-dto";

export interface ExportDataDto {
  actors: ActorDto[];
  rotations: RotationDto[];
  current_rotation: string;
}
