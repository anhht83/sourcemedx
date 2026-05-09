import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';

interface PostgresError {
  code: string;
  detail: string;
  table: string;
  constraint: string;
}

@Catch(QueryFailedError, TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError | TypeORMError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';

    // Handle specific database errors
    if (exception instanceof QueryFailedError) {
      const err = exception.driverError as PostgresError;

      // Duplicate entry error
      if (err.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
      }
      // Foreign key violation
      else if (err.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Referenced record does not exist';
      }
      // Not null violation
      else if (err.code === '23502') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Required field is missing';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        process.env.NODE_ENV === 'development' ? exception.message : undefined,
    });
  }
}
