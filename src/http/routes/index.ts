import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import { autenticacaoRotas } from './autenticacao';

export async function routes(app: FastifyTypedInstance) {
  app.register(autenticacaoRotas, { prefix: '/autenticacao' });
}
