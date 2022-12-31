import { TargetPointXYZ } from "../value/targetPointXYZ";
import { TossType } from "../value/tossType";
import { Attack } from "./attack";

export interface Toss {
  id: number;
  target_point: TargetPointXYZ;
  toss_type: TossType;
  attack?: Attack;
}
