import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAppleDto {
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
}
