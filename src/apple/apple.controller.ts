import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppleService } from './apple.service';
import { CreateAppleDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetUser } from 'src/auth/decorators';

@Controller('apples')
export class AppleController {
  constructor(private appleService: AppleService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createApple(
    @GetUser('id') userId,
    @Body()
    dto: CreateAppleDto,
  ) {
    return this.appleService.createApple(dto, userId);
  }

  @Get()
  getApples() {
    return this.appleService.getApples();
  }
}
