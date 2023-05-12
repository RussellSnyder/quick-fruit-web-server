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

describe('Seeding', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let appleService: AppleService;
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

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');

    // a user of each role is created so test role validation
    createdUsersSignInInformation = await createUsersWithRoles(prisma);
  });

  afterAll(() => {
    app.close();
  });

  describe('Seeding Apples', () => {
    describe('appleService', () => {
      describe('createApples', () => {
        it('should create many apples', async () => {
          faker.person.fullName;
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
          }));

          const superAdmin = await prisma.user.findUnique({
            where: {
              email: createdUsersSignInInformation.SUPER_ADMIN.email,
            },
          });

          const createdAppleIds = await appleService.createApples(
            createAppleDtos,
            superAdmin.id,
          );

          expect(createdAppleIds.length).toBe(createAppleDtos.length);
        });
      });
    });
  });
});
