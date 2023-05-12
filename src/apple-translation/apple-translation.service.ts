import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppleTranslationService {
  constructor(private prisma: PrismaClient) {}

  createAppleTranslation(data) {}

  updateAppleTranslation() {
    console.log('Update');
  }
}
