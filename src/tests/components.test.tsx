import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalculatorButton } from '../components/CalculatorButton';
import { CalculatorControls } from '../components/CalculatorControls';
import { CalculatorKeypad } from '../components/CalculatorKeypad';
import type { CalcKey, UtilityButton } from '../lib/calculator';

describe('reusable components', () => {
  it('renders and clicks a calculator button', () => {
    const onClick = vi.fn();
    render(
      <CalculatorButton onClick={onClick} className="h-8 px-2">
        TEST
      </CalculatorButton>
    );

    fireEvent.click(screen.getByRole('button', { name: 'TEST' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders keypad keys and forwards clicks', () => {
    const onPress = vi.fn();
    const keys: CalcKey[] = [
      { label: '1', value: '1', type: 'number' },
      { label: '+', value: '+', type: 'operator' },
    ];

    render(
      <CalculatorKeypad
        keys={keys}
        onPress={onPress}
        keyTextClass={() => 'text-sm'}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(onPress).toHaveBeenNthCalledWith(1, keys[0]);
    expect(onPress).toHaveBeenNthCalledWith(2, keys[1]);
  });

  it('renders control buttons and d-pad actions', () => {
    const leftButtons: UtilityButton[] = [
      { label: 'OPTN', action: vi.fn(), active: false },
      { label: 'SHIFT', action: vi.fn(), active: true },
    ];
    const rightButtons: UtilityButton[] = [
      { label: 'MODE', action: vi.fn(), active: false },
      { label: 'ALPHA', action: vi.fn(), active: true },
    ];
    const historyToggle = vi.fn();
    const moveLeft = vi.fn();
    const moveRight = vi.fn();

    render(
      <CalculatorControls
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        onHistoryToggle={historyToggle}
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'OPTN' }));
    fireEvent.click(screen.getByRole('button', { name: 'MODE' }));
    fireEvent.click(screen.getByRole('button', { name: 'History' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move left' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move right' }));

    expect(leftButtons[0].action).toHaveBeenCalledTimes(1);
    expect(rightButtons[0].action).toHaveBeenCalledTimes(1);
    expect(historyToggle).toHaveBeenCalledTimes(1);
    expect(moveLeft).toHaveBeenCalledTimes(1);
    expect(moveRight).toHaveBeenCalledTimes(1);
  });
});
