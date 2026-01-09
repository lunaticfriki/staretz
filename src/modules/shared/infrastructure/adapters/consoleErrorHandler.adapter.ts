import { injectable } from 'inversify';
import { ErrorHandler } from '../../domain/ports/errorHandler.port';

@injectable()
export class ConsoleErrorHandler extends ErrorHandler {
  handle(error: Error): void {
    console.error('[AppError]', error);
  }

  subscribe(): () => void {
    return () => {};
  }
}
