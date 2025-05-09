import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../types/user-role.type';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserResponse } from '../dtos/response/create-user-response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async create(@Body() user: Omit<User, 'role'>): Promise<CreateUserResponse> {
    const createdUser = await this.userService.create(user);

    return {
      id: createdUser._id.toString(),
      nickname: createdUser.nickname,
      role: createdUser.role,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User): Promise<User | null> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<User | null> {
    return this.userService.remove(id);
  }
}
