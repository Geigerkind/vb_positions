import { ReceiveType } from "../value/receiveType";
import { BallTouch } from "./ballTouch";
import { TargetPointXYZ } from "../value/targetPointXYZ";

export interface Receive extends BallTouch {
  receiveType: ReceiveType;
  targetPoint: TargetPointXYZ;
  ballTouch?: BallTouch;
}
