import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppleService } from '../src/apple/apple.service';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createUsersWithRoles } from './helpers.ts/createUsersWithRoles';
import { CreateAppleDto } from '../src/apple/dto';
import { LanguageCode } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CategoryDto } from '../src/category/dto';
import { CategoryService } from '../src/category/category.service';

describe('Seeding', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let appleService: AppleService;
  let categoryService: CategoryService;
  let createdUsersSignInInformation;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    appleService = app.get(AppleService);
    categoryService = app.get(CategoryService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');

    // a user of each role is created so test role validation
    createdUsersSignInInformation = await createUsersWithRoles(prisma);
  });

  afterAll(() => {
    app.close();
  });

  describe('Seeding Categories', () => {
    describe('createManyCategories', () => {
      it('should create many categories', async () => {
        const uniqueCategories = faker.helpers.uniqueArray(
          faker.commerce.department,
          10,
        );

        const createCategoryDtos: CategoryDto[] = uniqueCategories.map(
          (label) => ({
            label,
            languageCode: LanguageCode.EN,
          }),
        );

        const superAdmin = await prisma.user.findUnique({
          where: {
            email: createdUsersSignInInformation.SUPER_ADMIN.email,
          },
        });

        const createdCategoryIds = await categoryService.createManyCategories(
          createCategoryDtos,
          superAdmin.id,
        );

        expect(createdCategoryIds.length).toBe(createCategoryDtos.length);
      });
    });
  });
  describe('Seeding Apples', () => {
    describe('appleService', () => {
      describe('createManyApples', () => {
        it('should create many apples', async () => {
          const uniqueNames = faker.helpers.uniqueArray(
            faker.person.fullName,
            10,
          );

          const createAppleDtos: CreateAppleDto[] = uniqueNames.map((name) => ({
            name,
            accessionName: name,
            dataUrl: `${name}.com`,
            languageCode: LanguageCode.EN,
            description: `${name} is a tasty apple`,
            categories: [],
          }));

          const superAdmin = await prisma.user.findUnique({
            where: {
              email: createdUsersSignInInformation.SUPER_ADMIN.email,
            },
          });

          const createdAppleIds = await appleService.createManyApples(
            createAppleDtos,
            superAdmin.id,
          );

          expect(createdAppleIds.length).toBe(createAppleDtos.length);
        });

        it.skip('should create many apples with categories', async () => {
          const uniqueAppleNames = faker.helpers.uniqueArray(
            faker.person.fullName,
            10,
          );

          const categories = await categoryService.getAllCategories(
            LanguageCode.EN,
          );

          const createAppleDtos: CreateAppleDto[] = uniqueAppleNames.map(
            (name) => {
              const appleCategories = faker.helpers.arrayElements(categories, {
                min: 1,
                max: 5,
              });

              return {
                name,
                accessionName: name,
                dataUrl: `${name}.com`,
                languageCode: LanguageCode.EN,
                description: `${name} is a tasty apple`,
                categories: appleCategories.map(({ id }) => id),
              };
            },
          );

          const superAdmin = await prisma.user.findUnique({
            where: {
              email: createdUsersSignInInformation.SUPER_ADMIN.email,
            },
          });

          const createdAppleIds = await appleService.createManyApples(
            createAppleDtos,
            superAdmin.id,
          );

          expect(createdAppleIds.length).toBe(createAppleDtos.length);
        });
      });
    });
  });
});
