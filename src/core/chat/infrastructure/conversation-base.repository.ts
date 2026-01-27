import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationStatus } from 'src/infrastructure/database/entities/conversation.entity';

@Injectable()
export class ConversationBaseRepository {
  protected readonly logger = new Logger(ConversationBaseRepository.name);

  constructor(
    @InjectRepository(Conversation)
    protected readonly repo: Repository<Conversation>,
  ) {}

  async findById(id: string): Promise<Conversation | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByUserAndAstrologer(userId: string, astrologerId: string): Promise<Conversation | null> {
    return this.repo.findOne({
      where: {
        user_id: userId,
        astrologer_id: astrologerId,
      },
    });
  }

  async findUserConversations(userId: string, limit: number = 50): Promise<Conversation[]> {
    return this.repo.find({
      where: [
        { user_id: userId },
        { astrologer_id: userId },
      ],
      order: { last_message_at: 'DESC' },
      take: limit,
    });
  }

  async findAstrologerConversations(astrologerId: string, limit: number = 50): Promise<Conversation[]> {
    return this.repo.find({
      where: { astrologer_id: astrologerId },
      order: { last_message_at: 'DESC' },
      take: limit,
    });
  }

  async findActiveConversations(limit: number = 100): Promise<Conversation[]> {
    return this.repo.find({
      where: { status: ConversationStatus.ACTIVE },
      order: { last_message_at: 'DESC' },
      take: limit,
    });
  }

  async getConversationCount(userId: string): Promise<number> {
    return this.repo.count({
      where: [
        { user_id: userId },
        { astrologer_id: userId },
      ],
    });
  }

  async save(conversation: Conversation): Promise<Conversation> {
    return this.repo.save(conversation);
  }

  async create(conversationData: Partial<Conversation>): Promise<Conversation> {
    const conversation = this.repo.create(conversationData);
    return this.repo.save(conversation);
  }
}