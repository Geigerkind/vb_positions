import { LineShapeDto } from "./line-shape-dto";
import { ActorDto } from "./actor-dto";

export interface RotationDto {
  u: string;
  r: number | string;
  n: string;
  l: LineShapeDto[];
  a: ActorDto[];
}
