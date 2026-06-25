import type { IUser, UserEmail } from '../domains/user.domain';

const userRepositoryTokenSymbol: unique symbol = Symbol('UserRepository');
export const userRepositoryToken = userRepositoryTokenSymbol.toString();

export interface UserRepository {
  create(user: IUser): Promise<IUser>;
  getByEmail(email: UserEmail): Promise<IUser | undefined>;
}
