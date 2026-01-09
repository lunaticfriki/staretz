import { injectable } from 'inversify';

@injectable()
export abstract class ErrorHandler {
  abstract handle(error: Error): void;
  abstract subscribe(callback: (error: Error) => void): () => void;
}
