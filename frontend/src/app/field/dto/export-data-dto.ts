import { RotationDto } from "./rotation-dto";

export interface ExportDataDto {
  rotations: RotationDto[];
  current_rotation: string;
  version?: number;
}
