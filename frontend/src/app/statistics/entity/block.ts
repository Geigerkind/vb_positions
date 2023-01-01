import { BallTouch } from "./ballTouch";
import { TargetPointXY } from "../value/targetPointXY";
import { FailureType } from "../value/failureType";

export interface Block extends BallTouch {
  failureType?: FailureType;
  targetPoint?: TargetPointXY;
  ballTouch?: BallTouch;
}
