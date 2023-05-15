import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { LanguageCode } from '@prisma/client';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  const seeder = appContext.get(SeederService);

  try {
    await seeder.seed();

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed!');
    throw error;
  } finally {
    appContext.close();
  }
}
bootstrap();
