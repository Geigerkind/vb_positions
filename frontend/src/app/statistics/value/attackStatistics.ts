export interface AttackStatistics {
  player_name: string;
  attacks_total: number;
  attacks_blocked: number;
  attacks_failed: number;
  attacks_success: number;
  attacks_returned: number;
  front_left: number;
  front_center: number;
  front_right: number;
  back_left: number;
  back_center: number;
  back_right: number;
}
