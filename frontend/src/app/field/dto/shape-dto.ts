import { ShapeType } from "../value/shape-type";
import { ActorDto } from "./actor-dto";

export interface ShapeDto {
  shape_type: ShapeType;
  dashed?: boolean;
  actor: ActorDto;
  x_percent: number;
  y_percent: number;
}
