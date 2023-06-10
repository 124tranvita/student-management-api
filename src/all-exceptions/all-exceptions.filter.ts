import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let message: string | object = '';
    let statusCode = 0;

    /** Get error message */
    if (exception instanceof HttpException) {
      /** Handle error from Http */
      const error = Object.assign(exception);
      message = error.response.message;
      statusCode = error.response.statusCode;
    } else if (exception instanceof Error) {
      /** Handle error from internal */
      const error = Object.assign(exception);

      switch (error.code) {
        case 11000:
          statusCode = 400;
          message = `Duplicate field value ${JSON.stringify(
            error.keyValue,
          ).replace(/"/g, '')}. Please use another value!`;
          break;
        default:
          message = {
            name: exception.name,
            msg: exception.message,
            stack: exception.stack,
          };
      }
    } else {
      message = 'Unknown Error.';
    }

    /** Exception response body */
    const responseBody = {
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
