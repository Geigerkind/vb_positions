import { TargetPoint } from "../value/targetPoint";
import { TossType } from "../value/tossType";
import { BallTouch } from "./ballTouch";
import { FailureType } from "../value/failureType";
import { TossDirection } from "../value/tossDirection";
import { TossTempo } from "../value/tossTempo";

export interface Toss extends BallTouch {
  tossType: TossType;
  tossDirection: TossDirection;
  tossTempo: TossTempo;
  failureType: FailureType;
  targetPoint?: TargetPoint;
}
