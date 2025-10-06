import { prismaClient } from '@/lib/prisma/prisma-client';
import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import z from 'zod';
import { RegistrarContaUseCase } from '../../../modules/contas/usecases/registrar-conta-usecase';
import { hashPassword } from '../../../utils/hash-password';
import { mandarEmail } from '../../../utils/enviar-email';

export async function registroContaRota(app: FastifyTypedInstance) {
  app.post(
    '/contas/registrar',
    {
      schema: {
        tags: ['contas'],
        summary: 'Registrar nova conta',
        description: 'Registrar uma nova conta de usuário',
        body: z.object({
          nome: z.string().min(4).max(100),
          dataNascimento: z.string().transform((val) => new Date(val)),
          cpf: z.string().length(11),
          email: z.email().trim(),
          telefone: z.string().min(10).max(15).optional(),
          senha: z.string().trim().min(6),
          cep: z.string().length(8).optional(),
        }),
        response: {
          201: z.object({ mensagem: z.string() }),
          400: z.object({ erro: z.string() }),
          409: z.object({ erro: z.string() }),
          503: z.object({ erro: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { nome, dataNascimento, cpf, email, telefone, senha, cep } = request.body;

        await RegistrarContaUseCase.execute({ cpf, email, telefone });

        const senhaHash = await hashPassword(senha);

        const conta = await prismaClient.conta.create({
          data: {
            nome,
            dataNascimento,
            cpf,
            email,
            telefone,
            senhaHash,
          },
        });

        await prismaClient.detalhesConta.create({
          data: {
            contaId: conta.contaId,
            cep: cep,
            emailVerificado: false,
            telefoneVerificado: false,
          },
        });

        const tokenExpiraEm = 60 * 15;
        const tokenAcesso = request.server.jwt.sign({ sub: conta.contaId }, { expiresIn: tokenExpiraEm });

        await prismaClient.contaTokens.create({
          data: {
            contaId: conta.contaId,
            token: tokenAcesso,
            tipo: 'VALIDANDO_EMAIL',
          },
        });

        const emailEnviado = await mandarEmail({
          destino: email,
          assunto: 'Verificação de E-mail',
          conteudo: `Seu código de verificação é: ${tokenAcesso}`,
        });

        if (!emailEnviado.sucesso) {
          await prismaClient.conta.delete({ where: { contaId: conta.contaId } });
          return reply.status(503).send({
            erro: 'O serviço está indisponível.',
          });
        }

        return reply.status(201).send({
          mensagem: 'Conta criada, verifique seu e-mail',
        });
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('já está em uso')) {
          return reply.status(409).send({ erro: error.message });
        }
        return reply.status(400).send({
          erro: 'Erro ao registrar conta.',
        });
      }
    }
  );
}
