import { BallTouch } from "./ballTouch";
import { FailureType } from "../value/failureType";
import { TargetPoint } from "../value/targetPoint";

export interface Attack extends BallTouch {
  failureType: FailureType;
  targetPoint?: TargetPoint;
}
