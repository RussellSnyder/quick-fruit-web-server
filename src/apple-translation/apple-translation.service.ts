import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppleTranslationDto } from './dto/apple-translation.dto';

@Injectable()
export class AppleTranslationService {
  constructor(private prisma: PrismaService) {}

  createAppleTranslation(
    dto: AppleTranslationDto,
    appleId: number,
    updatedById: number,
  ) {
    return this.prisma.appleTranslation.create({
      data: {
        ...dto,
        appleId,
        updatedById,
      },
    });
  }

  async createManyTranslationsForManyApples(
    dtos: AppleTranslationDto[],
    appleAccessionNames: string[],
    updatedById: number,
  ) {
    // getAppleIds from accessionNames
    const apples = await this.prisma.apple.findMany({
      select: {
        id: true,
      },
      where: {
        accessionName: {
          in: appleAccessionNames,
        },
      },
    });

    const appleIds = apples.map(({ id }) => id);
    // create the translations
    await this.prisma.appleTranslation.createMany({
      data: dtos.map((dto, i) => ({
        ...dto,
        appleId: appleIds[i],
        updatedById,
      })),
    });

    // because the above only returns a number, we need another call
    // to get data that is actually useful. One day this may change
    /// https://github.com/prisma/prisma/issues/8131

    // language code should be the same for all newly created langauges
    const languageCode = dtos[0].languageCode;
    // return newly created appleTranslation Ids
    return await this.prisma.appleTranslation.findMany({
      where: {
        languageCode: {
          equals: languageCode,
        },
        appleId: {
          in: appleIds,
        },
      },
    });
  }
}
