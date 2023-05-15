import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import { Apple, LanguageCode } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { CategoryTranslationService } from 'src/category-translation/category-translation.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CategoryDto } from 'src/category/dto';
import { zipObject, omit, pick, mapKeys, camelCase } from 'lodash';
import { AppleDto, CreateAppleDto } from 'src/apple/dto';
import { AppleService } from 'src/apple/apple.service';
import { AppleTranslationService } from 'src/apple-translation/apple-translation.service';
import { AppleTranslationDto } from 'src/apple-translation/dto/apple-translation.dto';

const readScrappedDataFile = async (langauge: LanguageCode) => {
  const fileToRead = `./scrapped_data/${langauge.toLowerCase()}.json`;

  return await fs.promises.readFile(fileToRead, 'utf8');
};

readScrappedDataFile(LanguageCode.EN);

interface ParsedApple
  extends Omit<CreateAppleDto & AppleTranslationDto, 'categories'> {
  categories: string[];
}

// example input '25th May'. output: '2001-05-24T22:00:00.000Z'
const formatDate = (stringDate: string) => {
  const [day, month] = stringDate.split(' ');
  const parsedDay = parseInt(day);
  return new Date(`${parsedDay} ${month}`).toJSON();
};

@Injectable()
export class SeederService {
  constructor(
    private categoryService: CategoryService,
    private categoryTranslationService: CategoryTranslationService,
    private appleService: AppleService,
    private appleTranslationService: AppleTranslationService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async seed() {
    // start with English as a base
    const jsonString = await readScrappedDataFile(LanguageCode.EN);

    const parsedJson: {
      appleInfo: {
        categories: Record<string, string>;
        apples: Record<string, ParsedApple>;
        properties: Record<string, string>;
      };
    } = JSON.parse(jsonString);

    const {
      categories: categoryNamesObject,
      apples: appleObject,
      properties,
    } = parsedJson.appleInfo;

    const categoryNames = Object.values(categoryNamesObject);

    const users = await this.userService.createDefaultUserRoles();

    const categoryDtos: CategoryDto[] = categoryNames.map((label) => ({
      label,
      languageCode: LanguageCode.EN,
    }));

    const createdCategories = await this.categoryService.createManyCategories(
      categoryDtos,
      users.SUPER_ADMIN.id,
    );
    const categoryIds = createdCategories.map(({ id }) => id);
    const categoryIdLookup = zipObject(categoryNames, categoryIds);

    const appleAccessionNames = Object.keys(appleObject);
    // console.log(appleAccessionNames.slice(1264, 1266));
    const appleDtos: (CreateAppleDto & AppleTranslationDto)[] = Object.values(
      appleObject,
    ).map((apple, i) => {
      const appleWithFlattenedFloweringTimes =
        this.convertAndFlatternFloweringTime(apple);

      // convert keys to camel case
      const withCamelKeys = mapKeys(appleWithFlattenedFloweringTimes, (v, k) =>
        camelCase(k),
      );
      console.log('in map', appleAccessionNames[i]);
      return {
        ...withCamelKeys,
        accessionName: appleAccessionNames[i],
        updatedById: users.SUPER_ADMIN.id,
        languageCode: LanguageCode.EN,
        categories: apple.categories.map(
          (category) => categoryIdLookup[category],
        ),
      };
    });

    const createdApples = await this.appleService.createManyApples(
      appleDtos,
      users.SUPER_ADMIN.id,
    );
  }

  convertAndFlatternFloweringTime(appleDto: ParsedApple) {
    let appleDtoWithFlattenedFloweringTimes = { ...appleDto };

    const floweringKeys = ['flowering time', 'flowering time tree 1'];
    const floweringTime =
      appleDto[floweringKeys[0]] ?? appleDto[floweringKeys[1]];

    let parsedFloweringTimes: object | undefined;
    if (floweringTime) {
      const flowerKeys = Object.keys(floweringTime);
      const convertedFlowerValues =
        Object.values(floweringTime).map(formatDate);
      parsedFloweringTimes = zipObject(flowerKeys, convertedFlowerValues);
    }
    appleDtoWithFlattenedFloweringTimes = omit(
      appleDtoWithFlattenedFloweringTimes,
      floweringKeys,
    );

    return {
      ...appleDtoWithFlattenedFloweringTimes,
      ...parsedFloweringTimes,
    };
  }
}
