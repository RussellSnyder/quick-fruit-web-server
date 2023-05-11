import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto extends AuthDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  requestedRole: Role;
}
