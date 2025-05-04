import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    const loginResponse = await this.authService.validateUser(loginDto);
    if (!loginResponse) {
      throw new UnauthorizedException();
    }

    return {
      access_token: loginResponse.accessToken,
      id: loginResponse.user._id.toString(),
      nickname: loginResponse.user.nickname,
      role: loginResponse.user.role,
    };
  }

  @Get('me')
  @Public()
  async me(@Req() req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException('인증 정보가 없습니다');
    }

    const token = authorization.split(' ')[1];

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    return {
      id: payload.sub,
      nickname: payload.nickname,
      role: payload.role,
    };
  }
}
