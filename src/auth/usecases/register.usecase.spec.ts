import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StrictBuilder } from 'builder-pattern';
import { IUser, UserEmail, UserId, UserPassword } from 'src/users/applications/domains/user.domain';
import { UserRepository } from 'src/users/applications/ports/user.repository';
import { mock } from 'vitest-mock-extended';
import { RegisterCommand, RegisterUseCase } from './register.usecase';

describe('Register Use Case', () => {
  let useCase: RegisterUseCase;
  const userRepository = mock<UserRepository>();
  const jwtService = mock<JwtService>();

  beforeEach(() => {
    useCase = new RegisterUseCase(userRepository, jwtService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const email = faker.internet.email() as UserEmail;
  const password = faker.internet.password() as UserPassword;
  const userId = faker.database.mongodbObjectId() as UserId;
  const mockUser = mock<IUser>({
    uuid: userId,
    email,
  });

  it('should be throw error email already exists when user is exist', async () => {
    // Arrange
    const command = StrictBuilder<RegisterCommand>().email(email).password(password).build();
    const errorExpected = new ConflictException('Email already exists');

    userRepository.getByEmail.mockResolvedValue(mockUser);

    // Act
    const actPromise = useCase.execute(command);

    // Assert
    await expect(actPromise).rejects.toThrow(errorExpected);
    expect(userRepository.getByEmail).toHaveBeenCalledWith(email);
    expect(userRepository.create).not.toHaveBeenCalled();
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('should be register user when user is not exist', async () => {
    // Arrange
    userRepository.getByEmail.mockResolvedValue(undefined);
    userRepository.create.mockResolvedValue(mockUser);

    const command = StrictBuilder<RegisterCommand>().email(email).password(password).build();
    const expectedUser = expect.objectContaining({
      email,
      password: expect.any(String),
    });
    // Act
    const actual = await useCase.execute(command);

    // Assert
    expect(actual).not.toBeNull();
    expect(userRepository.getByEmail).toHaveBeenCalledWith(email);
    expect(userRepository.create).toHaveBeenCalledWith(expectedUser);
  });
});
