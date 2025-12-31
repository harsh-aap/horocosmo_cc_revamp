import { ApiProperty } from '@nestjs/swagger';

// User examples
export class UserResponseExample {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'client', enum: ['client', 'consultant', 'admin'] })
  role: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @ApiProperty({
    example: {
      totalConsultations: 15,
      avgRating: 4.8,
      preferredAstrologers: ['astro-456', 'astro-789'],
      languages: ['English', 'Hindi'],
    },
  })
  profile?: Record<string, any>;

  @ApiProperty({ example: '2024-01-20T10:30:00.000Z' })
  createdAt: Date;
}

// Session examples
export class SessionResponseExample {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  astrologerId: string;

  @ApiProperty({ example: 'room_abc123' })
  roomId: string;

  @ApiProperty({
    example: 'scheduled',
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
  })
  status: string;

  @ApiProperty({ example: 'chat', enum: ['chat', 'video', 'both'] })
  type: string;

  @ApiProperty({ example: '2024-01-20T15:00:00.000Z' })
  scheduledAt: Date;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  duration?: number;

  @ApiProperty({ example: 150.0, description: 'Cost in USD' })
  cost?: number;
}

// Health check examples
export class HealthResponseExample {
  @ApiProperty({ example: 'healthy', enum: ['healthy', 'unhealthy'] })
  status: string;

  @ApiProperty({ example: '2024-01-20T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({
    example: {
      database: { status: 'healthy', responseTime: 5.23 },
      cache: { status: 'healthy', responseTime: 0.85 },
    },
  })
  services: Record<string, any>;
}
