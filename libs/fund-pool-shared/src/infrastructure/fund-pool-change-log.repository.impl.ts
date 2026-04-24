import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFundPoolChangeLogRepository, CreateChangeLogInput } from '../domain/fund-pool-change-log.repository';
import { FundPoolChangeLog, FundPoolChangeLogDocument } from './fund-pool-change-log.schema';

@Injectable()
export class FundPoolChangeLogRepositoryImpl implements IFundPoolChangeLogRepository {
  constructor(
    @InjectModel(FundPoolChangeLog.name)
    private readonly model: Model<FundPoolChangeLogDocument>,
  ) {}

  async create(input: CreateChangeLogInput): Promise<void> {
    await this.model.create({
      eventId: input.eventId,
      poolId: input.poolId,
      changeType: input.changeType,
      changeReason: input.changeReason,
      deltaAmount: input.deltaAmount,
      balanceBefore: input.balanceBefore,
      balanceAfter: input.balanceAfter,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      operatorType: input.operatorType,
      operatorId: input.operatorId,
      remark: input.remark,
      occurredAt: input.occurredAt,
    });
  }
}
