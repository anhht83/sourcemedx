import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidationError } from 'class-validator';

interface ValidationResponse {
  message: ValidationError[] | string | Record<string, string[]>;
  error: string;
  statusCode: number;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const validationResponse = exception.getResponse() as ValidationResponse;
    let formattedErrors: Record<string, string[]> = {};

    if (
      Array.isArray(validationResponse.message) &&
      this.isValidationErrorArray(validationResponse.message)
    ) {
      formattedErrors = this.formatValidationErrors(validationResponse.message);
    } else if (
      typeof validationResponse.message === 'object' &&
      !Array.isArray(validationResponse.message)
    ) {
      formattedErrors = validationResponse.message;
    } else {
      formattedErrors = {
        message: [validationResponse.message as string],
      };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: formattedErrors,
    });
  }

  private isValidationErrorArray(arr: unknown[]): arr is ValidationError[] {
    if (arr.length === 0) return true;
    const firstItem = arr[0] as Record<string, unknown>;
    return (
      firstItem &&
      typeof firstItem === 'object' &&
      'property' in firstItem &&
      'constraints' in firstItem
    );
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        formattedErrors[error.property] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        const childErrors = this.formatValidationErrors(error.children);
        Object.keys(childErrors).forEach((key) => {
          formattedErrors[`${error.property}.${key}`] = childErrors[key];
        });
      }
    });

    return formattedErrors;
  }
}
