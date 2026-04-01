import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../lib/utils';

interface CalculatorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function CalculatorButton({
  children,
  className,
  active,
  type,
  ...props
}: PropsWithChildren<CalculatorButtonProps>) {
  const resolvedType = type ?? 'button';

  return (
    <button
      {...props}
      type={resolvedType}
      className={cn(
        'relative rounded-lg bg-calc-navy text-white shadow-[0_4px_0_rgba(11,22,38,0.22)] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_rgba(11,22,38,0.22)]',
        active && 'bg-[#244872]',
        className
      )}
    >
      {children}
    </button>
  );
}
