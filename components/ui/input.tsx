import * as React from 'react';

import { cn } from '@/lib/utils';
import { InputSizeVariant } from '@/app/core/types/types';

interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  id: string;
  inputSize?: InputSizeVariant;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, label, error, inputSize = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-xs max-w-[10rem] w-full',
      md: 'text-sm max-w-[25rem] w-full',
      lg: 'text-base max-w-[50rem] w-full',
    };

    return (
      <div className={`mb-4 ${sizeClasses[inputSize]} `}>
        {label && (
          <label className="block mb-1 text-md" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            'flex min-h-[2.25rem] w-full rounded-md border border-input border-gray-300 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring focus:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

            className,
            `${error ? 'border-red-500' : ''}`
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
