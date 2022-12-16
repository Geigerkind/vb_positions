import {ShapeDto} from "./shape-dto";

export interface RotationDto {
  UUID: string;
  shapes: ShapeDto[];
  rotation: number;
  name?: string;
}
