import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorators';
import { AppleService } from './apple.service';
import { CreateAppleDto } from './dto';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('apples')
export class AppleController {
  constructor(private appleService: AppleService) {}

  @Post()
  @UseGuards(AuthGuard)
  // @Roles(Role.SUPER_ADMIN)
  // @UseGuards(RolesGuard)
  createApple(
    @GetUser() user: User,
    @Body()
    dto: CreateAppleDto,
  ) {
    console.log({ user });
    return this.appleService.createApple(dto);
  }

  @Get()
  getApples() {
    return this.appleService.getApples();
  }
}
