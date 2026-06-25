import { Body, Controller, HttpStatus, Post } from '@nestjs/common';

import { Transactional } from '@nestjs-cls/transactional';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { accessKeyToken } from 'src/configs/jwt.config';
import type { LoginCommand } from '../../usecases/login.usecase';
import { LoginUseCase } from '../../usecases/login.usecase';
import { RegisterCommand, RegisterUseCase } from '../../usecases/register.usecase';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Username already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid registration data.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{ [accessKeyToken]: string }> {
    const command = Builder<RegisterCommand>().email(registerDto.email).password(registerDto.password).build();
    return this.registerUseCase.execute(command);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'The username or password is incorrect.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error.',
  })
  @Transactional()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ [accessKeyToken]: string }> {
    const command = Builder<LoginCommand>().email(loginDto.email).password(loginDto.password).build();
    return this.loginUseCase.execute(command);
  }
}
