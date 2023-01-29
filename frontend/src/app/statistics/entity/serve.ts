import { ServeType } from "../value/serveType";
import { TargetPoint } from "../value/targetPoint";
import { FailureType } from "../value/failureType";
import { BallTouch } from "./ballTouch";

export interface Serve extends BallTouch {
  serveType: ServeType;
  failureType: FailureType;
  targetPoint?: TargetPoint;
}
