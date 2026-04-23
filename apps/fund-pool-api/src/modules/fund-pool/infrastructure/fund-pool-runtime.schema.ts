import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FundPoolRuntimeDocument = HydratedDocument<FundPoolRuntime>;

@Schema({ timestamps: true, collection: 'fundPoolRuntime' })
export class FundPoolRuntime {
  @Prop({ required: true, unique: true, index: true })
  poolId: string;

  @Prop({ type: Number, default: 0 })
  currentBalance: number;

  @Prop({ type: Number, default: 0 })
  totalInflowAmount: number;

  @Prop({ type: Number, default: 0 })
  totalOutflowAmount: number;

  @Prop({ type: Number, default: 0 })
  totalManualAdjustAmount: number;

  @Prop()
  lastChangeAt: Date;
}

export const FundPoolRuntimeSchema = SchemaFactory.createForClass(FundPoolRuntime);
