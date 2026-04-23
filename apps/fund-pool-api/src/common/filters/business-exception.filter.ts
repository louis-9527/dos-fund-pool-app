import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BusinessErrorCode, BusinessException } from '../exceptions/business.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BusinessException) {
      return response.status(200).json({
        code: exception.code,
        message: exception.message,
        data: null,
      });
    }

    // class-validator BadRequestException → 1001
    if (exception instanceof BadRequestException) {
      const res = exception.getResponse() as any;
      const message = Array.isArray(res?.message) ? res.message[0] : res?.message ?? 'Invalid params';
      return response.status(200).json({
        code: BusinessErrorCode.INVALID_PARAMS,
        message,
        data: null,
      });
    }

    this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    return response.status(200).json({
      code: BusinessErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
}
