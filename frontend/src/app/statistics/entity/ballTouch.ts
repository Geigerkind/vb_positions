import { BallTouchType } from "../value/ballTouchType";

export interface BallTouch {
  uuid: string;
  playerUuid: string;
  touchType: BallTouchType;
  metaDataUuid: string;
  addedAt: Date;
  ballTouchUuid?: string;
}
