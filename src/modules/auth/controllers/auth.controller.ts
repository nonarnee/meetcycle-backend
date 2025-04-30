import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
