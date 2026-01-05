import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle Prisma errors
    if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;

      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          message = 'A record with this data already exists';
          error = 'Unique Constraint Violation';
          break;
        case 'P2003': // Foreign key constraint violation
          message = this.getForeignKeyErrorMessage(exception.meta);
          error = 'Foreign Key Constraint Violation';
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          error = 'Record Not Found';
          break;
        default:
          message = exception.message;
          error = `Prisma Error: ${exception.code}`;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object' && errorResponse !== null) {
        message = (errorResponse as any).message || message;
        error = (errorResponse as any).error || error;
      } else {
        message = errorResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.constructor.name;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      error,
      message,
    });
  }

  private getForeignKeyErrorMessage(meta?: any): string {
    if (meta && meta.target) {
      const target = Array.isArray(meta.target)
        ? meta.target.join(', ')
        : meta.target;
      return `Cannot perform this action because it would violate a relationship with ${target}. The related record is still being used.`;
    }
    return 'Cannot perform this action due to a foreign key constraint violation. The related record is still being used.';
  }
}
