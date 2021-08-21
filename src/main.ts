import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const port: number = config.get('port');
  const host: string = config.get('host');
  const app = await NestFactory.create(AppModule);
  await app.listen(port, host);
}
bootstrap();
