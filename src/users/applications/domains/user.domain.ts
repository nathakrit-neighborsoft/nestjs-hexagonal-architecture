import * as argon2 from 'argon2';
import { StrictBuilder } from 'builder-pattern';
import { argon2Config } from 'src/configs/auth.config';
import { Brand, CreatedAt, UpdatedAt } from 'src/types/utility.type';

export type UserCreatedAt = Brand<CreatedAt, 'UserCreatedAt'>;
export type UserEmail = Brand<string, 'UserEmail'>;
export type UserId = Brand<string, 'UserId'>;
export type UserPassword = Brand<string, 'UserPassword'>;
export type UserUpdatedAt = Brand<UpdatedAt, 'UserUpdatedAt'>;

export interface IUser {
  uuid: UserId;
  password: UserPassword;
  email: UserEmail;
  createdAt?: UserCreatedAt;
  updateAt?: UserUpdatedAt;

  comparePassword(password: UserPassword): Promise<boolean>;
  hiddenPassword(): void;
  setHashPassword(password: UserPassword): Promise<void>;
}

export class User implements IUser {
  uuid: UserId;
  password: UserPassword;
  email: UserEmail;
  createdAt?: UserCreatedAt;
  updateAt?: UserUpdatedAt;

  public async comparePassword(password: UserPassword): Promise<boolean> {
    return argon2.verify(this.password, password);
  }

  public hiddenPassword() {
    this.password = '' as UserPassword;
  }

  public async setHashPassword(password: UserPassword): Promise<void> {
    const argon2Options = StrictBuilder<argon2.Options>()
      .type(argon2.argon2id)
      .memoryCost(argon2Config.memoryCost)
      .timeCost(argon2Config.timeCost)
      .parallelism(argon2Config.parallelism)
      .salt(argon2Config.saltBuffer)
      .build();

    this.password = (await argon2.hash(password, argon2Options)) as UserPassword;
  }
}
