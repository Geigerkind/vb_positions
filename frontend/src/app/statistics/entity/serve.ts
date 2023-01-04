import { ServeType } from "../value/serveType";
import { TargetPointXY } from "../value/targetPointXY";
import { FailureType } from "../value/failureType";
import { BallTouch } from "./ballTouch";

export interface Serve extends BallTouch {
  serveType: ServeType;
  failureType: FailureType;
  targetPoint?: TargetPointXY;
  ballTouch?: BallTouch;
}
