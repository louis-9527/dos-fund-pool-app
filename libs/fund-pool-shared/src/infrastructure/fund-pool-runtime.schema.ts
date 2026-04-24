import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FundPoolRuntimeDocument = HydratedDocument<FundPoolRuntime>;

@Schema({ timestamps: true, collection: 'fundPoolRuntime' })
export class FundPoolRuntime {
  @Prop({ required: true, unique: true, index: true })
  poolId: string;

  @Prop({ type: Number, default: 0 })
  currentBalance: number;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  totalInflowAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  totalOutflowAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  totalManualAdjustAmount: MongooseSchema.Types.Decimal128;

  @Prop()
  lastChangeAt: Date;
}

export const FundPoolRuntimeSchema = SchemaFactory.createForClass(FundPoolRuntime);
