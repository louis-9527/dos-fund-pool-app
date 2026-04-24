import { FundPoolScheduledInjectionEntity } from './fund-pool-scheduled-injection.entity';

export interface CreateScheduledInjectionInput {
  poolId: string;
  injectionCount: number;
  singleInjectionAmount: number;
  intervalSeconds: number;
  firstInjectionAt: Date;
}

export interface IFundPoolScheduledInjectionRepository {
  create(input: CreateScheduledInjectionInput): Promise<FundPoolScheduledInjectionEntity>;
}
