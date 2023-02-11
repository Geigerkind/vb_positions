import { ShapeDto } from "./shape-dto";
import { DrawColor } from "../value/draw-color";

export interface LineShapeDto extends ShapeDto {
  f: any;
  c: DrawColor;
}
