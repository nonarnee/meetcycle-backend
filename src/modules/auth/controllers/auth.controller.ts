import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    console.log('loginDto', loginDto);
    const loginResponse = await this.authService.validateUser(loginDto);
    if (!loginResponse) {
      throw new UnauthorizedException();
    }
    return loginResponse;
  }
}
