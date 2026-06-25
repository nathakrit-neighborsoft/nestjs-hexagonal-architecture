import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { port } from './configs/app.config';
import { swaggerConfig } from './configs/swagger.config';

const corsOrigins = ['*'];

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  // await otlpSdk.start();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  setupSwagger(app);
  setupPipes(app);
  setupCors(app);
  // app.use(cookieParser());
  console.log('bootstrap DEFAULT_PASSWORD', process.env.DEFAULT_PASSWORD);

  const logger = setupLogger(app);
  await app.listen(port, () => {
    logger.log(`Server is running on port ${port}`);
    // logger.error({ message: 'test', data: { name: 'John', age: 30 } });
  });
}

void bootstrap();

function setupLogger(app: INestApplication): Logger {
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();
  return logger;
}

function setupSwagger(app: INestApplication) {
  SwaggerModule.setup('api', app, () => SwaggerModule.createDocument(app, swaggerConfig));
}

function setupPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

function setupCors(app: INestApplication) {
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
}
