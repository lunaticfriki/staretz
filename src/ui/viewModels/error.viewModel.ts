import { injectable, inject } from 'inversify';
import { signal } from '@preact/signals';
import { TYPES } from '../../di/types';
import { ErrorHandler } from '../../modules/shared/domain/ports/errorHandler.port';

@injectable()
export class ErrorViewModel {
  errorMessage = signal<string | null>(null);

  constructor(@inject(TYPES.ErrorHandler) private errorHandler: ErrorHandler) {
    this.subscribeToErrors();
  }

  private subscribeToErrors() {
    this.errorHandler.subscribe((error: Error) => {
      this.errorMessage.value = error.message;

      setTimeout(() => {
        this.dismiss();
      }, 5000);
    });
  }

  dismiss = () => {
    this.errorMessage.value = null;
  };
}
