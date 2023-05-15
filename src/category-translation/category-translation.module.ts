import { Module } from '@nestjs/common';
import { CategoryTranslationService } from './category-translation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CategoryTranslationService],
  exports: [CategoryTranslationService],
})
export class CategoryTranslationModule {}
