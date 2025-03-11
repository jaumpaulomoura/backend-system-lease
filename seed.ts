/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { UsersSeed } from './seeders';

const prisma = new PrismaClient();

async function main() {
  dotenv.config();
  console.log('Seeding...');

  const users = await UsersSeed();

  for (let i = 0; i < users.length; i++) {
    await prisma.user.upsert({
      where: {
        email: users[i].email,
      },
      create: users[i],
      update: users[i],
    });
  }
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
