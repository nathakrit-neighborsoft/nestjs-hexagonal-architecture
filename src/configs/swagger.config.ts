import { DocumentBuilder } from '@nestjs/swagger';
import { accessKeyToken } from './jwt.config';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Expense API')
  .setDescription('The Expense API description')
  .setVersion('1.0')
  .addTag('Expense')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token',
    },
    accessKeyToken,
  )
  .build();
