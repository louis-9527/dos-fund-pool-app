import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FundPoolScheduledInjectionDocument = HydratedDocument<FundPoolScheduledInjection>;

@Schema({ timestamps: true, collection: 'fundPoolScheduledInjection' })
export class FundPoolScheduledInjection {
  @Prop({ required: true, index: true })
  poolId: string;

  @Prop({ required: true })
  injectionCount: number;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  singleInjectionAmount: MongooseSchema.Types.Decimal128;

  @Prop({ required: true })
  intervalSeconds: number;

  @Prop({ required: true })
  firstInjectionAt: Date;

  @Prop({ default: 0 })
  executedCount: number;

  @Prop({ default: 0 })
  status: number;
}

export const FundPoolScheduledInjectionSchema = SchemaFactory.createForClass(FundPoolScheduledInjection);
