import { ApiError } from './api-error';

export class UnauthorizedError extends ApiError {
  constructor() {
    super({ code: 'unauthorized', message: 'Unauthorized.', statusCode: 401 });
  }
}
