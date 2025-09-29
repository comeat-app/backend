import { PrismaClient } from '@prisma/client';
import { contasSeed } from './seeds/contas';

async function seed() {
  const prisma = new PrismaClient();
  await prisma.conta.createMany({ data: await contasSeed() });
}

seed();
