import { ValidationPipe, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { flow } from 'fp-ts/function';

import { AppModule } from './app.module';
import { ConfigService } from './config';

const setupValidation = (app: INestApplication): INestApplication => {
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: config.get('devMode', { infer: true }),
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
};

const setupSwagger = (app: INestApplication): INestApplication => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Exchange API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  return app;
};

export const setupApp = flow(setupValidation, setupSwagger);
