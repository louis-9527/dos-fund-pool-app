import { Controller, Post, Body } from '@nestjs/common';
import { FundPoolAppService } from '../application/fund-pool.app-service';
import { GetPoolListDto } from './dto/get-pool-list.dto';
import { AdjustBalanceDto } from './dto/adjust-balance.dto';
import { CreateScheduledInjectionDto } from './dto/create-scheduled-injection.dto';
import { PoolListResponseDto } from './dto/pool-list-response.dto';
import { GetPoolListQuery } from '../application/queries/get-pool-list.query';

@Controller('fund-pool')
export class FundPoolController {
  constructor(private readonly fundPoolAppService: FundPoolAppService) {}

  @Post('getPoolListByGameId')
  async getPoolListByGameId(@Body() dto: GetPoolListDto): Promise<PoolListResponseDto> {
    return this.fundPoolAppService.getPoolListByGameId(new GetPoolListQuery(dto.gameId));
  }

  @Post('increaseBalance')
  async increaseBalance(@Body() dto: AdjustBalanceDto): Promise<void> {
    await this.fundPoolAppService.increaseBalance({
      poolId: dto.poolId,
      amount: dto.amount,
      operatorId: dto.operatorId ?? '',
      remark: dto.remark ?? '',
    });
  }

  @Post('decreaseBalance')
  async decreaseBalance(@Body() dto: AdjustBalanceDto): Promise<void> {
    await this.fundPoolAppService.decreaseBalance({
      poolId: dto.poolId,
      amount: dto.amount,
      operatorId: dto.operatorId ?? '',
      remark: dto.remark ?? '',
    });
  }

  @Post('createScheduledInjection')
  async createScheduledInjection(@Body() dto: CreateScheduledInjectionDto): Promise<{ id: string }> {
    return this.fundPoolAppService.createScheduledInjection({
      poolId: dto.poolId,
      injectionCount: dto.injectionCount,
      singleInjectionAmount: dto.singleInjectionAmount,
      intervalSeconds: dto.intervalSeconds,
      firstInjectionAt: new Date(dto.firstInjectionAt),
    });
  }
}
