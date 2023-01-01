import { TargetPointXYZ } from "../value/targetPointXYZ";
import { TossType } from "../value/tossType";
import { BallTouch } from "./ballTouch";

export interface Toss extends BallTouch {
  targetPoint: TargetPointXYZ;
  tossType: TossType;
  ballTouch?: BallTouch;
}
