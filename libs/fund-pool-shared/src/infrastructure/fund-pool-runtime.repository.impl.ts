import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFundPoolRuntimeRepository } from '../domain/fund-pool-runtime.repository';
import { FundPoolRuntimeEntity } from '../domain/fund-pool-runtime.entity';
import { FundPoolRuntime, FundPoolRuntimeDocument } from './fund-pool-runtime.schema';

@Injectable()
export class FundPoolRuntimeRepositoryImpl implements IFundPoolRuntimeRepository {
  constructor(
    @InjectModel(FundPoolRuntime.name)
    private readonly model: Model<FundPoolRuntimeDocument>,
  ) {}

  async findByPoolId(poolId: string): Promise<FundPoolRuntimeEntity | null> {
    const doc = await this.model.findOne({ poolId }).lean().exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByPoolIds(poolIds: string[]): Promise<FundPoolRuntimeEntity[]> {
    const docs = await this.model.find({ poolId: { $in: poolIds } }).lean().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async updateBalance(poolId: string, newBalance: number, lastChangeAt: Date): Promise<void> {
    await this.model
      .updateOne({ poolId }, { $set: { currentBalance: newBalance, lastChangeAt } })
      .exec();
  }

  private toDomain(doc: any): FundPoolRuntimeEntity {
    return new FundPoolRuntimeEntity({
      id: doc._id.toString(),
      poolId: doc.poolId,
      currentBalance: doc.currentBalance ?? 0,
      totalInflowAmount: doc.totalInflowAmount ?? 0,
      totalOutflowAmount: doc.totalOutflowAmount ?? 0,
      totalManualAdjustAmount: doc.totalManualAdjustAmount ?? 0,
      lastChangeAt: doc.lastChangeAt ?? doc.updatedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
