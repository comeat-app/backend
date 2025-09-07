import { ApiError } from './api-error';

export class ExpiredTokenError extends ApiError {
  constructor() {
    super({ code: 'expired-token', message: 'The user token has been expired', statusCode: 403 });
  }
}
