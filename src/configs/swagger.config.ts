import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Expense API')
  .setDescription('The Expense API description')
  .setVersion('1.0')
  .addTag('Expense')
  .build();
