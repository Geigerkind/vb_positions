export interface ServeStatisticByServeType {
  success: number;
  net: number;
  out: number;
  other: number;
  returned: number;
  part1: number;
  part2: number;
  part3: number;
  part4: number;
  part5: number;
  part6: number;
}

export interface ServeStatistics {
  player_name: string;
  serves_total: number;
  underhand: ServeStatisticByServeType;
  overhand: ServeStatisticByServeType;
  floater: ServeStatisticByServeType;
  jump: ServeStatisticByServeType;
  jump_floater: ServeStatisticByServeType;
}
