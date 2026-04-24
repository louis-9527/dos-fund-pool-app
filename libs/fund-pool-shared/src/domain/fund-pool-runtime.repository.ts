import { FundPoolRuntimeEntity } from './fund-pool-runtime.entity';

export interface AdjustBalanceResult {
  balanceBefore: number;
  balanceAfter: number;
}

export interface IFundPoolRuntimeRepository {
  findByPoolId(poolId: string): Promise<FundPoolRuntimeEntity | null>;
  findByPoolIds(poolIds: string[]): Promise<FundPoolRuntimeEntity[]>;
  updateBalance(poolId: string, newBalance: number, lastChangeAt: Date): Promise<void>;
  adjustBalance(poolId: string, deltaAmount: number, lastChangeAt: Date): Promise<AdjustBalanceResult | null>;
}
