import { Inject, Injectable } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppleDto } from './dto';
import { LanguageCode } from '@prisma/client';

const TRANSLATION_FIELDS = ['description', 'pickingTime', 'languageCode'];

@Injectable()
export class AppleService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

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

    // add the translation to the object to make it easier to read
    const flattenTranslations = data.map((apple) => {
      const translation = apple.translations[0];
      const appleWithoutTranslations = omit(apple, 'translations');
      return {
        ...appleWithoutTranslations,
        ...translation,
      };
    });

    return flattenTranslations;
  }

  async createApple(dto: CreateAppleDto, userId: number) {
    const { appleCreateInput, appleTranslationCreateInput } =
      this.splitTranlsationFields(dto, userId);

    try {
      // create the apple
      const createdApple = await this.prisma.apple.create({
        data: {
          ...appleCreateInput,
        },
      });

      // save translated fields
      await this.prisma.appleTranslation.create({
        data: {
          ...appleTranslationCreateInput,
          appleId: createdApple.id,
        },
      });

      return createdApple;
    } catch (e) {
      throw e;
    }
  }

  async createApples(dtos: CreateAppleDto[], userId: number) {
    const appleCreateInputs = [];
    const appleTranslationCreateInputs = [];

    dtos.forEach((dto) => {
      const { appleCreateInput, appleTranslationCreateInput } =
        this.splitTranlsationFields(dto, userId);

      appleCreateInputs.push(appleCreateInput);
      appleTranslationCreateInputs.push(appleTranslationCreateInput);
    });

    try {
      // create the apple
      const createdApples = await this.prisma.apple.createMany({
        data: appleCreateInputs,
        skipDuplicates: true,
      });

      const appleTranslationCreateInputsWithAppleIds = appleCreateInputs.map(
        (appleTranslationCreateInputs, i) => ({
          ...appleTranslationCreateInputs,
          appleId: createdApples[i].id,
        }),
      );

      // save translated fields
      await this.prisma.appleTranslation.createMany({
        data: appleTranslationCreateInputsWithAppleIds,
      });

      return createdApples;
    } catch (e) {
      throw e;
    }
  }

  splitTranlsationFields(
    dto: CreateAppleDto,
    userId: number,
  ): {
    appleTranslationCreateInput: any;
    appleCreateInput: any;
  } {
    return {
      appleCreateInput: {
        ...omit(dto, TRANSLATION_FIELDS),
        updatedById: userId,
      },
      appleTranslationCreateInput: {
        ...pick(dto, TRANSLATION_FIELDS),
        updatedById: userId,
      },
    };
  }
}
