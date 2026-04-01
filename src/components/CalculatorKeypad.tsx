import type { CalcKey } from '../lib/calculator';
import { cn } from '../lib/utils';
import { CalculatorButton } from './CalculatorButton';

interface CalculatorKeypadProps {
  keys: CalcKey[];
  onPress: (key: CalcKey) => void;
  keyTextClass: (key: CalcKey) => string;
}

export function CalculatorKeypad({ keys, onPress, keyTextClass }: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-5 gap-x-1.5 gap-y-1.5">
      {keys.map((key) => (
        <div key={`${key.label}-${key.legend || 'plain'}`} className="min-h-[44px]">
          <CalculatorButton
            onClick={() => onPress(key)}
            className="h-8 w-full rounded-[9px] px-1"
          >
            <span className={cn('relative font-bold uppercase', keyTextClass(key))}>
              {key.label}
            </span>
          </CalculatorButton>
        </div>
      ))}
    </div>
  );
}
