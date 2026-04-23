export interface FundPoolRuntimeProps {
  id: string;
  poolId: string;
  currentBalance: number;
  totalInflowAmount: number;
  totalOutflowAmount: number;
  totalManualAdjustAmount: number;
  lastChangeAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class FundPoolRuntimeEntity {
  readonly id: string;
  readonly poolId: string;
  readonly currentBalance: number;
  readonly totalInflowAmount: number;
  readonly totalOutflowAmount: number;
  readonly totalManualAdjustAmount: number;
  readonly lastChangeAt: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FundPoolRuntimeProps) {
    Object.assign(this, props);
  }
}
