import { LanguageCode } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

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

  @IsString()
  @IsOptional()
  pickingTime?: string;

  @IsString()
  languageCode: LanguageCode;

  @IsString()
  description: string;
}

export class CreateAppleDto extends AppleDto {}

export class EditAppleDto extends AppleDto {}
