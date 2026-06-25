import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { IUser, User, UserEmail, UserId, UserUpdatedAt } from '../../applications/domains/user.domain';
import { UserRepository } from '../../applications/ports/user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(private readonly userModel: TransactionHost<TransactionalAdapterTypeOrm>) {}

  async create(user: IUser): Promise<IUser> {
    const uuid = uuidv4() as UserId;
    const userEntity = Builder(UserEntity).uuid(uuid).email(user.email).password(user.password).build();

    const resultCreated = await this.userModel.tx.getRepository(UserEntity).save(userEntity);
    return UserTypeOrmRepository.toDomain(resultCreated);
  }

  async getByEmail(email: UserEmail): Promise<IUser | undefined> {
    const user = await this.userModel.tx.getRepository(UserEntity).findOne({
      where: { email: email },
    });
    return user ? UserTypeOrmRepository.toDomain(user) : undefined;
  }

  static toDomain(user: UserEntity): IUser {
    return Builder(User)
      .uuid(user.uuid as UserId)
      .email(user.email)
      .password(user.password)
      .createdAt(user.createdAt)
      .updateAt(user.updatedAt as UserUpdatedAt)
      .build();
  }
}
