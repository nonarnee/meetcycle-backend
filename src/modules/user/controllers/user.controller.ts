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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() user: Omit<User, 'role'>,
  ): Promise<Omit<User, 'password' | 'role'>> {
    const createdUser = await this.userService.create(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, role, ...result } = createdUser;
    return result;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User): Promise<User | null> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User | null> {
    return this.userService.remove(id);
  }
}
