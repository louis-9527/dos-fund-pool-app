import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.FUND_POOL_API_PORT ?? '3001', 10),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/dosFundPoolDB',
}));
