import { env } from '@/env';
import { routes } from '@/http/routes';
import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastify, FastifyError } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import z, { ZodError } from 'zod';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: '*' });
app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.register(fastifyCookie, {
  secret: env.JWT_SECRET,
  hook: 'preHandler',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Comeat API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, { routePrefix: '/docs' });
app.register(routes);

app.setErrorHandler((e: FastifyError & { code?: string }, _, reply) => {
  if (e instanceof ZodError) return reply.status(400).send(z.flattenError(e));

  const statusCode = e.statusCode ?? 500;
  const code = e.code ?? 'error';
  const message = e.message ? e.message : 'Internal Server Error';
  return reply.status(statusCode).send({ error: { code, message } });
});

app.listen({ port: 4000 }, (_, address) => {
  console.log(`Server running at ${address}`);
});
