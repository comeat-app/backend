import { ApiError } from './api-error';

export class OverlappingEmailError extends ApiError {
  constructor() {
    super({
      code: 'overlapping-email',
      message: 'Email is already in use.',
      statusCode: 409,
    });
  }
}
