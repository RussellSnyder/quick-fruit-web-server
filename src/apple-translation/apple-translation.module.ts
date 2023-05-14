import { Module } from '@nestjs/common';
import { AppleTranslationService } from './apple-translation.service';

@Module({
  providers: [AppleTranslationService],
})
export class AppleTranslationModule {}
