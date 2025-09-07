interface Props {
  code: string;
  message: string;
  statusCode: number;
}

export class ApiError extends Error {
  private readonly code: string;
  private readonly statusCode: number;

  constructor({ code, message, statusCode }: Props) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
