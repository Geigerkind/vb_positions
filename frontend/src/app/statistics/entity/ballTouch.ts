import { Player } from "./player";
import { BallTouchType } from "../value/ballTouchType";
import { MetaData } from "./metaData";

export interface BallTouch {
  uuid: string;
  player: Player;
  touchType: BallTouchType;
  metaData: MetaData;
  addedAt: Date;
}
