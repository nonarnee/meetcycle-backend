import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      nickname: payload.nickname,
      role: payload.role,
    };
  }
}
