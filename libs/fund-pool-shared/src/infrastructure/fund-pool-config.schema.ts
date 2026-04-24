import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FundPoolConfigDocument = HydratedDocument<FundPoolConfig>;

class LevelConfigSchema {
  @Prop({ required: true })
  levelNo: number;

  @Prop({ type: Number, default: null })
  minBalance: number | null;

  @Prop({ type: Number, default: null })
  maxBalance: number | null;
}

@Schema({ timestamps: true, collection: 'fundPoolConfig' })
export class FundPoolConfig {
  @Prop({ required: true, unique: true, index: true })
  poolId: string;

  @Prop({ required: true })
  poolName: string;

  @Prop()
  poolCategory: string;

  @Prop()
  platformId: string;

  @Prop()
  providerId: string;

  @Prop({ type: [String], default: [] })
  gameIds: string[];

  @Prop({ required: true, default: 1 })
  status: number;

  @Prop()
  remark: string;

  @Prop({ type: Number, default: 0 })
  betAmountMin: number;

  @Prop({ type: Number, default: 0 })
  betAmountMax: number;

  @Prop({ type: Number, default: 0 })
  rakeRate: number;

  @Prop({ type: Number, default: 0 })
  singlePayoutLimit: number;

  @Prop({ type: [String], default: [] })
  allowedTags: string[];

  @Prop({ type: [Object], default: [] })
  levelConfig: LevelConfigSchema[];

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const FundPoolConfigSchema = SchemaFactory.createForClass(FundPoolConfig);
FundPoolConfigSchema.index({ gameIds: 1, status: 1 });
