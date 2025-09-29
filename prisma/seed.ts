import { PrismaClient } from '@prisma/client';
import { contasSeed } from './seeds/contas';

const prisma = new PrismaClient();

async function seed() {
  await prisma.contaTokens.deleteMany();
  await prisma.detalhesConta.deleteMany();
  await prisma.conta.deleteMany();

  const contas = await contasSeed();

  for (const conta of contas) {
    const novaConta = await prisma.conta.create({ data: conta });

    await prisma.detalhesConta.create({
      data: {
        contaId: novaConta.contaId,
        emailVerificado: true,
        telefoneVerificado: false,
      },
    });
  }

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
