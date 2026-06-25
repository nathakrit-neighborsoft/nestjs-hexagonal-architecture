import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { accessKeyToken } from 'src/configs/jwt.config';
import type { IUser } from '../../users/applications/domains/user.domain';
import type { UserRepository } from '../../users/applications/ports/user.repository';
import { userRepositoryToken } from '../../users/applications/ports/user.repository';

export type LoginCommand = Pick<IUser, 'email' | 'password'>;

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(userRepositoryToken)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: LoginCommand): Promise<{ [accessKeyToken]: string }> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const token = this.jwtService.sign({
      sub: user.uuid,
      email: user.email,
    });

    return {
      [accessKeyToken]: token,
    };
  }
}
