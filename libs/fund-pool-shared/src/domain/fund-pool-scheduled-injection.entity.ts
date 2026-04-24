export interface FundPoolScheduledInjectionProps {
  id: string;
  poolId: string;
  injectionCount: number;
  singleInjectionAmount: number;
  intervalSeconds: number;
  firstInjectionAt: Date;
  executedCount: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * status: 0=pending, 1=running, 2=completed, 3=cancelled
 */
export class FundPoolScheduledInjectionEntity {
  readonly id: string;
  readonly poolId: string;
  readonly injectionCount: number;
  readonly singleInjectionAmount: number;
  readonly intervalSeconds: number;
  readonly firstInjectionAt: Date;
  readonly executedCount: number;
  readonly status: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FundPoolScheduledInjectionProps) {
    Object.assign(this, props);
  }
}
