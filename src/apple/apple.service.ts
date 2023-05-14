import { Injectable } from '@nestjs/common';
import { Apple, AppleTranslation, LanguageCode } from '@prisma/client';
import { omit, pick } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppleDto } from './dto';

const TRANSLATION_FIELDS = ['description', 'pickingTime', 'languageCode'];

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

    console.log({ data });
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

  async createApple(dto: CreateAppleDto, userId: number) {
    const { appleCreateInput, appleTranslationCreateInput, categories } =
      this.splitIntoCreationInputs(dto);

    try {
      // create the apple
      const createdApple = await this.prisma.apple.create({
        data: {
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
        },
        include: {
          categories: true,
        },
      });

      // save translated fields
      const createdTranslation = await this.prisma.appleTranslation.create({
        data: {
          ...appleTranslationCreateInput,
          appleId: createdApple.id,
          updatedById: userId,
          createdAt: new Date(),
        },
      });

      return {
        ...createdApple,
        ...createdTranslation,
      };
    } catch (e) {
      throw e;
    }
  }

  async createManyApples(dtos: CreateAppleDto[], userId: number) {
    const promises = [];

    dtos.forEach((dto) => {
      promises.push(this.createApple(dto, userId));
    });

    const createdApples = Promise.all(promises);

    return createdApples;
  }

  splitIntoCreationInputs(dto: CreateAppleDto): {
    appleTranslationCreateInput: any;
    appleCreateInput: any;
    categories: number[];
  } {
    const dtoWithoutCategories = omit(dto, 'categories');
    const categories = dto.categories;

    return {
      appleCreateInput: omit(dtoWithoutCategories, TRANSLATION_FIELDS),
      appleTranslationCreateInput: pick(
        dtoWithoutCategories,
        TRANSLATION_FIELDS,
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
