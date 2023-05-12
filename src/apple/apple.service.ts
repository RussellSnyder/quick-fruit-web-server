import { Inject, Injectable } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppleDto } from './dto';

const TRANSLATION_FIELDS = ['description', 'pickingTime', 'languageCode'];

@Injectable()
export class AppleService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  getApples() {
    return this.prisma.apple.findMany();
  }

  async createApple(dto: CreateAppleDto, userId: number) {
    console.log('createApple');
    console.log({ dto });
    // split between appl and appleTranslation data

    const appleCreateInput = {
      ...omit(dto, TRANSLATION_FIELDS),
      updatedById: userId,
    };
    // the appleID will be empty still because the apple hasn't been created
    const appleTranslationCreateInput = {
      ...pick(dto, TRANSLATION_FIELDS),
      updatedById: userId,
    };
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
}
