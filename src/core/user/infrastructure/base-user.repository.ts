import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User, UserType, UserStatus } from "src/infrastructure/database/entities/user.entity";

/**
 * BaseUserRepository
 *
 * Provides common read-only user queries that can be reused
 * by other repositories through inheritance.
 *
 * This class centralizes frequently used database operations
 * related to User entities.
 */
@Injectable()
export class BaseUserRepository {
  // Logger used for debugging repository operations
  protected readonly logger = new Logger(BaseUserRepository.name);

  constructor(
    // Inject the TypeORM repository for the User entity
    @InjectRepository(User)
    protected readonly repo: Repository<User>,
  ) {}

  /**
   * Find a single user by their unique ID.
   *
   * @param id - User ID
   * @returns The User entity if found, otherwise null
   */
  async findById(id: string): Promise<User | null> {
    this.logger.debug(`Finding user by ID: ${id}`);
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find multiple users by a list of user IDs.
   *
   * @param ids - Array of user IDs
   * @returns Array of User entities
   */
  async findByIds(ids: string[]): Promise<User[]> {
    return this.repo.find({ where: { id: In(ids) } });
  }

  /**
   * Find a user by their email address.
   *
   * @param email - User email
   * @returns The User entity if found, otherwise null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  /**
   * Retrieve all active users (non-astrologers).
   *
   * @returns Array of active User entities
   */
  async findActiveUsers(): Promise<User[]> {
    return this.repo.find({
      where: {
        type: UserType.USER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Retrieve all active astrologers.
   *
   * @returns Array of active astrologer User entities
   */
  async findActiveAstrologers(): Promise<User[]> {
    return this.repo.find({
      where: {
        type: UserType.ASTROLOGER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Count the total number of active users.
   *
   * @returns Number of active users
   */
  async countUsers(): Promise<number> {
    return this.repo.count({
      where: {
        type: UserType.USER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Count the total number of active astrologers.
   *
   * @returns Number of active astrologers
   */
  async countAstrologers(): Promise<number> {
    return this.repo.count({
      where: {
        type: UserType.ASTROLOGER,
        status: UserStatus.ACTIVE,
      },
    });
  }

  /**
   * Persist a User entity to the database.
   *
   * This method handles both:
   * - Creating a new user (insert)
   * - Updating an existing user (update)
   *
   * @param user - User entity to be saved
   * @returns The saved User entity
   */
  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }
}

