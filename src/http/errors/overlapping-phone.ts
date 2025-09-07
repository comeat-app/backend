import { ApiError } from './api-error';

export class OverlappingPhoneError extends ApiError {
  constructor() {
    super({
      code: 'overlapping-phone',
      message: 'Phone number is already in use.',
      statusCode: 409,
    });
  }
}
