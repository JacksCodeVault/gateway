import 'dotenv/config';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeFirebase } from './config/firebase.config';

async function bootstrap() {
  initializeFirebase();
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('SMS Gateway API')
    .setDescription('SMS Gateway with Firebase Integration')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    })
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors();
  await app.listen(PORT);
}
bootstrap();