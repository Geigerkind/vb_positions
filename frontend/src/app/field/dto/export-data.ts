import { Actor } from "../entity/actor";
import { Rotation } from "../entity/rotation";

export interface ExportData {
  version: number;
  actors: Actor[];
  rotations: Rotation[];
  current_rotation: string;
}
