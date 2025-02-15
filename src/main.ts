import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.use('/uploads', express.static(process.cwd() + '/uploads'));

  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog documantation')
    .setDescription('Blogs API description. You can test them out in-site!')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Sello')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = +process.env.PORT;

  await app.listen(PORT);
}
bootstrap();
