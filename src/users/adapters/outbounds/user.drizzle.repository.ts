import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from 'src/databases/schemas';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import { Builder } from 'builder-pattern';
import {
  IUser,
  User,
  UserCreatedAt,
  UserEmail,
  UserId,
  UserPassword,
  UserUpdatedAt,
} from '../../applications/domains/user.domain';
import { UserRepository } from '../../applications/ports/user.repository';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Injectable()
export class UserDrizzleRepository implements UserRepository {
  constructor(private readonly model: TransactionHost<TransactionalAdapterDrizzleOrm<DrizzleDB>>) {}

  async create(user: IUser): Promise<IUser> {
    const uuid = uuidv4() as UserId;
    const [result] = await this.model.tx
      .insert(users)
      .values({
        uuid,
        email: user.email,
        password: user.password,
      })
      .returning();
    return UserDrizzleRepository.toDomain(result);
  }

  async getByEmail(email: UserEmail): Promise<IUser | undefined> {
    const [result] = await this.model.tx
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result ? UserDrizzleRepository.toDomain(result) : undefined;
  }

  static toDomain(row: typeof users.$inferSelect): IUser {
    return Builder(User)
      .uuid(row.uuid as UserId)
      .email(row.email as UserEmail)
      .password(row.password as UserPassword)
      .createdAt(row.createdAt as UserCreatedAt)
      .updateAt(row.updatedAt as UserUpdatedAt)
      .build();
  }
}
