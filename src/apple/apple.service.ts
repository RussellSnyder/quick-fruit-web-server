import { Injectable } from '@nestjs/common';
import { Apple, AppleTranslation, LanguageCode } from '@prisma/client';
import { omit, pick } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { AppleDto, CreateAppleDto } from './dto';
import { AppleTranslationDto } from 'src/apple-translation/dto/apple-translation.dto';
import { APPLE_TRANSLATION_FIELDS } from '../apple-translation/constants';

@Injectable()
export class AppleService {
  constructor(private readonly prisma: PrismaService) {}

  async getApples(languageCode: LanguageCode = 'EN') {
    const data = await this.prisma.apple.findMany({
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

    // console.log({ data });
    // add the translation to the object to make it easier to consume
    const appleWithTranslation = data.map(this.mergeSpecificLanguageIntoApple);

    return appleWithTranslation;
  }

  async getAppleById(appleId: number, languageCode: LanguageCode = 'EN') {
    const data = await this.prisma.apple.findFirst({
      include: {
        translations: true,
      },
      where: {
        id: appleId,
        translations: {
          some: {
            languageCode,
          },
        },
      },
    });

    // add the translation to the object to make it easier to consume
    const appleWithTranslation = this.mergeSpecificLanguageIntoApple(data);

    return appleWithTranslation;
  }

  async createApple(dto: CreateAppleDto & AppleTranslationDto, userId: number) {
    const { appleCreateInput, appleTranslationCreateInput, categories } =
      this.splitIntoCreationInputs(dto);

    try {
      const data = {
        ...appleCreateInput,
        updatedById: userId,
        categories: {
          create: categories.map((catId) => ({
            // updatedById: userId,
            categoryId: Number(catId),
            assignedAt: new Date(),
            assignedById: userId,
          })),
        },
        translations: {
          create: [{ ...appleTranslationCreateInput, updatedById: userId }],
        },
      };
      // create the apple
      const createdApple = await this.prisma.apple.create({
        data,
        include: {
          categories: true,
          translations: true,
        },
      });

      const createdTranslation = createdApple.translations[0];

      // TODO add this to categoryTranslation service
      const categoryTranslations =
        await this.prisma.categoryTranslation.findMany({
          where: {
            id: {
              in: createdApple.categories.map(({ categoryId }) => categoryId),
            },
            languageCode: {
              equals: dto.languageCode,
            },
          },
        });

      const categoriesWithTranslations = createdApple.categories.map(
        (cat, i) => ({
          ...pick(cat, ['categoryId']),
          label: categoryTranslations[i].label,
        }),
      );
      return {
        ...omit(createdApple, 'translations'),
        ...pick(createdTranslation, APPLE_TRANSLATION_FIELDS),
        categories: categoriesWithTranslations,
      };
    } catch (e) {
      throw e;
    }
  }

  async createManyApples(
    dtos: (CreateAppleDto & AppleTranslationDto)[],
    userId: number,
  ) {
    const createdApples = [];

    let progress = 0;
    for (const dto of dtos) {
      try {
        const createdApple = await this.createApple(dto, userId);
        createdApples.push(createdApple);
        progress += 1;
        console.log(progress);
      } catch (error) {
        console.log(error);
        console.log('failing dto:', { dto });
        throw error;
      }
    }

    return createdApples;
  }

  splitIntoCreationInputs(dto: CreateAppleDto): {
    appleCreateInput: any;
    appleTranslationCreateInput: any;
    categories: number[];
  } {
    const dtoWithoutRelations = omit(dto, ['categories', 'images']);
    const { categories } = dto;

    return {
      appleCreateInput: omit(dtoWithoutRelations, APPLE_TRANSLATION_FIELDS),
      appleTranslationCreateInput: pick(
        dtoWithoutRelations,
        APPLE_TRANSLATION_FIELDS,
      ),
      categories,
    };
  }

  mergeSpecificLanguageIntoApple(
    appleWithTranslations: Apple & {
      translations: AppleTranslation[];
    },
  ) {
    const translation = appleWithTranslations.translations[0];
    const appleWithoutTranslations = omit(
      appleWithTranslations,
      'translations',
    );
    return {
      ...appleWithoutTranslations,
      ...translation,
    };
  }
}
