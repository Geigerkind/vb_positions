import { BallTouch } from "./ballTouch";
import { FailureType } from "../value/failureType";
import { TargetPointXY } from "../value/targetPointXY";

export interface Attack extends BallTouch {
  failureType?: FailureType;
  targetPoint?: TargetPointXY;
  ballTouch?: BallTouch;
}
