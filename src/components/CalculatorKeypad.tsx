import type { CalcKey } from '../lib/calculator';
import { cn } from '../lib/utils';
import { CalculatorButton } from './CalculatorButton';

interface CalculatorKeypadProps {
  keys: CalcKey[];
  onPress: (key: CalcKey) => void;
  keyTextClass: (key: CalcKey) => string;
}

const renderMainLabel = (label: string) => {
  const [base, exponent] = label.split('^');
  if (!label.includes('^') || exponent === undefined || exponent.length === 0) {
    return label;
  }

  return (
    <>
      {base}
      <sup className="-top-1 relative text-[0.72em]">{exponent}</sup>
    </>
  );
};

export function CalculatorKeypad({ keys, onPress, keyTextClass }: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-5 gap-x-1.5 gap-y-1.5">
      {keys.map((key) => (
        <div key={`${key.label}-${key.legend || 'plain'}`} className="relative min-h-[44px] pt-2">
          {key.legend ? (
            <span className="pointer-events-none absolute left-1/2 -top-1 -translate-x-1/2 text-[9px] font-extrabold leading-none tracking-[0.02em] text-[#f59e0b]">
              {key.legend}
            </span>
          ) : null}
          <CalculatorButton
            onClick={() => onPress(key)}
            className="h-8 w-full rounded-[9px] px-1"
          >
            <span className={cn('relative font-bold uppercase', keyTextClass(key))}>
              {renderMainLabel(key.label)}
            </span>
          </CalculatorButton>
        </div>
      ))}
    </div>
  );
}
