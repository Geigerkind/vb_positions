import { BallTouchType } from "../value/ballTouchType";
import { TouchCount } from "../value/touchCount";

export interface BallTouch {
  uuid: string;
  playerUuid: string;
  touchType: BallTouchType;
  touchCount: TouchCount;
  metaDataUuid: string;
  addedAt: Date | string;
  ballTouchUuid?: string;
}
