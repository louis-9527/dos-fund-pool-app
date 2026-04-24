import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FundPoolConfig, FundPoolConfigSchema } from './infrastructure/fund-pool-config.schema';
import { FundPoolRuntime, FundPoolRuntimeSchema } from './infrastructure/fund-pool-runtime.schema';
import { FundPoolConfigRepositoryImpl } from './infrastructure/fund-pool-config.repository.impl';
import { FundPoolRuntimeRepositoryImpl } from './infrastructure/fund-pool-runtime.repository.impl';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FundPoolConfig.name, schema: FundPoolConfigSchema },
      { name: FundPoolRuntime.name, schema: FundPoolRuntimeSchema },
    ]),
  ],
  providers: [
    { provide: 'IFundPoolConfigRepository', useClass: FundPoolConfigRepositoryImpl },
    { provide: 'IFundPoolRuntimeRepository', useClass: FundPoolRuntimeRepositoryImpl },
  ],
  exports: [
    'IFundPoolConfigRepository',
    'IFundPoolRuntimeRepository',
  ],
})
export class FundPoolSharedModule {}
