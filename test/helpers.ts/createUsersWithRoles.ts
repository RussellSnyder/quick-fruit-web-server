import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Role } from '@prisma/client';

export type UsersWithRole = Record<
  Role,
  {
    username: string;
    email: string;
    hash: string;
    role: Role;
  }
>;

const DEFAULT_PASSWORD = 'password';

export type CreatedUsers = Record<Role, { email: string; password: string }>;

export const createUsersWithRoles = async (prisma: PrismaService) => {
  const dataToCreateRoles: UsersWithRole = {
    USER: {
      username: 'user',
      email: 'user@user.com',
      hash: await argon.hash(DEFAULT_PASSWORD),
      role: Role.USER,
    },
    ADMIN: {
      username: 'admin',
      email: 'admin@admin.com',
      hash: await argon.hash(DEFAULT_PASSWORD),
      role: Role.ADMIN,
    },
    SUPER_ADMIN: {
      username: 'super-admin',
      email: 'super-admin@super-admin.com',
      hash: await argon.hash(DEFAULT_PASSWORD),
      role: Role.SUPER_ADMIN,
    },
    TRANSLATOR_EN: {
      username: 'translator-en',
      email: 'translator-en@translator-en.com',
      hash: await argon.hash(DEFAULT_PASSWORD),
      role: Role.TRANSLATOR_EN,
    },
    TRANSLATOR_DE: {
      username: 'translator-de',
      email: 'translator-de@translator-de.com',
      hash: await argon.hash(DEFAULT_PASSWORD),
      role: Role.TRANSLATOR_DE,
    },
  };

  const promises = [];
  for (const role of Object.values(dataToCreateRoles)) {
    promises.push(
      prisma.user.create({
        data: role,
      }),
    );
  }

  await Promise.all(promises);

  const createdUsersSignInInformation = Object.values(dataToCreateRoles).reduce(
    (prev, curr) => ({
      ...prev,
      [curr.role]: {
        email: curr.email,
        password: DEFAULT_PASSWORD,
      },
    }),
    {},
  ) as CreatedUsers;

  return createdUsersSignInInformation;
};
