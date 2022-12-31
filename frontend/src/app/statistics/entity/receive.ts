import { Actor } from "../../field/entity/actor";
import { TargetPointXY } from "../value/targetPointXY";
import { ReceiveType } from "../value/receiveType";
import { Toss } from "./toss";

export interface Receive {
  id: number;
  actor: Actor;
  target_point: TargetPointXY;
  receive_type: ReceiveType;
  tossed?: Toss;
}
