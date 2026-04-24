import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '8050', 10),
  mongoUri: process.env.MONGODB_URI ?? '',
}));
