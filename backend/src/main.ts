import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  // Enable CORS
  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim());

  app.enableCors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true,
  });

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TOEIC Master API')
    .setDescription('API documentation for TOEIC Master learning platform')
    .setVersion('1.0')
    .addTag('books', 'Book management endpoints')
    .addTag('admin', 'Admin endpoints for uploading content')
    .addTag('audio', 'Audio file endpoints')
    .addApiKey(
      { type: 'apiKey', name: 'x-admin-key', in: 'header' },
      'admin-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Ebook Master Backend running on http://localhost:${port}`);
  console.log(
    `📚 Swagger documentation available at http://localhost:${port}/api`,
  );
}
void bootstrap();
