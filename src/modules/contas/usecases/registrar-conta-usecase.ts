import { prismaClient } from '@/lib/prisma/prisma-client';

interface Input {
  cpf: string;
  email: string;
  telefone?: string;
}

export class RegistrarContaUseCase {
  static async execute({ cpf, email, telefone }: Input) {
    try {
      const contaExistente = await prismaClient.conta.findFirst({
        where: {
          OR: [{ cpf }, { email }, ...(telefone ? [{ telefone }] : [])],
        },
      });
      if (contaExistente) {
        throw new Error('O e-mail/telefone informado já está em uso.');
      }
    } catch (erro: unknown) {
      console.error('Erro ao registrar conta:', erro);

      if (erro instanceof Error && erro.message.includes('Authentication failed')) {
        throw new Error('Erro ao conectar ao banco de dados. Verifique as credenciais.');
      }

      throw new Error('Erro interno no servidor. Tente novamente mais tarde.');
    }
  }
}
