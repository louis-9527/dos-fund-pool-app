export const BusinessErrorCode = {
  INVALID_PARAMS: 1001,
  GAME_NOT_FOUND: 1002,
  POOL_NOT_FOUND: 1003,
  INTERNAL_ERROR: 1004,
} as const;

export type BusinessErrorCodeValue = (typeof BusinessErrorCode)[keyof typeof BusinessErrorCode];

export class BusinessException extends Error {
  constructor(
    public readonly code: BusinessErrorCodeValue,
    message: string,
  ) {
    super(message);
    this.name = 'BusinessException';
  }
}
