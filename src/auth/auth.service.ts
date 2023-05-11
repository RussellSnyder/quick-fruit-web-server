import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    // Generate  the  password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          requestedRole: dto.requestedRole,
          hash,
        },
      });

      return this.signToken(user.id, user.email, user.role);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if suer doesn't exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    // compare password
    const doesPasswordMatch = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!doesPasswordMatch) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    return this.signToken(user.id, user.email, user.role);
  }

  async signToken(
    userId: number,
    email: string,
    role: Role,
  ): Promise<{
    access_token: string;
  }> {
    const data = {
      sub: userId,
      email,
      role,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
