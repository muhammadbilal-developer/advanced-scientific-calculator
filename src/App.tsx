/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as math from 'mathjs';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

type KeyType = 'number' | 'operator' | 'function' | 'action' | 'memory' | 'special';
type Mode = 'COMP' | 'MATRIX' | 'STAT';

interface CalcKey {
  label: string;
  legend?: string;
  value: string;
  type: KeyType;
  action?: () => void;
}

const INITIAL_DISPLAY = '65';
const INITIAL_RESULT = '65';
const OPERATORS = new Set(['+', '-', '×', '÷']);

export default function App() {
  const [display, setDisplay] = useState(INITIAL_DISPLAY);
  const [result, setResult] = useState<string | null>(INITIAL_RESULT);
  const [history, setHistory] = useState<Array<{ expr: string; res: string }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cursorPos, setCursorPos] = useState(INITIAL_DISPLAY.length);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [mode, setMode] = useState<Mode>('COMP');
  const [hasEdited, setHasEdited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cycleMode = () => {
    setMode((current) => {
      if (current === 'COMP') {
        return 'MATRIX';
      }

      if (current === 'MATRIX') {
        return 'STAT';
      }

      return 'COMP';
    });
  };

  const moveCursor = (direction: 'left' | 'right') => {
    if (direction === 'left' && cursorPos > 0) {
      setCursorPos(cursorPos - 1);
    }

    if (direction === 'right' && cursorPos < display.length) {
      setCursorPos(cursorPos + 1);
    }
  };

  const calculate = () => {
    try {
      const expression = display
        .replace(/\u00d7/g, '*')
        .replace(/\u00f7/g, '/')
        .replace(/\u03c0/g, 'pi')
        .replace(/\u221a/g, 'sqrt')
        .replace(/Ans/g, result || '0');

      const evaluation = math.evaluate(expression);
      const formatted =
        typeof evaluation === 'number'
          ? Number(evaluation.toFixed(10)).toString()
          : evaluation.toString();

      setResult(formatted);
      setHistory((prev) => [{ expr: display, res: formatted }, ...prev].slice(0, 12));
    } catch {
      setResult('Syntax ERROR');
    }
  };

  const handleKeyPress = (key: CalcKey) => {
    if (key.action) {
      key.action();
      return;
    }

    if (key.type === 'action') {
      if (key.value === 'AC') {
        setDisplay('');
        setResult(null);
        setCursorPos(0);
        setHasEdited(true);
      } else if (key.value === 'DEL') {
        if (cursorPos > 0) {
          const nextDisplay = display.slice(0, cursorPos - 1) + display.slice(cursorPos);
          setDisplay(nextDisplay);
          setCursorPos(cursorPos - 1);
          setHasEdited(true);
        }
      } else if (key.value === '=') {
        calculate();
      }
      return;
    }

    if (key.type === 'operator') {
      if (display.length === 0) {
        if (key.value === '-') {
          setDisplay('-');
          setCursorPos(1);
        }

        setResult(null);
        setHasEdited(true);
        setShift(false);
        setAlpha(false);
        return;
      }

      const isCursorAfterOperator = cursorPos > 0 && OPERATORS.has(display[cursorPos - 1] || '');
      const isCursorOnOperator = cursorPos < display.length && OPERATORS.has(display[cursorPos] || '');
      const replaceIndex = isCursorAfterOperator ? cursorPos - 1 : isCursorOnOperator ? cursorPos : -1;

      if (replaceIndex >= 0) {
        const nextDisplay = display.slice(0, replaceIndex) + key.value + display.slice(replaceIndex + 1);
        setDisplay(nextDisplay);
        setCursorPos(replaceIndex + 1);
      } else {
        const nextDisplay = display.slice(0, cursorPos) + key.value + display.slice(cursorPos);
        setDisplay(nextDisplay);
        setCursorPos(cursorPos + key.value.length);
      }

      setResult(null);
      setHasEdited(true);
      setShift(false);
      setAlpha(false);
      return;
    }

    const shouldReplaceDemo = !hasEdited && display === INITIAL_DISPLAY && result === INITIAL_RESULT;
    const nextDisplay = shouldReplaceDemo
      ? key.value
      : display.slice(0, cursorPos) + key.value + display.slice(cursorPos);

    setDisplay(nextDisplay);
    setCursorPos(shouldReplaceDemo ? key.value.length : cursorPos + key.value.length);
    setResult(null);
    setHasEdited(true);
    setShift(false);
    setAlpha(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        moveCursor('left');
        return;
      }

      if (event.key === 'ArrowRight') {
        moveCursor('right');
        return;
      }

      if (event.key === 'Backspace') {
        handleKeyPress({ label: 'DEL', value: 'DEL', type: 'action' });
        return;
      }

      if (event.key === 'Enter') {
        handleKeyPress({ label: '=', value: '=', type: 'action' });
        return;
      }

      if (event.key === 'Escape') {
        handleKeyPress({ label: 'AC', value: 'AC', type: 'action' });
        return;
      }

      if (/^[0-9]$/.test(event.key)) {
        handleKeyPress({ label: event.key, value: event.key, type: 'number' });
        return;
      }

      if (['+', '-', '*', '/'].includes(event.key)) {
        const value = event.key === '*' ? '\u00d7' : event.key === '/' ? '\u00f7' : event.key;
        handleKeyPress({ label: value, value, type: 'operator' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursorPos, display, hasEdited, result]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollLeft = Math.max(0, cursorPos * 14 - 140);
  }, [cursorPos, display]);

  const leftUtilityButtons = [
    {
      label: 'OPTN',
      action: () => setShowHistory((current) => !current),
      active: showHistory,
    },
    {
      label: 'SHIFT',
      action: () => setShift((current) => !current),
      active: shift,
    },
  ];

  const rightUtilityButtons = [
    {
      label: 'MODE',
      action: cycleMode,
      active: false,
    },
    {
      label: 'ALPHA',
      action: () => setAlpha((current) => !current),
      active: alpha,
    },
  ];

  const keys: CalcKey[] = [
    { label: 'ON', value: 'ON', type: 'special', action: () => {
      setDisplay('');
      setResult(null);
      setCursorPos(0);
      setHasEdited(true);
    } },
    { label: 'CALC', legend: 'SOLVE', value: 'calc(', type: 'function' },
    { label: '\u222bdx', legend: 'd/dx', value: 'integrate(', type: 'function' },
    { label: 'x^-1', legend: 'x!', value: '^-1', type: 'function' },
    { label: 'log', legend: 'log_a', value: 'log(', type: 'function' },

    { label: '\u221a', legend: '\u221b', value: 'sqrt(', type: 'function' },
    { label: 'x^2', legend: 'x^3', value: '^2', type: 'function' },
    { label: 'x^y', legend: 'y\u221ax', value: '^', type: 'function' },
    { label: 'ln', legend: 'e^x', value: 'ln(', type: 'function' },
    { label: '(-)', legend: 'A', value: '-', type: 'number' },

    { label: 'hyp', legend: 'C', value: 'hyp(', type: 'function' },
    { label: 'sin', legend: 'D', value: 'sin(', type: 'function' },
    { label: 'cos', legend: 'E', value: 'cos(', type: 'function' },
    { label: 'tan', legend: 'F', value: 'tan(', type: 'function' },
    { label: 'RCL', legend: 'STO', value: 'RCL', type: 'memory' },

    { label: 'ENG', legend: '\u2190', value: 'ENG', type: 'memory' },
    { label: '(', legend: '%', value: '(', type: 'operator' },
    { label: ')', legend: ',', value: ')', type: 'operator' },
    { label: 'S\u21d4D', legend: 'a b/c', value: 'S<->D', type: 'function' },
    { label: 'M+', legend: 'M', value: 'M+', type: 'memory' },

    { label: '7', legend: 'MATRIX', value: '7', type: 'number' },
    { label: '8', legend: 'VECTOR', value: '8', type: 'number' },
    { label: '9', legend: 'CLR', value: '9', type: 'number' },
    { label: 'DEL', legend: 'INS', value: 'DEL', type: 'action' },
    { label: 'AC', legend: 'OFF', value: 'AC', type: 'action' },

    { label: '4', legend: 'STAT', value: '4', type: 'number' },
    { label: '5', legend: 'COMPLX', value: '5', type: 'number' },
    { label: '6', legend: 'BASE', value: '6', type: 'number' },
    { label: '\u00d7', legend: 'nPr', value: '\u00d7', type: 'operator' },
    { label: '\u00f7', legend: 'nCr', value: '\u00f7', type: 'operator' },

    { label: '1', legend: 'And', value: '1', type: 'number' },
    { label: '2', legend: 'Ran#', value: '2', type: 'number' },
    { label: '3', legend: '\u03c0', value: '3', type: 'number' },
    { label: '+', legend: 'Pol', value: '+', type: 'operator' },
    { label: '-', legend: 'Rec', value: '-', type: 'operator' },

    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: 'x10^', value: '*10^', type: 'function' },
    { label: 'Ans', legend: 'DRG', value: 'Ans', type: 'memory' },
    { label: '=', value: '=', type: 'action' },
  ];

  const keyTextClass = (key: CalcKey) => {
    if (key.label.length >= 4) {
      return 'text-[10px] tracking-[0.12em]';
    }

    if (key.type === 'number' && key.label.length === 1) {
      return 'text-[17px] tracking-[0.05em]';
    }

    return 'text-[13px] tracking-[0.09em]';
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f7f8fa_0%,#e4e7ec_48%,#d8dde4_100%)] px-3 py-5 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-[344px] rounded-[38px] border-[6px] border-calc-rim bg-calc-rim p-[6px] shadow-[0_20px_42px_rgba(15,23,42,0.32)]"
      >
        <div className="rounded-[30px] border-t border-white/70 bg-calc-body px-5 pb-5 pt-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-[29px] font-black leading-none tracking-[-0.06em] text-[#8d6530]">
                CASIO
              </h1>
              <p className="mt-1 text-[9px] font-bold tracking-[0.11em] text-calc-label">
                fx-991ES PLUS
              </p>
              <p className="mt-1 text-[10px] font-black tracking-[0.07em] text-[#111827]">
                NATURAL-V.P.A.M.
              </p>
            </div>

            <div className="relative h-8 w-20 overflow-hidden rounded-sm bg-calc-solar shadow-[inset_0_1px_2px_rgba(0,0,0,0.32)]">
              <div className="grid h-full w-full grid-cols-4 gap-px opacity-55">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="bg-[#6a231b]/55" />
                ))}
              </div>
            </div>
          </div>

          <div className="relative mb-4 min-h-[118px] overflow-hidden rounded-md border-2 border-[#a9b3a8] bg-calc-screen px-3 py-3 shadow-[inset_0_2px_10px_rgba(58,71,57,0.14)]">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-calc-screen-ink/65">
              <span>{mode}</span>
              <div className="flex items-center gap-2">
                {shift && (
                  <span className="rounded-sm bg-[#d67d2f] px-1 text-[9px] text-white">S</span>
                )}
                {alpha && (
                  <span className="rounded-sm bg-[#b64d40] px-1 text-[9px] text-white">A</span>
                )}
                <span>Math</span>
                <span>Deg</span>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="relative z-10 overflow-x-auto whitespace-nowrap py-1 font-lcd text-[34px] leading-none text-calc-screen-ink scrollbar-hide"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const clickOffset = event.clientX - rect.left;
                const nextCursor = Math.min(display.length, Math.max(0, Math.round(clickOffset / 14)));
                setCursorPos(nextCursor);
              }}
            >
              <div className="flex min-h-[40px] items-center">
                {display.split('').map((character, index) => (
                  <span
                    key={`${character}-${index}`}
                    className="relative inline-flex min-w-[12px] justify-center"
                    onClick={(event) => {
                      event.stopPropagation();
                      setCursorPos(index);
                    }}
                  >
                    {index === cursorPos ? (
                      <motion.span
                        animate={{ opacity: [1, 0.1] }}
                        transition={{ duration: 0.85, repeat: Infinity }}
                        className="absolute -left-[2px] top-0 h-full w-[2px] bg-calc-screen-ink"
                      />
                    ) : null}
                    {character}
                  </span>
                ))}
                {cursorPos === display.length ? (
                  <motion.span
                    animate={{ opacity: [1, 0.1] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                    className="ml-0.5 inline-block h-8 w-[2px] bg-calc-screen-ink"
                  />
                ) : null}
              </div>
            </div>

            <div className="relative z-10 mt-3 border-t border-calc-screen-ink/20 pt-2 text-right font-lcd text-[30px] leading-none text-calc-screen-ink">
              {result ?? ''}
            </div>

            <AnimatePresence>
              {showHistory ? (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="absolute inset-0 z-20 bg-calc-screen px-3 py-2"
                >
                  <div className="mb-2 flex items-center justify-between border-b border-calc-screen-ink/20 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-calc-screen-ink">
                    <span>History</span>
                    <button onClick={() => setShowHistory(false)}>Close</button>
                  </div>

                  {history.length === 0 ? (
                    <p className="pt-6 text-center text-[10px] italic text-calc-screen-ink/70">
                      No history
                    </p>
                  ) : (
                    <div className="space-y-2 text-right text-calc-screen-ink">
                      {history.map((item, index) => (
                        <div key={`${item.expr}-${index}`} className="border-b border-calc-screen-ink/10 pb-1">
                          <div className="text-[10px] opacity-70">{item.expr}</div>
                          <div className="text-sm font-bold">{item.res}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,_#000_14%,_transparent_15%)] [background-size:3px_3px]" />
          </div>

          <div className="mb-5 grid grid-cols-[54px_1fr_54px] items-center gap-2">
            <div className="rounded-[20px] bg-white/20 px-1.5 py-2 shadow-[inset_0_1px_4px_rgba(255,255,255,0.24)]">
              <div className="flex flex-col gap-2">
                {leftUtilityButtons.map((button) => (
                  <button
                    key={button.label}
                    onClick={button.action}
                    className={cn(
                      'relative h-8 rounded-lg bg-calc-navy px-1 text-[9px] font-bold tracking-[0.1em] text-white shadow-[0_4px_0_rgba(11,22,38,0.22)] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_rgba(11,22,38,0.22)]',
                      button.active && 'bg-[#244872]'
                    )}
                  >
                    <span className="relative">{button.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="h-[92px] w-[92px] rounded-full border-[5px] border-[#7e7f82] bg-[#97989a] shadow-[0_9px_14px_rgba(58,61,66,0.24)]">
                <button
                  className="absolute left-1/2 top-[6px] -translate-x-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
                  onClick={() => setShowHistory((current) => !current)}
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  className="absolute bottom-[6px] left-1/2 -translate-x-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
                >
                  <ChevronDown size={18} />
                </button>
                <button
                  className="absolute left-[6px] top-1/2 -translate-y-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
                  onClick={() => moveCursor('left')}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="absolute right-[6px] top-1/2 -translate-y-1/2 text-[#5e6165] transition-colors hover:text-[#404347]"
                  onClick={() => moveCursor('right')}
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
                {rightUtilityButtons.map((button) => (
                  <button
                    key={button.label}
                    onClick={button.action}
                    className={cn(
                      'relative h-8 rounded-lg bg-calc-navy px-1 text-[9px] font-bold tracking-[0.1em] text-white shadow-[0_4px_0_rgba(11,22,38,0.22)] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_rgba(11,22,38,0.22)]',
                      button.active && 'bg-[#244872]'
                    )}
                  >
                    <span className="relative">{button.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-x-1.5 gap-y-1.5">
            {keys.map((key) => (
              <div key={`${key.label}-${key.legend || 'plain'}`} className="min-h-[44px]">
                <button
                  onClick={() => handleKeyPress(key)}
                  className="relative h-8 w-full rounded-[9px] bg-calc-navy text-white shadow-[0_4px_0_rgba(11,22,38,0.22)] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_rgba(11,22,38,0.22)]"
                >
                  <span className={cn('relative font-bold uppercase', keyTextClass(key))}>
                    {key.label}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
