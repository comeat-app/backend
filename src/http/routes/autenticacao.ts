import { prismaClient } from '@/lib/prisma/prisma-client';
import { EntrarContaUseCase } from '@/modules/autenticacao/usecases/entrar-conta-usecase';
import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import z from 'zod';

export async function autenticacaoRotas(app: FastifyTypedInstance) {
  app.post(
    '/entrar',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Entrar na conta',
        description: 'Entrar na conta usando email e senha',
        body: z.object({
          email: z.email().trim(),
          senha: z.string().trim().min(6),
        }),
        response: {
          200: z.object({ tokenAcesso: z.string() }),
          400: z.object({ erro: z.string() }),
          401: z.object({ erro: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, senha } = request.body;
        const { contaId } = await EntrarContaUseCase.execute({ email, senha });
        const verificado = await prismaClient.detalhesConta.findUnique({
          where: { contaId },
          select: { emailVerificado: true },
        });

        if (!verificado?.emailVerificado) {
          return reply.status(401).send({ erro: 'Email não verificado' });
        }

        const horaEmSegundos = 60 * 60;
        const tokenAcesso = request.server.jwt.sign({ sub: contaId }, { expiresIn: horaEmSegundos });

        await prismaClient.contaTokens.create({
          data: {
            contaId,
            token: tokenAcesso,
            tipo: 'acesso',
          },
        });
        return reply.status(200).send({
          tokenAcesso,
        });
      } catch {
        return reply.status(401).send({ erro: 'Credenciais inválidas' });
      }
    }
  );
}
