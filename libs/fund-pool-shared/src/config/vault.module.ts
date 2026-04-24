import { Global, Module } from '@nestjs/common';
import { VaultFetcher } from './vault-fetcher';

@Global()
@Module({
  providers: [VaultFetcher],
  exports: [VaultFetcher],
})
export class VaultModule {}
