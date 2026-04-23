import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Interface
import { FundPoolController } from './interface/fund-pool.controller';

// Application
import { FundPoolAppService } from './application/fund-pool.app-service';

// Domain
import { FundPoolDomainService } from './domain/fund-pool.domain-service';

// Infrastructure
import { FundPoolConfigRepositoryImpl } from './infrastructure/fund-pool-config.repository.impl';
import { FundPoolRuntimeRepositoryImpl } from './infrastructure/fund-pool-runtime.repository.impl';
import { FundPoolConfig, FundPoolConfigSchema } from './infrastructure/fund-pool-config.schema';
import { FundPoolRuntime, FundPoolRuntimeSchema } from './infrastructure/fund-pool-runtime.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FundPoolConfig.name, schema: FundPoolConfigSchema },
      { name: FundPoolRuntime.name, schema: FundPoolRuntimeSchema },
    ]),
  ],
  controllers: [FundPoolController],
  providers: [
    FundPoolAppService,
    FundPoolDomainService,
    { provide: 'IFundPoolConfigRepository', useClass: FundPoolConfigRepositoryImpl },
    { provide: 'IFundPoolRuntimeRepository', useClass: FundPoolRuntimeRepositoryImpl },
  ],
})
export class FundPoolModule {}
