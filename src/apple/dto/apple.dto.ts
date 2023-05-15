import { LanguageCode } from '@prisma/client';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { AppleTranslationDto } from 'src/apple-translation/dto/apple-translation.dto';
import { Mixin } from 'ts-mixer';

export class AppleDto {
  @IsString()
  name: string;

  @IsString()
  accessionName: string;

  @IsString()
  dataUrl: string;

  @IsString()
  @IsOptional()
  genus?: string;

  @IsDateString()
  @IsOptional()
  startFlowering?: string;

  @IsDateString()
  @IsOptional()
  fullFlowering?: string;

  @IsDateString()
  @IsOptional()
  petalFall?: string;

  @IsArray()
  categories: number[];

  @IsArray()
  @IsOptional()
  images: string[];
}

export class CreateAppleDto extends AppleDto {}

export class EditAppleDto extends AppleDto {}
