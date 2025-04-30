import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { Response, Request } from 'express';
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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response<AuthResponse>,
  ): Promise<AuthResponse> {
    const loginResponse = await this.authService.validateUser(loginDto);
    if (!loginResponse) {
      throw new UnauthorizedException();
    }
    res.cookie(
      'access_token',
      loginResponse.accessToken,
      this.authService.defaultCookieOptions,
    );

    return {
      id: loginResponse.user._id.toString(),
      nickname: loginResponse.user.nickname,
      role: loginResponse.user.role,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: '로그아웃 완료' };
  }

  @Get('me')
  @Public()
  async me(@Req() req: Request) {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('인증 정보가 없습니다');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    return {
      id: payload.sub,
      nickname: payload.nickname,
      role: payload.role,
    };
  }
}
