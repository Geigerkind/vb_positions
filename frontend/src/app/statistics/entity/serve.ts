import { ServeType } from "../value/serveType";
import { Actor } from "../../field/entity/actor";
import { TargetPointXY } from "../value/targetPointXY";
import { Receive } from "./receive";

export interface Serve {
  id: number;
  actor: Actor;
  serve_type: ServeType;
  target_point: TargetPointXY;
  received?: Receive;
}
