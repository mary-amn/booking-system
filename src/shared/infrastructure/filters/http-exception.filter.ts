// src/shared/infrastructure/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Define a type for a structured error message, which is common with class-validator
interface StructuredErrorResponse {
  message: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string | string[] = 'An internal server error occurred';

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();

      // Check if the response is the structured object from class-validator or similar
      if (
        typeof errorResponse === 'object' &&
        errorResponse !== null &&
        'message' in errorResponse
      ) {
        // Safely access the message property
        errorMessage = (errorResponse as StructuredErrorResponse).message;
      } else if (typeof errorResponse === 'string') {
        // Handle plain string responses
        errorMessage = errorResponse;
      }
    } else if (exception instanceof Error) {
      // Handle generic JavaScript/TypeORM errors
      errorMessage = exception.message;
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
    };

    response.status(status).json(responseBody);
  }
}
