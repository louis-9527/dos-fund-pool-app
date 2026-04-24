import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type FundPoolChangeLogDocument = HydratedDocument<FundPoolChangeLog>;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'fundPoolChangeLog' })
export class FundPoolChangeLog {
  @Prop({ required: true, unique: true, index: true })
  eventId: string;

  @Prop({ required: true, index: true })
  poolId: string;

  @Prop({ required: true })
  changeType: string;

  @Prop({ default: '' })
  changeReason: string;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  deltaAmount: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  balanceBefore: MongooseSchema.Types.Decimal128;

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  balanceAfter: MongooseSchema.Types.Decimal128;

  @Prop({ default: '' })
  referenceType: string;

  @Prop({ default: '' })
  referenceId: string;

  @Prop({ required: true })
  operatorType: string;

  @Prop({ default: '' })
  operatorId: string;

  @Prop({ default: '' })
  remark: string;

  @Prop({ required: true })
  occurredAt: Date;
}

export const FundPoolChangeLogSchema = SchemaFactory.createForClass(FundPoolChangeLog);
