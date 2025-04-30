import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { Room } from '../schemas/room.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/types/user-role.type';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room | null> {
    return this.roomService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  update(
    @Param('id') id: string,
    @Body() room: Partial<Room>,
  ): Promise<Room | null> {
    return this.roomService.update(id, room);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  remove(@Param('id') id: string): Promise<Room | null> {
    return this.roomService.remove(id);
  }

  @Get('meeting/:meetingId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findByMeeting(@Param('meetingId') meetingId: string): Promise<Room[]> {
    return this.roomService.findByMeeting(meetingId);
  }

  @Get('participant/:userId')
  @Roles(UserRole.ADMIN, UserRole.HOST)
  findByParticipant(@Param('userId') userId: string): Promise<Room[]> {
    return this.roomService.findByParticipant(userId);
  }

  @Put(':id/like')
  updateLiked(
    @Param('id') id: string,
    @Body('gender') gender: 'male' | 'female',
    @Body('liked') liked: boolean,
  ): Promise<Room | null> {
    return this.roomService.updateLiked(id, gender, liked);
  }
}
