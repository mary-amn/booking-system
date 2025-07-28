import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/infrastructure/filters/http-exception.filter';

// Fix for TypeORM generateString issue using Node.js built-in crypto
const generateString = (length: number = 8): string => {
  // Using Node.js built-in crypto (no installation needed)
  const crypto = require('node:crypto');
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Patch the missing function before TypeORM is used
try {
  const typeormUtils = require('@nestjs/typeorm/dist/common/typeorm.utils');
  if (!typeormUtils.generateString) {
    typeormUtils.generateString = generateString;
    (typeormUtils as any).exports = { ...typeormUtils.exports, generateString };
  }
} catch (error) {
  console.warn('Could not patch TypeORM utils:', error.message);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription(
      'Create, confirm, cancel bookings; manage resources & users',
    )
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
