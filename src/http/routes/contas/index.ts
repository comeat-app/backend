import { FastifyTypedInstance } from '@/types/fastify-typed-instance';
import { registroContaRota } from './registro-conta';
import { validarEmail } from './validar-email';

export async function contaRotas(app: FastifyTypedInstance) {
  app.register(registroContaRota);
  app.register(validarEmail);
}
