import { FundPoolRuntimeEntity } from './fund-pool-runtime.entity';

export interface IFundPoolRuntimeRepository {
  findByPoolId(poolId: string): Promise<FundPoolRuntimeEntity | null>;
  findByPoolIds(poolIds: string[]): Promise<FundPoolRuntimeEntity[]>;
}
