import { Injectable } from '@nestjs/common';
import { LanguageCode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryTranslationService {
  constructor(private prisma: PrismaService) {}

  createCategoryTranslation(
    label: string,
    languageCode: LanguageCode,
    categoryId: number,
    updatedById: number,
  ) {
    return this.prisma.categoryTranslation.create({
      data: {
        languageCode,
        label,
        categoryId,
        updatedById,
      },
    });
  }

  createManyCategoryTranslations(
    data: { label: string; categoryId: number }[],
    languageCode: LanguageCode,
    updatedById: number,
  ) {
    return this.prisma.categoryTranslation.createMany({
      data: data.map(({ label, categoryId }) => ({
        label,
        categoryId,
        languageCode,
        updatedById,
      })),
    });
  }
}
