import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FundPoolModule } from './modules/fund-pool/fund-pool.module';
import { VaultFetcher, VaultModule } from '@app/fund-pool-shared';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    VaultModule,
    MongooseModule.forRootAsync({
      imports: [VaultModule],
      inject: [VaultFetcher],
      useFactory: async (vaultFetcher: VaultFetcher) => ({
        uri: await vaultFetcher.getSecret('commonConfig', 'MONGODB_URI'),
      }),
    }),
    FundPoolModule,
  ],
})
export class AppModule {}
