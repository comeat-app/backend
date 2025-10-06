import { prismaClient } from '@/lib/prisma/prisma-client';

interface Input {
  cpf: string;
  email: string;
  telefone?: string;
}

export class RegistrarContaUseCase {
  static async execute({ cpf, email, telefone }: Input) {
    const contaExistente = await prismaClient.conta.findFirst({
      where: {
        OR: [{ cpf }, { email }, ...(telefone ? [{ telefone }] : [])],
      },
    });
    if (contaExistente) {
      throw new Error('O e-mail/telefone informado já está em uso.');
    }
  }
}
