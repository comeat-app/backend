import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import { prismaClient } from '@/lib/prisma/prisma-client';
import z from 'zod';

export async function validarEmail(app: FastifyTypedInstance) {
  app.post(
    '/contas/validar-email',
    {
      schema: {
        tags: ['contas'],
        summary: 'Validar e-mail',
        description: 'Validar se o e-mail do usuário pode ser ativado.',
        body: z.object({
          token: z.string(),
        }),
        response: {
          201: z.object({ mensagem: z.string() }),
          400: z.object({ erro: z.string() }),
        },
      },
    },
    async (req, reply) => {
      try {
        const { token } = req.body;
        const tokenRegistro = await prismaClient.contaTokens.findFirst({
          where: {
            token,
          },
          include: { conta: true },
        });
        if (!tokenRegistro) {
          return reply.status(400).send({
            erro: 'Token inválido. Solicite novamente a verificação de e-mail',
          });
        }

        const agora = new Date();
        const expiracao = new Date(tokenRegistro.criadoEm);
        expiracao.setMinutes(expiracao.getMinutes() + 15);

        if (agora > expiracao) {
          await prismaClient.contaTokens.delete({ where: { contaTokenId: tokenRegistro.contaTokenId } });
          return reply.status(400).send({
            erro: 'Token expirado. Solicite novamente a verificação de e-mail',
          });
        }

        await prismaClient.detalhesConta.update({
          where: { contaId: tokenRegistro.contaId },
          data: { emailVerificado: true },
        });

        await prismaClient.contaTokens.delete({
          where: { contaTokenId: tokenRegistro.contaTokenId },
        });

        return reply.status(201).send({
          mensagem: 'E-mail verificado com sucesso.',
        });
      } catch (error) {
        console.error(error);
        return reply.status(400).send({
          erro: 'Erro ao validar o token.',
        });
      }
    }
  );
}
