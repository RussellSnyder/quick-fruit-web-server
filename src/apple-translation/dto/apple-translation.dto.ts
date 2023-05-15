import { LanguageCode } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class AppleTranslationDto {
  @IsString()
  @IsOptional()
  languageCode: LanguageCode;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  pickingTime?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  shape?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  ribbing?: string;

  @IsString()
  @IsOptional()
  crown?: string;

  @IsString()
  @IsOptional()
  groundColour?: string;

  @IsString()
  @IsOptional()
  overColour?: string;

  @IsString()
  @IsOptional()
  overColourAmount?: string;

  @IsString()
  @IsOptional()
  overColourPattern?: string;

  @IsString()
  @IsOptional()
  russet?: string;

  @IsString()
  @IsOptional()
  coarseness?: string;

  @IsString()
  @IsOptional()
  fleshColour?: string;

  @IsString()
  @IsOptional()
  greasiness?: string;

  @IsString()
  @IsOptional()
  crunch?: string;

  @IsString()
  @IsOptional()
  juiciness?: string;

  @IsString()
  @IsOptional()
  floweringTimeTree1?: string;

  @IsString()
  @IsOptional()
  pickingTimeTree1?: string;

  @IsString()
  @IsOptional()
  sizeTree2?: string;

  @IsString()
  @IsOptional()
  shapeTree2?: string;

  @IsString()
  @IsOptional()
  crownTree2?: string;

  @IsString()
  @IsOptional()
  groundColourTree2?: string;

  @IsString()
  @IsOptional()
  overColourTree2?: string;

  @IsString()
  @IsOptional()
  overColourPatternTree2?: string;

  @IsString()
  @IsOptional()
  russetTree2?: string;

  @IsString()
  @IsOptional()
  ribbingTree2?: string;

  @IsString()
  @IsOptional()
  heightTree2?: string;

  @IsString()
  @IsOptional()
  widthTree2?: string;

  @IsString()
  @IsOptional()
  juicinessTree2?: string;
}
