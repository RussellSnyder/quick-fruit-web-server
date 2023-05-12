import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { CreateAppleDto } from 'src/apple/dto';
import { SignUpDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createUsersWithRoles } from './helpers.ts/createUsersWithRoles';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');

    // a user of each role is created so test role validation
    createdUsersSignInInformation = await createUsersWithRoles(prisma);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: SignUpDto = {
      email: 'test@test.com',
      password: '123',
      username: 'tester',
    };

    describe('signup', () => {
      const missingDataCases = [['email'], ['password'], ['username']];

      test.each(missingDataCases)(
        'should throw exception if %p empty',
        (missingKey) => {
          const incompleteDto = { ...dto };
          delete incompleteDto[missingKey];

          return pactum
            .spec()
            .post('/auth/signup')
            .withBody(incompleteDto)
            .expectStatus(400);
        },
      );

      it('should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains('access_token');
      });

      const takenCases = [['email'], ['username']];

      test.each(takenCases)(
        'should not allow signup with a taken %p',
        (takeProperty) => {
          const signupDto = {
            email: 'new@new.com',
            password: 'whatever',
            username: 'the man',
          };

          signupDto[takeProperty] = dto[takeProperty];

          return pactum
            .spec()
            .post('/auth/signup')
            .withBody(signupDto)
            .expectStatus(403);
        },
      );
    });
    describe('signin', () => {
      const emptyCases = [['email'], ['password']];

      test.each(emptyCases)(
        'should throw exception if %p empty',
        (emptyCase) => {
          const signInDto = { ...dto };

          delete signInDto[emptyCase];

          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(signInDto)
            .expectStatus(400);
        },
      );

      test.each(emptyCases)(
        'should throw exception if %p is incorrect',
        (wrongCase) => {
          const signInDto = { ...dto };

          signInDto[wrongCase] = signInDto[wrongCase] + 'wrong';

          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(signInDto)
            .expectStatus(403);
        },
      );

      it('should throw exception if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('access_token')
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          username: 'jo monkey',
          email: 'yoyo@yoyo.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.username)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Apple', () => {
    const createAppleDto = (uniqueName: string): CreateAppleDto => ({
      name: 'special apple',
      accessionName: uniqueName,
      dataUrl: 'google.come',
      genus: 'abracadabra',
      startFlowering: new Date('25 May').toJSON(),
      fullFlowering: new Date('5 June').toJSON(),
      petalFall: new Date('15 June').toJSON(),
      pickingTime: 'Late Summer',
      languageCode: 'EN',
      description: 'yolo',
    });

    describe('create apple', () => {
      describe('Role USER', () => {
        const userRoleDto = createAppleDto('user-role');
        it('should not allow create', () => {
          return pactum
            .spec()
            .post('/apples')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .withBody(userRoleDto)
            .expectStatus(403);
        });
      });

      describe('Role ADMIN', () => {
        const adminRoleDto = createAppleDto('admin-role');

        it('should create an apple', async () => {
          // sign in as super admin
          await pactum
            .spec()
            .post('/auth/signin')
            .withBody(createdUsersSignInInformation.ADMIN)
            .expectStatus(200)
            .expectBodyContains('access_token')
            .stores('userAccessToken', 'access_token');

          return pactum
            .spec()
            .post('/apples')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .withBody(adminRoleDto)
            .expectStatus(201)
            .expectBodyContains(adminRoleDto.name)
            .stores('appleId1', 'id');
        });
      });

      describe('Role SUPER_ADMIN', () => {
        it('should create an apple', async () => {
          const superAdminRoleDto = createAppleDto('super-admin-role');

          // sign in as super admin
          await pactum
            .spec()
            .post('/auth/signin')
            .withBody(createdUsersSignInInformation.SUPER_ADMIN)
            .expectStatus(200)
            .expectBodyContains('access_token')
            .stores('userAccessToken', 'access_token');

          return pactum
            .spec()
            .post('/apples')
            .withHeaders({
              Authorization: 'Bearer $S{userAccessToken}',
            })
            .withBody(superAdminRoleDto)
            .expectStatus(201)
            .expectBodyContains(superAdminRoleDto.name)
            .stores('appleId2', 'id');
        });
      });
    });

    describe('getApples', () => {
      it('should get all apples', () => {
        return pactum
          .spec()
          .get('/apples')
          .expectStatus(200)
          .expectBodyContains('$S{appleId1}')
          .expectBodyContains('$S{appleId2}')
          .expectJsonLength(2);
      });
      it('should get all apples for specified language', async () => {
        await pactum
          .spec()
          .post('/apples')
          .withBody({
            ...createAppleDto('a german apple'),
            languageCode: 'DE',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(201);

        return pactum
          .spec()
          .get('/apples')
          .withBody({
            languageCode: 'DE',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
  });
});
