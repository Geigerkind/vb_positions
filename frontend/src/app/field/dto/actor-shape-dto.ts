import { ShapeDto } from "./shape-dto";
import { ShapeFieldPositionDto } from "./shape-field-position-dto";

export interface ActorShapeDto extends ShapeDto {
  f: ShapeFieldPositionDto[];
}
