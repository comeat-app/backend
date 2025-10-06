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
          401: z.object({ erro: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { email, senha } = request.body;
      const { contaId } = await EntrarContaUseCase.execute({ email, senha });

      const horaEmSegundos = 60 * 60;
      const tokenAcesso = request.server.jwt.sign({ sub: contaId }, { expiresIn: horaEmSegundos });

      return reply.status(200).send({
        tokenAcesso,
      });
    }
  );
}
