import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Role, User } from '@prisma/client';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

export type UsersWithRole = {
  username: string;
  email: string;
  hash: string;
  role: Role;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }

  async createDefaultUserRoles() {
    const ROLES: Role[] = [
      'USER',
      'ADMIN',
      'SUPER_ADMIN',
      'TRANSLATOR_EN',
      'TRANSLATOR_DE',
    ];

    const hashPromises = ROLES.map((role) =>
      argon.hash(this.config.get(`DEFAULT_${role}_PASSWORD`)),
    );

    const hashes = await Promise.all(hashPromises);

    const dataToCreateRoles: UsersWithRole[] = ROLES.map((role, i) => ({
      username: role.toLocaleLowerCase(),
      email: `${role.toLocaleLowerCase()}@${role.toLocaleLowerCase()}.com`,
      hash: hashes[i],
      role,
    }));

    const promises = [];
    for (const role of dataToCreateRoles) {
      promises.push(
        this.prisma.user.create({
          data: role,
        }),
      );
    }

    const createdUsers = await Promise.all(promises);

    const returnValue: Record<Role, User> = createdUsers.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.role]: curr,
      }),
      {},
    );

    return returnValue;
  }
}
