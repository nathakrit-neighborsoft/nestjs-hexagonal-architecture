import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { Request } from 'express';
import type { Auth } from './auth';
import { AUTH_TOKEN } from './auth.token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_TOKEN) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
    const session = await this.auth.api.getSession({ headers });
    if (!session) {
      throw new UnauthorizedException();
    }
    (request as unknown as Record<string, unknown>).user = session.user;
    return true;
  }
}
