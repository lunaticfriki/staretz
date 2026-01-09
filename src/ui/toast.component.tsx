import { useMemo } from 'preact/hooks';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { ErrorViewModel } from './viewModels/error.viewModel';
import { MdClose, MdError } from 'react-icons/md';

export function Toast() {
  const viewModel = useMemo(() => container.get<ErrorViewModel>(TYPES.ErrorViewModel), []);
  const message = viewModel.errorMessage.value;

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-red-600 text-white px-4 py-3 rounded shadow-lg animate-bounce-in">
      <MdError size={24} />
      <span>{message}</span>
      <button
        onClick={viewModel.dismiss}
        className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <MdClose size={20} />
      </button>
    </div>
  );
}
