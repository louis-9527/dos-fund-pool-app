export interface LevelConfig {
  levelNo: number;
  minBalance: number | null;
  maxBalance: number | null;
}

export interface FundPoolConfigProps {
  id: string;
  poolId: string;
  poolName: string;
  poolCategory: string;
  platformId: string;
  providerId: string;
  gameIds: string[];
  status: number;
  betAmountMin: number;
  betAmountMax: number;
  rakeRate: number;
  singlePayoutLimit: number;
  allowedTags: string[];
  levelConfig: LevelConfig[];
  createdAt: Date;
  updatedAt: Date;
}

export class FundPoolConfigEntity {
  readonly id: string;
  readonly poolId: string;
  readonly poolName: string;
  readonly poolCategory: string;
  readonly platformId: string;
  readonly providerId: string;
  readonly gameIds: string[];
  readonly status: number;
  readonly betAmountMin: number;
  readonly betAmountMax: number;
  readonly rakeRate: number;
  readonly singlePayoutLimit: number;
  readonly allowedTags: string[];
  readonly levelConfig: LevelConfig[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FundPoolConfigProps) {
    Object.assign(this, props);
  }

  isEnabled(): boolean {
    return this.status === 1;
  }
}
