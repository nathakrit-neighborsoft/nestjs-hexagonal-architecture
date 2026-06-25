import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Builder } from 'builder-pattern';
import { accessKeyToken } from 'src/configs/jwt.config';
import { User, UserEmail, UserPassword } from '../../users/applications/domains/user.domain';
import type { UserRepository } from '../../users/applications/ports/user.repository';
import { userRepositoryToken } from '../../users/applications/ports/user.repository';

export interface RegisterCommand {
  email: UserEmail;
  password: UserPassword;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(userRepositoryToken)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ email, password }: RegisterCommand): Promise<{ [accessKeyToken]: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.getByEmail(email);
    if (existingUser) throw new ConflictException('Email already exists');

    // Create new user domain object
    const user = Builder(User).email(email).password(password).build();

    // Hash the password
    await user.setHashPassword(password);

    // Save the user
    const createdUser = await this.userRepository.create(user);

    // Generate JWT token
    const accessToken = this.jwtService.sign({
      sub: createdUser.uuid,
      email: createdUser.email,
    });

    return { [accessKeyToken]: accessToken };
  }
}
