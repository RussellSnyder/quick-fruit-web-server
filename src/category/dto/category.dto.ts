import { LanguageCode } from '@prisma/client';
import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString()
  label: string;
  @IsString()
  languageCode: LanguageCode;
}
