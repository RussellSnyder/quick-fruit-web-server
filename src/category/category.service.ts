import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Category, CategoryTranslation, LanguageCode } from '@prisma/client';
import { omit, pick } from 'lodash';

const TRANSLATION_FIELDS = ['label', 'languageCode'];

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CategoryDto, userId: number) {
    const newCategory = await this.prisma.category.create({
      data: {
        updatedById: userId,
      },
    });
    const translation = await this.prisma.categoryTranslation.create({
      data: {
        ...dto,
        updatedById: userId,
        categoryId: newCategory.id,
      },
    });
    return {
      ...translation,
      ...newCategory,
    };
  }

  async createManyCategories(dtos: CategoryDto[], userId: number) {
    const categoryCreateInputs = [];
    const categoryTranslationCreateInputs = [];

    dtos.forEach((dto) => {
      const { categoryCreateInput, categoryTranslationCreateInput } =
        this.splitTranlsationFields(dto, userId);

      categoryCreateInputs.push(categoryCreateInput);
      categoryTranslationCreateInputs.push(categoryTranslationCreateInput);
    });

    try {
      // create the categories
      // hopefully soon this returns the created objects: https://github.com/prisma/prisma/issues/8131
      const batchPayload = await this.prisma.apple.createMany({
        data: categoryCreateInputs,
        skipDuplicates: true,
      });

      // because no part of the DTO has survived the translation process,
      // we simply get the last creted categories
      const createdCategoryIds = await this.prisma.apple.findMany({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
        take: batchPayload.count,
      });

      const categoryTranslationCreateInputsWithCategoryIds =
        categoryTranslationCreateInputs.map(
          (categoryTranslationCreateInput, i) => ({
            ...categoryTranslationCreateInput,
            categoryId: createdCategoryIds[i].id,
          }),
        );

      // create translated fields
      await this.prisma.appleTranslation.createMany({
        data: categoryTranslationCreateInputsWithCategoryIds,
      });

      return createdCategoryIds;
    } catch (e) {
      throw e;
    }
  }

  async getAllCategories(languageCode: LanguageCode) {
    const data = await this.prisma.category.findMany({
      where: {
        translations: {
          some: {
            languageCode,
          },
        },
      },
      include: {
        translations: true,
      },
    });

    // add the translation to the object to make it easier to consume
    const categoriesWithTranslation = data.map(
      this.mergeSpecificLanguageIntoCategory,
    );

    return categoriesWithTranslation;
  }

  mergeSpecificLanguageIntoCategory(
    categoryWithTranslations: Category & {
      translations: CategoryTranslation[];
    },
  ) {
    const translation = categoryWithTranslations.translations[0];
    const categoryWithoutTranslations = omit(
      categoryWithTranslations,
      'translations',
    );
    return {
      ...categoryWithoutTranslations,
      ...translation,
    };
  }

  splitTranlsationFields(
    dto: CategoryDto,
    userId: number,
  ): {
    categoryTranslationCreateInput: any;
    categoryCreateInput: any;
  } {
    return {
      categoryCreateInput: {
        ...omit(dto, TRANSLATION_FIELDS),
        updatedById: userId,
      },
      categoryTranslationCreateInput: {
        ...pick(dto, TRANSLATION_FIELDS),
        updatedById: userId,
      },
    };
  }
}
