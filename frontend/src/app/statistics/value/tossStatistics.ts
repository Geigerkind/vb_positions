export interface TossStatistics {
  player_name: string;
  toss_total: number;
  toss_set_total: number;
  success_toss_in_2m: number;
  success_toss_in_4_5m: number;
  success_toss_in_more_than_4_5m: number;
  failed: number;
  not_connected: number;
  front_left: number;
  front_center: number;
  front_right: number;
  back_left: number;
  back_center: number;
  back_right: number;
}
