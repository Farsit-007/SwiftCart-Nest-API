/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.ts/response.interceptor.ts.interceptor';

// ✅ Main entry point for the NestJS application
async function bootstrap() {
  // 1. Create an instance of the NestJS app using the root module (AppModule)
  const app = await NestFactory.create(AppModule);

  // 2. Apply global validation pipe for request data validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove any extra fields not in the DTO
      forbidNonWhitelisted: true, // Throw error if extra/unknown fields are sent
      transform: true, // Automatically transform request payloads to DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion (string -> number, etc.)
      },
    }),
  );

  // 3. Swagger (API documentation) configuration
  const config = new DocumentBuilder()
    .setTitle('SwiftCart APIs') // API Title
    .setDescription('Use the base API URL http://localhost:5000') // API Description
    .addServer('http://localhost:5000') // Base server URL
    .setVersion('1.0') // API Version
    .build();

  // 4. Generate Swagger docs from the app’s routes & decorators
  const document = SwaggerModule.createDocument(app, config);

  // 5. Setup Swagger UI at `/api` route → http://localhost:5000/api
  SwaggerModule.setup('api', app, document);

  // 6. Enable Cross-Origin Resource Sharing (CORS)
  //    This allows frontend apps to call the API.
  app.enableCors();

  // Apply the filter globally
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 7. Start listening on a port (default: 5000 or from environment variable)
  await app.listen(process.env.PORT ?? 5000);
}

// 8. Call the bootstrap function to actually start the application
bootstrap();
