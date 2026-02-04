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
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable shutdown hooks for graceful shutdown
  app.enableShutdownHooks();

  // Security headers with WebSocket support
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket connections
        },
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  // Get monitoring service instance
  const monitoringService = app.get(MonitoringService);

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(monitoringService));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration (HTTP requests)
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  });

  // Enhanced Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Horocosmo Consultation API')
    .setDescription('Real-time chat and consultation API with WebSocket support')
    .setVersion('1.0')
    .addServer('http://localhost:8000/api/v2', 'Development')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token for authentication',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
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

  // Global API prefix
  app.setGlobalPrefix('api/v2');

  // Graceful shutdown handling
  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
      console.log(`⚠️  Shutdown already in progress, ignoring ${signal}`);
      return;
    }

    isShuttingDown = true;
    console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);

    try {
      // Set shutdown timeout (30 seconds)
      const shutdownTimeout = setTimeout(() => {
        console.error('❌ Graceful shutdown timeout exceeded. Force exiting...');
        process.exit(1);
      }, 30000);

      // Close NestJS application
      await app.close();
      
      clearTimeout(shutdownTimeout);
      console.log('✅ Graceful shutdown completed successfully');
      process.exit(0);
      
    } catch (error) {
      // Handle known non-critical shutdown errors
      const errorMessage = error?.message || '';
      const knownErrors = [
        'Called end on pool more than once',  // Database pool already closed by NestJS
        'Connection is closed',               // Redis connection already closed
      ];
      
      const isKnownError = knownErrors.some(knownError => 
        errorMessage.includes(knownError)
      );
      
      if (isKnownError) {
        console.log(`ℹ️  Known shutdown warning (non-critical): ${errorMessage}`);
        console.log('✅ Graceful shutdown completed with minor warnings');
        process.exit(0);
      } else {
        // This is a real error
        console.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
      }
    }
  };

  // Register signal handlers
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // Handle uncaught exceptions during shutdown
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception during shutdown:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection during shutdown:', reason);
    process.exit(1);
  });

  // Server configuration
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Startup logging
  console.log(`🚀 Horocosmo V2 Backend running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`💚 Health Check: http://localhost:${port}/api/v2/health`);
  console.log(`💬 WebSocket Chat: ws://localhost:${port}/chat`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});