import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from './config';
import { setupApp } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  const logger = new Logger('Bootstrap');

  const config = app.get(ConfigService);
  const port = config.get('port', { infer: true });
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}

bootstrap();
