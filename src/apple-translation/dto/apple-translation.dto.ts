import { LanguageCode } from '@prisma/client';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class AppleTranslationDto {
  @IsString()
  @IsOptional()
  languageCode: LanguageCode;

  @IsString()
  @IsOptional()
  pickingTime?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
