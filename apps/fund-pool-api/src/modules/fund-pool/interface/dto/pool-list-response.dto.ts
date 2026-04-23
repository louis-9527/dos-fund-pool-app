export class PoolItemDto {
  poolId: string;
  poolName: string;
  poolCategory: string;
  betAmountMin: number;
  betAmountMax: number;
  singlePayoutLimit: number;
  currentBalance: number;
  currentLevelNo: number;
  lastChangeAt: Date;
}

export class PoolListResponseDto {
  gameId: string;
  pools: PoolItemDto[];
}
