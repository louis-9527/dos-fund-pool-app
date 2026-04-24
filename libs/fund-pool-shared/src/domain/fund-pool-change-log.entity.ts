export type ChangeType = 'inflow' | 'outflow' | 'manualAdd' | 'manualReduce';
export type OperatorType = 'system' | 'admin' | 'job';

export interface FundPoolChangeLogProps {
  id: string;
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
  createdAt: Date;
}

export class FundPoolChangeLogEntity {
  readonly id: string;
  readonly eventId: string;
  readonly poolId: string;
  readonly changeType: ChangeType;
  readonly changeReason: string;
  readonly deltaAmount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly referenceType: string;
  readonly referenceId: string;
  readonly operatorType: OperatorType;
  readonly operatorId: string;
  readonly remark: string;
  readonly occurredAt: Date;
  readonly createdAt: Date;

  constructor(props: FundPoolChangeLogProps) {
    Object.assign(this, props);
  }
}
