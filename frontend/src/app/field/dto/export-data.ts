import { Actor } from "../entity/actor";
import { Rotation } from "../entity/rotation";

export interface ExportData {
  actors: Actor[];
  rotations: Rotation[];
  current_rotation: string;
}
