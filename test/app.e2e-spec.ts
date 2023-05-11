import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto, SignUpDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateAppleDto } from 'src/apple/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
          role: 'SUPER_ADMIN',
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

  // describe('Apple', () => {
  //   describe('create apple', () => {
  //     const createAppleDto: CreateAppleDto = {
  //       name: 'special apple',
  //       accessionName: 'special apple',
  //       dataUrl: 'google.come',
  //       genus: 'abracadabra',
  //       startFlowering: new Date('25 May').toJSON(),
  //       fullFlowering: new Date('5 June').toJSON(),
  //       petalFall: new Date('15 June').toJSON(),
  //       pickingTime: 'Late Summer',
  //     };
  //     it('should create an apple', () => {
  //       return pactum
  //         .spec()
  //         .post('/apples')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .withBody(createAppleDto)
  //         .expectStatus(201)
  //         .expectBodyContains(createAppleDto.name)
  //         .stores('appleId', 'id');
  //     });
  //   });
  // });
});
