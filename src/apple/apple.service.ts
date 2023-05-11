import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppleDto } from './dto';

@Injectable()
export class AppleService {
  constructor(private prisma: PrismaService) {}

  getApples() {
    return this.prisma.apple.findMany();
  }

  async createApple(dto: CreateAppleDto) {
    try {
      const apple = await this.prisma.apple.create({
        data: dto,
      });

      return apple;
    } catch (e) {
      throw e;
    }
  }
}
