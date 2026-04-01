import * as math from 'mathjs';

export type KeyType = 'number' | 'operator' | 'function' | 'action' | 'memory' | 'special';

export interface CalcKey {
  label: string;
  legend?: string;
  value: string;
  type: KeyType;
  action?: () => void;
}

export interface UtilityButton {
  label: string;
  active?: boolean;
  action: () => void;
}

export const INITIAL_DISPLAY = '65';
export const INITIAL_RESULT = '65';

export const OPERATORS = new Set(['+', '-', '\u00d7', '\u00f7']);

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) {
    return value.toString();
  }

  return Number(value.toFixed(10)).toString();
};

export const normalizeExpression = (display: string, lastAnswer: string): string =>
  display
    .replace(/\u00d7/g, '*')
    .replace(/\u00f7/g, '/')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/\u03c0/g, 'pi')
    .replace(/\u221a/g, 'sqrt')
    .replace(/Ans/g, lastAnswer)
    .replace(/\blog\(/g, 'log10(')
    .replace(/\bln\(/g, 'log(')
    .replace(/\bsin\(/g, 'sinDeg(')
    .replace(/\bcos\(/g, 'cosDeg(')
    .replace(/\btan\(/g, 'tanDeg(')
    .replace(/\basin\(/g, 'asinDeg(')
    .replace(/\bacos\(/g, 'acosDeg(')
    .replace(/\batan\(/g, 'atanDeg(')
    .replace(/\bdeg\(/g, 'degFn(')
    .replace(/\brand\(/g, 'randFn(')
    .replace(/\bnPr\(/g, 'nPrFn(')
    .replace(/\bnCr\(/g, 'nCrFn(')
    .replace(/\bpol\(/g, 'polFn(')
    .replace(/\brec\(/g, 'recFn(');

export const evaluateCalculatorExpression = (display: string, lastAnswer: string): string => {
  const scope = {
    sinDeg: (value: number) => Math.sin((value * Math.PI) / 180),
    cosDeg: (value: number) => Math.cos((value * Math.PI) / 180),
    tanDeg: (value: number) => Math.tan((value * Math.PI) / 180),
    asinDeg: (value: number) => (Math.asin(value) * 180) / Math.PI,
    acosDeg: (value: number) => (Math.acos(value) * 180) / Math.PI,
    atanDeg: (value: number) => (Math.atan(value) * 180) / Math.PI,
    degFn: (value: number) => value,
    randFn: () => Math.random(),
    nPrFn: (n: number, r: number) => math.permutations(n, r),
    nCrFn: (n: number, r: number) => math.combinations(n, r),
    polFn: (x: number, y: number) => {
      const radius = Math.hypot(x, y);
      const angle = (Math.atan2(y, x) * 180) / Math.PI;
      return [Number(radius.toFixed(10)), Number(angle.toFixed(10))];
    },
    recFn: (radius: number, angleDegrees: number) => {
      const angleRadians = (angleDegrees * Math.PI) / 180;
      const x = radius * Math.cos(angleRadians);
      const y = radius * Math.sin(angleRadians);
      return [Number(x.toFixed(10)), Number(y.toFixed(10))];
    },
    log10: (value: number) => Math.log10(value),
  };

  const evaluation = math.evaluate(normalizeExpression(display, lastAnswer), scope);
  return typeof evaluation === 'number' ? formatNumber(evaluation) : evaluation.toString();
};

export const insertAtCursor = (
  display: string,
  cursorPos: number,
  text: string,
  shouldReplaceDemo: boolean
): { display: string; cursorPos: number } => {
  if (shouldReplaceDemo) {
    return { display: text, cursorPos: text.length };
  }

  const nextDisplay = display.slice(0, cursorPos) + text + display.slice(cursorPos);
  return { display: nextDisplay, cursorPos: cursorPos + text.length };
};

export const applyOperatorInput = (
  display: string,
  cursorPos: number,
  operator: string
): { display: string; cursorPos: number; changed: boolean } => {
  if (display.length === 0) {
    if (operator === '-') {
      return { display: '-', cursorPos: 1, changed: true };
    }

    return { display, cursorPos, changed: false };
  }

  const isCursorAfterOperator = cursorPos > 0 && OPERATORS.has(display[cursorPos - 1] || '');
  const isCursorOnOperator = cursorPos < display.length && OPERATORS.has(display[cursorPos] || '');
  const replaceIndex = isCursorAfterOperator ? cursorPos - 1 : isCursorOnOperator ? cursorPos : -1;

  if (replaceIndex >= 0) {
    const nextDisplay = display.slice(0, replaceIndex) + operator + display.slice(replaceIndex + 1);
    return { display: nextDisplay, cursorPos: replaceIndex + 1, changed: true };
  }

  const nextDisplay = display.slice(0, cursorPos) + operator + display.slice(cursorPos);
  return { display: nextDisplay, cursorPos: cursorPos + operator.length, changed: true };
};

export const toEngineeringNotation = (value: number): string => {
  if (!Number.isFinite(value)) {
    return value.toString();
  }

  if (value === 0) {
    return '0';
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
  const mantissa = value / 10 ** exponent;
  return `${formatNumber(mantissa)}e${exponent}`;
};

export const toFiniteNumber = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getCurrentNumericValue = (
  display: string,
  result: string | null,
  lastAnswer: string
): number | null => {
  const fromResult = toFiniteNumber(result);
  if (fromResult !== null) {
    return fromResult;
  }

  try {
    return toFiniteNumber(evaluateCalculatorExpression(display, lastAnswer));
  } catch {
    return null;
  }
};

export const resolveRecallText = (memoryValue: string, lastAnswer: string): string =>
  memoryValue !== '0' ? memoryValue : lastAnswer;

export const resolveEngineeringText = (
  display: string,
  result: string | null,
  lastAnswer: string
): string | null => {
  const currentValue = getCurrentNumericValue(display, result, lastAnswer);
  return currentValue === null ? null : toEngineeringNotation(currentValue);
};

export const resolveMemoryAddition = (
  display: string,
  result: string | null,
  lastAnswer: string
): number | null => getCurrentNumericValue(display, result, lastAnswer);

export const addToMemory = (memory: string, value: number): string => {
  const current = Number(memory);
  const safeCurrent = Number.isFinite(current) ? current : 0;
  return formatNumber(safeCurrent + value);
};
