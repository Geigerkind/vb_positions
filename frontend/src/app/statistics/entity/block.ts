import { BallTouch } from "./ballTouch";
import { TargetPoint } from "../value/targetPoint";
import { FailureType } from "../value/failureType";
import { BlockType } from "../value/blockType";

export interface Block extends BallTouch {
  failureType: FailureType;
  blockType: BlockType;
  targetPoint?: TargetPoint;
}
