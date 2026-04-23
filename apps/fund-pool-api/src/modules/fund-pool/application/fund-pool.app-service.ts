import { Injectable, Inject, Logger } from '@nestjs/common';
import { IFundPoolConfigRepository } from '../domain/fund-pool-config.repository';
import { IFundPoolRuntimeRepository } from '../domain/fund-pool-runtime.repository';
import { FundPoolDomainService, PoolSnapshot } from '../domain/fund-pool.domain-service';
import { BusinessException, BusinessErrorCode } from '../../../common/exceptions/business.exception';
import { GetPoolListQuery } from './queries/get-pool-list.query';

export interface PoolListResult {
  gameId: string;
  pools: PoolSnapshot[];
}

@Injectable()
export class FundPoolAppService {
  private readonly logger = new Logger(FundPoolAppService.name);

  constructor(
    @Inject('IFundPoolConfigRepository')
    private readonly configRepo: IFundPoolConfigRepository,
    @Inject('IFundPoolRuntimeRepository')
    private readonly runtimeRepo: IFundPoolRuntimeRepository,
    private readonly domainService: FundPoolDomainService,
  ) {}

  async getPoolListByGameId(query: GetPoolListQuery): Promise<PoolListResult> {
    const configs = await this.configRepo.findEnabledByGameId(query.gameId);

    if (configs.length === 0) {
      throw new BusinessException(BusinessErrorCode.POOL_NOT_FOUND, 'No fund pools found for the given gameId');
    }

    const poolIds = configs.map((c) => c.poolId);
    const runtimes = await this.runtimeRepo.findByPoolIds(poolIds);
    const runtimeMap = new Map(runtimes.map((r) => [r.poolId, r]));

    const pools: PoolSnapshot[] = [];
    for (const config of configs) {
      const runtime = runtimeMap.get(config.poolId);
      if (!runtime) {
        this.logger.warn(`Runtime not found for poolId=${config.poolId}, skipping`);
        continue;
      }
      pools.push(this.domainService.assembleSnapshot(config, runtime));
    }

    return { gameId: query.gameId, pools };
  }
}
