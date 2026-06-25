import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import type { UserEmail, UserPassword } from '../../../../users/applications/domains/user.domain';

export class RegisterDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsString()
  @IsNotEmpty()
  email: UserEmail;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user (minimum 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: UserPassword;
}
