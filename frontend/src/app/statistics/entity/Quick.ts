import { QuickActionType } from "../value/quickActionType";

export interface Quick {
  uuid: string;
  player_uuid: string;
  metadata_uuid: string;
  quick_action_type: QuickActionType;
}
