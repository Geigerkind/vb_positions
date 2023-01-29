import { ReceiveType } from "../value/receiveType";
import { BallTouch } from "./ballTouch";
import { TargetPoint } from "../value/targetPoint";

export interface Receive extends BallTouch {
  receiveType: ReceiveType;
  targetPoint: TargetPoint;
}
