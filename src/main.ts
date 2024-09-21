import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './error';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BadRequestException } from './error/bad-request-error';
import { Logger } from 'nestjs-pino';
import { loggerMiddleware } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically transforms payloads to the appropriate DTO class
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const firstError = Object.values(validationErrors[0].constraints)[0];
        return new BadRequestException(firstError);
      },
    }),
  );
  const configService = app.get<ConfigService>(ConfigService);
  const options = new DocumentBuilder()
    .setTitle('Media API')
    .setDescription('The Media API description')
    .setVersion('1.0')
    .addServer(
      configService.get('SWAGGER_SERVER_URL'),
      configService.get('SWAGGER_SERVER_ENVIRONMENT'),
    )

    .addBearerAuth()
    .build();
  app.use(loggerMiddleware);
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app
    .listen(3002)
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
}
bootstrap();
