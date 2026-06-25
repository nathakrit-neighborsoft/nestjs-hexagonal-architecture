import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtExpiresIn, jwtSecret } from '../configs/jwt.config';
import { UserTypeOrmRepository } from '../users/adapters/outbounds/user.typeorm.repository';
import { userRepositoryToken } from '../users/applications/ports/user.repository';
import { AuthController } from './adapters/inbounds/auth.controller';
import { JwtStrategy } from './jwtStrategy';
import { LoginUseCase } from './usecases/login.usecase';
import { RegisterUseCase } from './usecases/register.usecase';

@Module({
  imports: [JwtModule.register({ secret: jwtSecret, signOptions: { expiresIn: jwtExpiresIn } }), PassportModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    RegisterUseCase,
    {
      provide: userRepositoryToken,
      useClass: UserTypeOrmRepository,
    },
  ],
})
export class AuthModule {}
