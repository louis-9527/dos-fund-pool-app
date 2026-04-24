import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FundPoolConfig, FundPoolConfigSchema } from './infrastructure/fund-pool-config.schema';
import { FundPoolRuntime, FundPoolRuntimeSchema } from './infrastructure/fund-pool-runtime.schema';
import { FundPoolChangeLog, FundPoolChangeLogSchema } from './infrastructure/fund-pool-change-log.schema';
import { FundPoolScheduledInjection, FundPoolScheduledInjectionSchema } from './infrastructure/fund-pool-scheduled-injection.schema';
import { FundPoolConfigRepositoryImpl } from './infrastructure/fund-pool-config.repository.impl';
import { FundPoolRuntimeRepositoryImpl } from './infrastructure/fund-pool-runtime.repository.impl';
import { FundPoolChangeLogRepositoryImpl } from './infrastructure/fund-pool-change-log.repository.impl';
import { FundPoolScheduledInjectionRepositoryImpl } from './infrastructure/fund-pool-scheduled-injection.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FundPoolConfig.name, schema: FundPoolConfigSchema },
      { name: FundPoolRuntime.name, schema: FundPoolRuntimeSchema },
      { name: FundPoolChangeLog.name, schema: FundPoolChangeLogSchema },
      { name: FundPoolScheduledInjection.name, schema: FundPoolScheduledInjectionSchema },
    ]),
  ],
  providers: [
    { provide: 'IFundPoolConfigRepository', useClass: FundPoolConfigRepositoryImpl },
    { provide: 'IFundPoolRuntimeRepository', useClass: FundPoolRuntimeRepositoryImpl },
    { provide: 'IFundPoolChangeLogRepository', useClass: FundPoolChangeLogRepositoryImpl },
    { provide: 'IFundPoolScheduledInjectionRepository', useClass: FundPoolScheduledInjectionRepositoryImpl },
  ],
  exports: [
    'IFundPoolConfigRepository',
    'IFundPoolRuntimeRepository',
    'IFundPoolChangeLogRepository',
    'IFundPoolScheduledInjectionRepository',
  ],
})
export class FundPoolSharedModule {}
