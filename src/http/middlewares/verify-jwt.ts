import { ExpiredTokenError } from '@/http/errors/expired-token-error';
import { UnauthorizedError } from '@/http/errors/unauthorized-error';
import { FastifyRequest } from 'fastify';

export async function verifyJwt(req: FastifyRequest) {
  try {
    await req.jwtVerify();
  } catch (e) {
    if (e instanceof Error && e.message === 'Authorization token expired') throw new ExpiredTokenError();
    throw new UnauthorizedError();
  }
}
