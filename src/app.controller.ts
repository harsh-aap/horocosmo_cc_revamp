import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App', 'Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application info',
    description: 'Returns basic application information and status',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is running',
    schema: {
      example: {
        message: 'Horocosmo V2 Consultation Backend',
        version: '2.0.0',
        timestamp: '2024-01-20T10:30:00.000Z',
      },
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Basic application health check endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2024-01-20T10:30:00.000Z',
        uptime: '00:05:23',
      },
    },
  })
  async getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime().toString(),
    };
  }
}