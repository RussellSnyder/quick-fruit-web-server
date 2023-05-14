import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AppleService } from './apple.service';
import { CreateAppleDto } from './dto';

@Controller('apples')
export class AppleController {
  constructor(private appleService: AppleService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createApple(
    @GetUser('id', ParseIntPipe) userId,
    @Body()
    dto: CreateAppleDto,
  ) {
    return this.appleService.createApple(dto, userId);
  }

  @Get()
  getApples(@Query('language') languageCode) {
    return this.appleService.getApples(languageCode?.toUpperCase());
  }

  @Get(':id')
  getAppleById(
    @Param('id', ParseIntPipe) appleId: number,
    @Query('language') languageCode,
  ) {
    return this.appleService.getAppleById(appleId, languageCode?.toUpperCase());
  }
}
