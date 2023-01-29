import { Player } from "../entity/player";
import { BallTouch } from "../entity/ballTouch";
import { MetadataDto } from "./MetadataDto";
import { Quick } from "../entity/Quick";

export interface StatisticsStoreData {
  players: Player[];
  metadata: MetadataDto[];
  ballTouches: BallTouch[];
  quicks: Quick[];
}
