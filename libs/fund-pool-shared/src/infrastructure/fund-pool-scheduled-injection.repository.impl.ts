import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFundPoolScheduledInjectionRepository, CreateScheduledInjectionInput } from '../domain/fund-pool-scheduled-injection.repository';
import { FundPoolScheduledInjectionEntity } from '../domain/fund-pool-scheduled-injection.entity';
import { FundPoolScheduledInjection, FundPoolScheduledInjectionDocument } from './fund-pool-scheduled-injection.schema';

@Injectable()
export class FundPoolScheduledInjectionRepositoryImpl implements IFundPoolScheduledInjectionRepository {
  constructor(
    @InjectModel(FundPoolScheduledInjection.name)
    private readonly model: Model<FundPoolScheduledInjectionDocument>,
  ) {}

  async create(input: CreateScheduledInjectionInput): Promise<FundPoolScheduledInjectionEntity> {
    const doc = await this.model.create({
      poolId: input.poolId,
      injectionCount: input.injectionCount,
      singleInjectionAmount: input.singleInjectionAmount,
      intervalSeconds: input.intervalSeconds,
      firstInjectionAt: input.firstInjectionAt,
      executedCount: 0,
      status: 0,
    });
    return this.toDomain(doc);
  }

  private toDomain(doc: any): FundPoolScheduledInjectionEntity {
    return new FundPoolScheduledInjectionEntity({
      id: doc._id.toString(),
      poolId: doc.poolId,
      injectionCount: doc.injectionCount,
      singleInjectionAmount: doc.singleInjectionAmount != null ? Number(doc.singleInjectionAmount.toString()) : 0,
      intervalSeconds: doc.intervalSeconds,
      firstInjectionAt: doc.firstInjectionAt,
      executedCount: doc.executedCount,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
