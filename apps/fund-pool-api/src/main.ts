import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/business-exception.filter';
import { loadVaultSecrets } from '@app/fund-pool-shared';

async function bootstrap() {
  await loadVaultSecrets();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = parseInt(process.env.PORT ?? '8050', 10);
  await app.listen(port);
  console.log(`fund-pool-api is running on port ${port}`);
}

bootstrap();
