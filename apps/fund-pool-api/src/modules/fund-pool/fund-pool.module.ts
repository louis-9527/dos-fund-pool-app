import { Module } from '@nestjs/common';
import { FundPoolSharedModule } from '@app/fund-pool-shared';

// Interface
import { FundPoolController } from './interface/fund-pool.controller';

// Application
import { FundPoolAppService } from './application/fund-pool.app-service';

// Domain
import { FundPoolDomainService } from './domain/fund-pool.domain-service';

@Module({
  imports: [FundPoolSharedModule],
  controllers: [FundPoolController],
  providers: [FundPoolAppService, FundPoolDomainService],
})
export class FundPoolModule {}
