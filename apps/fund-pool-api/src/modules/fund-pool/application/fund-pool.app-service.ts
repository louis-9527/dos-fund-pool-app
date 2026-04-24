import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IFundPoolConfigRepository,
  IFundPoolRuntimeRepository,
  IFundPoolChangeLogRepository,
  IFundPoolScheduledInjectionRepository,
  CreateScheduledInjectionInput,
  BusinessException,
  BusinessErrorCode,
  ChangeType,
} from '@app/fund-pool-shared';
import { FundPoolDomainService, PoolSnapshot } from '../domain/fund-pool.domain-service';
import { GetPoolListQuery } from './queries/get-pool-list.query';

export interface PoolListResult {
  gameId: string;
  pools: PoolSnapshot[];
}

export interface AdjustBalanceCommand {
  poolId: string;
  amount: number;
  operatorId: string;
  remark: string;
}

export interface ScheduledInjectionCommand {
  poolId: string;
  injectionCount: number;
  singleInjectionAmount: number;
  intervalSeconds: number;
  firstInjectionAt: Date;
}

@Injectable()
export class FundPoolAppService {
  private readonly logger = new Logger(FundPoolAppService.name);

  constructor(
    @Inject('IFundPoolConfigRepository')
    private readonly configRepo: IFundPoolConfigRepository,
    @Inject('IFundPoolRuntimeRepository')
    private readonly runtimeRepo: IFundPoolRuntimeRepository,
    @Inject('IFundPoolChangeLogRepository')
    private readonly changeLogRepo: IFundPoolChangeLogRepository,
    @Inject('IFundPoolScheduledInjectionRepository')
    private readonly scheduledInjectionRepo: IFundPoolScheduledInjectionRepository,
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

  async increaseBalance(command: AdjustBalanceCommand): Promise<{ currentBalance: number }> {
    return this.doAdjustBalance(command.poolId, command.amount, 'manualAdd', command.operatorId, command.remark);
  }

  async decreaseBalance(command: AdjustBalanceCommand): Promise<{ currentBalance: number }> {
    return this.doAdjustBalance(command.poolId, -command.amount, 'manualReduce', command.operatorId, command.remark);
  }

  private async doAdjustBalance(
    poolId: string,
    deltaAmount: number,
    changeType: ChangeType,
    operatorId: string,
    remark: string,
  ): Promise<{ currentBalance: number }> {
    const now = new Date();
    const result = await this.runtimeRepo.adjustBalance(poolId, deltaAmount, now);

    if (!result) {
      throw new BusinessException(BusinessErrorCode.POOL_NOT_FOUND, `Fund pool runtime not found for poolId: ${poolId}`);
    }

    await this.changeLogRepo.create({
      eventId: randomUUID(),
      poolId,
      changeType,
      changeReason: 'manual',
      deltaAmount,
      balanceBefore: result.balanceBefore,
      balanceAfter: result.balanceAfter,
      referenceType: 'manual',
      referenceId: '',
      operatorType: 'admin',
      operatorId,
      remark,
      occurredAt: now,
    });

    return { currentBalance: result.balanceAfter };
  }

  async createScheduledInjection(command: ScheduledInjectionCommand): Promise<{ id: string }> {
    const config = await this.configRepo.findByPoolId(command.poolId);
    if (!config) {
      throw new BusinessException(BusinessErrorCode.POOL_NOT_FOUND, `Fund pool config not found for poolId: ${command.poolId}`);
    }

    const entity = await this.scheduledInjectionRepo.create({
      poolId: command.poolId,
      injectionCount: command.injectionCount,
      singleInjectionAmount: command.singleInjectionAmount,
      intervalSeconds: command.intervalSeconds,
      firstInjectionAt: command.firstInjectionAt,
    });

    return { id: entity.id };
  }
}
