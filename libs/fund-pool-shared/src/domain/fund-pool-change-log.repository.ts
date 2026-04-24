import { ChangeType, OperatorType } from './fund-pool-change-log.entity';

export interface CreateChangeLogInput {
  eventId: string;
  poolId: string;
  changeType: ChangeType;
  changeReason: string;
  deltaAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  operatorType: OperatorType;
  operatorId: string;
  remark: string;
  occurredAt: Date;
}

export interface IFundPoolChangeLogRepository {
  create(input: CreateChangeLogInput): Promise<void>;
}
