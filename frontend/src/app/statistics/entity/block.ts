import { BallTouch } from "./ballTouch";
import { TargetPoint } from "../value/targetPoint";
import { FailureType } from "../value/failureType";

export interface Block extends BallTouch {
  failureType: FailureType;
  targetPoint?: TargetPoint;
  ballTouch?: BallTouch;
}
