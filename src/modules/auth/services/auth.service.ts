import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const signPayload = { sub: user._id.toString(), email: user.email };

      return {
        id: user._id.toString(),
        access_token: this.jwtService.sign(signPayload),
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }
}
