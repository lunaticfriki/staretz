import { injectable } from 'inversify';
import { ErrorHandler } from '../domain/ports/errorHandler.port';
import { ConsoleErrorHandler } from './adapters/consoleErrorHandler.adapter';
import { UiErrorHandler } from './adapters/uiErrorHandler.adapter';

@injectable()
export class AppErrorHandler extends ErrorHandler {
  private consoleHandler = new ConsoleErrorHandler();
  private uiHandler = new UiErrorHandler();

  handle(error: Error): void {
    this.consoleHandler.handle(error);
    this.uiHandler.handle(error);
  }

  subscribe(callback: (error: Error) => void): () => void {
    return this.uiHandler.subscribe(callback);
  }
}
