import { TargetPoint } from "../value/targetPoint";
import { TossType } from "../value/tossType";
import { BallTouch } from "./ballTouch";
import { FailureType } from "../value/failureType";

export interface Toss extends BallTouch {
  tossType: TossType;
  failureType: FailureType;
  targetPoint?: TargetPoint;
  ballTouch?: BallTouch;
}
