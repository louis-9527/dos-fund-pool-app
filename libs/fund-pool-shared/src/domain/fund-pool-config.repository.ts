import { FundPoolConfigEntity } from './fund-pool-config.entity';

export interface IFundPoolConfigRepository {
  findEnabledByGameId(gameId: string): Promise<FundPoolConfigEntity[]>;
  findByPoolId(poolId: string): Promise<FundPoolConfigEntity | null>;
}
