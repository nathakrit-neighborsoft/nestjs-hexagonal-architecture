import { All, Controller, Inject, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Auth } from './auth';
import { AUTH_TOKEN } from './auth.token';

@Controller('api/auth')
export class AuthController {
  constructor(@Inject(AUTH_TOKEN) private readonly auth: Auth) {}

  @All('*')
  async handle(@Req() req: Request, @Res() res: Response) {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }

    const init: RequestInit = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = JSON.stringify(req.body);
    }

    const webReq = new Request(url, init);
    const authResponse = await this.auth.handler(webReq);

    res.status(authResponse.status);
    authResponse.headers.forEach((value, key) => res.setHeader(key, value));
    const body = await authResponse.text();
    if (body) {
      res.send(body);
    } else {
      res.end();
    }
  }
}
