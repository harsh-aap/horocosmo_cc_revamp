import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { MonitoringService } from './infrastructure/monitoring/monitoring.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // security
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  //Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  const monitoringService = app.get(MonitoringService);

  // Global Interceptors for logging
  app.useGlobalInterceptors(new LoggingInterceptor(monitoringService));

  // Global Interceptors for consistent responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global filters for consistent errors
  app.useGlobalFilters(new HttpExceptionFilter());

  //CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  });

  //Enhanced Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Horocosmo Consultation API')
    .setDescription('API documentation for Horocosmo Consultation')
    .setVersion('1.0')
    .addServer('http://localhost:8000/api/v2', 'Development')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
      showCommonExtensions: true,
      showRequestHeaders: true,
      showResponseHeaders: true,
    },
    customCss: `.swagger-ui .topbar { display: none; }`,
    customSiteTitle: 'Horocosmo Consultation API',
  });

  app.setGlobalPrefix('api/v2');
  const port = process.env.PORT ?? 3000;
  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Horocosmo V2 Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`💚 Health Check: http://localhost:${port}/api/v2/health`);
}
bootstrap();
