import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import { contaRotas } from './contas';
import { autenticacaoRotas } from './autenticacao';

export async function routes(app: FastifyTypedInstance) {
  app.register(contaRotas, { prefix: '/contas' });
  app.register(autenticacaoRotas, { prefix: '/autenticacao' });
}
