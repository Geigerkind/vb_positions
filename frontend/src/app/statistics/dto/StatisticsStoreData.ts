import { Player } from "../entity/player";
import { BallTouch } from "../entity/ballTouch";
import { MetadataDto } from "./MetadataDto";

export interface StatisticsStoreData {
  players: Player[];
  metadata: MetadataDto[];
  ballTouches: BallTouch[];
}
