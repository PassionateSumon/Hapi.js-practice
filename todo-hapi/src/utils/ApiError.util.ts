export class ApiError extends Error {
  constructor(message: string, public code: number) {
    super(message);
  }
}
