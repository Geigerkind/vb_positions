import { Player } from "./player";
import { BallTouchType } from "../value/ballTouchType";
import { Metadata } from "./metadata";

export interface BallTouch {
  uuid: string;
  player: Player;
  touchType: BallTouchType;
  metaData: Metadata;
  addedAt: Date;
  ballTouchUuid?: string;
}
