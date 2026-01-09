import { injectable } from 'inversify';
import { ErrorHandler } from '../../domain/ports/errorHandler.port';

@injectable()
export class UiErrorHandler extends ErrorHandler {
  private listeners: Array<(error: Error) => void> = [];

  handle(error: Error): void {
    this.notifyListeners(error);
  }

  subscribe(callback: (error: Error) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(error: Error) {
    this.listeners.forEach((listener) => listener(error));
  }
}
