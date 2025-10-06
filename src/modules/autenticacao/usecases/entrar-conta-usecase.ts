import { prismaClient } from '@/lib/prisma/prisma-client';
import { compare } from 'bcrypt';

interface Input {
  email: string;
  senha: string;
}

interface Output {
  contaId: string;
}

export class EntrarContaUseCase {
  static async execute({ email, senha }: Input): Promise<Output> {
    const conta = await prismaClient.conta.findUnique({
      where: { email },
    });

    if (!conta) {
      throw new Error('Credenciais inválidas');
    }

    const senhaCorreta = await compare(senha, conta.senhaHash);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    return {
      contaId: conta.contaId,
    };
  }
}
