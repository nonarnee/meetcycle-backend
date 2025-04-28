import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';

interface AuthRequest extends Request {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthRequest): Promise<AuthResponse> {
    return this.authService.login(req.email, req.password);
  }
}
