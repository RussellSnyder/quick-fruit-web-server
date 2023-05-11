import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppleService } from './apple.service';
import { CreateAppleDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('apples')
export class AppleController {
  constructor(private appleService: AppleService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createApple(
    @Body()
    dto: CreateAppleDto,
  ) {
    return this.appleService.createApple(dto);
  }

  @Get()
  getApples() {
    return this.appleService.getApples();
  }
}
