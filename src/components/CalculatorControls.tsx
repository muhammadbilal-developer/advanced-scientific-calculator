import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { UtilityButton } from '../lib/calculator';
import { CalculatorButton } from './CalculatorButton';

interface CalculatorControlsProps {
  leftButtons: UtilityButton[];
  rightButtons: UtilityButton[];
  onHistoryToggle: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

export function CalculatorControls({
  leftButtons,
  rightButtons,
  onHistoryToggle,
  onMoveLeft,
  onMoveRight,
}: CalculatorControlsProps) {
  return (
    <div className="mb-5 grid grid-cols-[54px_1fr_54px] items-center gap-2">
      <div className="rounded-[20px] bg-white/20 px-1.5 py-2 shadow-[inset_0_1px_4px_rgba(255,255,255,0.24)]">
        <div className="flex flex-col gap-2">
          {leftButtons.map((button) => (
            <CalculatorButton
              key={button.label}
              onClick={button.action}
              active={button.active}
              className="h-8 px-1 text-[9px] font-bold tracking-[0.1em]"
            >
              {button.label}
            </CalculatorButton>
          ))}
        </div>
      </div>

      <div className="relative flex justify-center">
        <div className="h-[92px] w-[92px] rounded-full border-[5px] border-[#7e7f82] bg-[#97989a] shadow-[0_9px_14px_rgba(58,61,66,0.24)]">
          <button
            aria-label="History"
            className="absolute left-1/2 top-[6px] -translate-x-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
            onClick={onHistoryToggle}
          >
            <ChevronUp size={18} />
          </button>
          <button className="absolute bottom-[6px] left-1/2 -translate-x-1/2 text-[#5e6165] transition-colors hover:text-[#404347]">
            <ChevronDown size={18} />
          </button>
          <button
            aria-label="Move left"
            className="absolute left-[6px] top-1/2 -translate-y-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
            onClick={onMoveLeft}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Move right"
            className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
            onClick={onMoveRight}
          >
            <ChevronRight size={18} />
          </button>
          <div className="flex h-full items-center justify-center text-[11px] font-black uppercase tracking-[0.2em] text-[#5a5d61]">
            Replay
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-white/20 px-1.5 py-2 shadow-[inset_0_1px_4px_rgba(255,255,255,0.24)]">
        <div className="flex flex-col gap-2">
          {rightButtons.map((button) => (
            <CalculatorButton
              key={button.label}
              onClick={button.action}
              active={button.active}
              className="h-8 px-1 text-[9px] font-bold tracking-[0.1em]"
            >
              {button.label}
            </CalculatorButton>
          ))}
        </div>
      </div>
    </div>
  );
}
