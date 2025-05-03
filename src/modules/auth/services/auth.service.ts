import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto';
import { ParticipantService } from 'src/modules/participant/services/participant.service';
import { UserRole } from 'src/modules/user/types/user-role.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly participantService: ParticipantService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const accessToken = this.jwtService.sign({
        sub: user._id.toString(),
        nickname: user.nickname,
        role: user.role,
      });

      return { user, accessToken };
    }
    return null;
  }

  async signParticipant(id: string) {
    const participant = await this.participantService.findOne(id);

    if (!participant) {
      throw new BadRequestException('Participant not found');
    }

    return this.jwtService.sign({
      sub: participant._id.toString(),
      nickname: participant.nickname,
      role: UserRole.PARTICIPANT,
    });
  }
}
