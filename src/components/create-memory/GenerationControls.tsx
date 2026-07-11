import { Sparkles } from 'lucide-react';

import './GenerationControls.css';

type GenerationControlsProps = {
  disabled: boolean;
  isPreparing: boolean;
  isCreating: boolean;
  message: string;
  error: string;
};

export const GenerationControls = ({
  disabled,
  isPreparing,
  isCreating,
  message,
  error,
}: GenerationControlsProps) => (
  <>
    {error && (
      <p className="create-memory-form__error" role="alert">
        {error}
      </p>
    )}

    <button
      className={`create-memory-form__submit ${
        isCreating ? 'create-memory-form__submit--creating' : ''
      }`}
      type="submit"
      disabled={disabled}
      aria-busy={isCreating || isPreparing}
    >
      <Sparkles aria-hidden="true" size={18} />
      <span aria-live="polite">
        {isPreparing ? 'Preparing your photograph…' : message}
      </span>
    </button>
  </>
);
