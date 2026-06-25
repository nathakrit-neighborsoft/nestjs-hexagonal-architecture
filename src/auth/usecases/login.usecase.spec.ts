import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { mock } from 'vitest-mock-extended';

import { StrictBuilder } from 'builder-pattern';
import type { IUser, UserEmail, UserId, UserPassword } from '../../users/applications/domains/user.domain';
import { UserRepository } from '../../users/applications/ports/user.repository';
import { LoginCommand, LoginUseCase } from './login.usecase';

describe('Login Use Case', () => {
  let useCase: LoginUseCase;
  const jwtService = mock<JwtService>();
  const userRepository = mock<UserRepository>();

  beforeEach(() => {
    useCase = new LoginUseCase(userRepository, jwtService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const email = faker.internet.email() as UserEmail;
  const password = faker.internet.password() as UserPassword;
  const userId = faker.database.mongodbObjectId() as UserId;

  const user = mock<IUser>({
    uuid: userId,
    email,
  });

  it('should be return jwt sign when user is exist and password correct.', async () => {
    // Arrange
    const command = StrictBuilder<LoginCommand>().email(email).password(password).build();

    jwtService.sign.mockResolvedValue(faker.string.alphanumeric());
    user.comparePassword.mockResolvedValue(true);
    userRepository.getByEmail.mockResolvedValue(user);

    // Act
    const actual = await useCase.execute(command);

    // Assert
    expect(actual).not.toBeNull();
    expect(user.comparePassword).toHaveBeenCalledWith(password);
  });

  it('should be throw error when user not found.', async () => {
    // Arrange
    const command = StrictBuilder<LoginCommand>().email(email).password(password).build();
    const errorExpected = new UnauthorizedException('Invalid username or password.');

    userRepository.getByEmail.mockResolvedValue(undefined);

    // Act
    const actPromise = useCase.execute(command);

    // Assert
    await expect(actPromise).rejects.toThrow(errorExpected);
    expect(user.comparePassword).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should be return jwt sign when user is exist and password incorrect.', async () => {
    // Arrange
    const command = StrictBuilder<LoginCommand>().email(email).password(password).build();
    const errorExpected = new UnauthorizedException('Invalid username or password.');
    const jwtSignCallExpected = {
      sub: userId,
      email,
    };

    user.comparePassword.mockResolvedValue(false);
    userRepository.getByEmail.mockResolvedValue(user);

    // Act
    const actPromise = useCase.execute(command);

    // Assert
    await expect(actPromise).rejects.toThrow(errorExpected);
    expect(user.comparePassword).toHaveBeenCalledWith(password);
    expect(jwtService.sign).not.toHaveBeenCalledWith(jwtSignCallExpected);
  });
});
