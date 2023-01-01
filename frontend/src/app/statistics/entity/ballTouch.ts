import { Player } from "./player";
import { BallTouchType } from "../value/ballTouchType";
import { MetaData } from "./metaData";

export interface BallTouch {
  id: number;
  player: Player;
  touchType: BallTouchType;
  metaData: MetaData;
}
