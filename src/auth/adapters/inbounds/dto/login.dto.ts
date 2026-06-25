import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import type { UserEmail, UserPassword } from '../../../../users/applications/domains/user.domain';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsString()
  @IsNotEmpty()
  email: UserEmail;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: UserPassword;
}
