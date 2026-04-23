import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFundPoolConfigRepository } from '../domain/fund-pool-config.repository';
import { FundPoolConfigEntity } from '../domain/fund-pool-config.entity';
import { FundPoolConfig, FundPoolConfigDocument } from './fund-pool-config.schema';

@Injectable()
export class FundPoolConfigRepositoryImpl implements IFundPoolConfigRepository {
  constructor(
    @InjectModel(FundPoolConfig.name)
    private readonly model: Model<FundPoolConfigDocument>,
  ) {}

  async findEnabledByGameId(gameId: string): Promise<FundPoolConfigEntity[]> {
    const docs = await this.model.find({ gameIds: gameId, status: 1 }).lean().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: any): FundPoolConfigEntity {
    return new FundPoolConfigEntity({
      id: doc._id.toString(),
      poolId: doc.poolId,
      poolName: doc.poolName,
      poolCategory: doc.poolCategory ?? '',
      platformId: doc.platformId ?? '',
      providerId: doc.providerId ?? '',
      gameIds: doc.gameIds ?? [],
      status: doc.status,
      betAmountMin: doc.betAmountMin ?? 0,
      betAmountMax: doc.betAmountMax ?? 0,
      rakeRate: doc.rakeRate ?? 0,
      singlePayoutLimit: doc.singlePayoutLimit ?? 0,
      allowedTags: doc.allowedTags ?? [],
      levelConfig: (doc.levelConfig ?? []).map((l: any) => ({
        levelNo: l.levelNo,
        minBalance: l.minBalance ?? null,
        maxBalance: l.maxBalance ?? null,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
