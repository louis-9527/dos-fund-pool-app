import { Injectable } from '@nestjs/common';
import { FundPoolConfigEntity, LevelConfig } from './fund-pool-config.entity';
import { FundPoolRuntimeEntity } from './fund-pool-runtime.entity';

export interface PoolSnapshot {
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

@Injectable()
export class FundPoolDomainService {
  assembleSnapshot(config: FundPoolConfigEntity, runtime: FundPoolRuntimeEntity): PoolSnapshot {
    const currentLevelNo = this.computeCurrentLevelNo(runtime.currentBalance, config.levelConfig);
    return {
      poolId: config.poolId,
      poolName: config.poolName,
      poolCategory: config.poolCategory,
      betAmountMin: config.betAmountMin,
      betAmountMax: config.betAmountMax,
      singlePayoutLimit: config.singlePayoutLimit,
      currentBalance: runtime.currentBalance,
      currentLevelNo,
      lastChangeAt: runtime.lastChangeAt,
    };
  }

  // Find the level whose range covers currentBalance.
  // If multiple levels match (should not in a well-configured pool), the highest levelNo wins.
  // Null minBalance is treated as 0; null maxBalance is treated as Infinity.
  private computeCurrentLevelNo(currentBalance: number, levelConfig: LevelConfig[]): number {
    if (!levelConfig || levelConfig.length === 0) {
      return 0;
    }

    const sorted = [...levelConfig].sort((a, b) => b.levelNo - a.levelNo);
    for (const level of sorted) {
      const min = level.minBalance ?? 0;
      const max = level.maxBalance ?? Infinity;
      if (currentBalance >= min && currentBalance <= max) {
        return level.levelNo;
      }
    }

    // Fallback: return the lowest levelNo
    return sorted[sorted.length - 1].levelNo;
  }
}
