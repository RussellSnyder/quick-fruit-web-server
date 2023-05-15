import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { CategoryModule } from '../category/category.module';
import { CategoryTranslationModule } from '../category-translation/category-translation.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppleTranslationModule } from 'src/apple-translation/apple-translation.module';
import { AppleModule } from 'src/apple/apple.module';

@Module({
  imports: [
    ConfigModule,
    CategoryModule,
    CategoryTranslationModule,
    UserModule,
    AppleModule,
    AppleTranslationModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
