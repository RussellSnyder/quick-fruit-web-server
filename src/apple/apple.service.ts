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
      // create the apples
      // hopefully soon this returns the created objects: https://github.com/prisma/prisma/issues/8131
      await this.prisma.apple.createMany({
        data: appleCreateInputs,
        skipDuplicates: true,
      });

      // but until then, we have to manually get the created Ids
      const createdAppleIds = await this.prisma.apple.findMany({
        select: {
          id: true,
        },
        where: {
          accessionName: {
            in: appleCreateInputs.map(({ accessionName }) => accessionName),
          },
        },
      });

      const appleTranslationCreateInputsWithAppleIds =
        appleTranslationCreateInputs.map((appleTranslationCreateInput, i) => ({
          ...appleTranslationCreateInput,
          appleId: createdAppleIds[i].id,
        }));

      // create translated fields
      await this.prisma.appleTranslation.createMany({
        data: appleTranslationCreateInputsWithAppleIds,
      });

      return createdAppleIds;
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
