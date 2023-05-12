import { Module } from '@nestjs/common';
import { AppleTranslationService } from './apple-translation.service';

@Module({})
export class AppleTranslationModule {
  providers: [AppleTranslationService];
  exports: [AppleTranslationService];
}
