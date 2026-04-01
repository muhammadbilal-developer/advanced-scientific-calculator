import { describe, expect, it } from 'vitest';
import {
  addToMemory,
  applyOperatorInput,
  evaluateCalculatorExpression,
  getCurrentNumericValue,
  insertAtCursor,
  normalizeExpression,
  resolveEngineeringText,
  resolveMemoryAddition,
  resolveRecallText,
  toEngineeringNotation,
  toFiniteNumber,
} from '../lib/calculator';

describe('calculator helpers', () => {
  it('normalizes calculator symbols into mathjs input', () => {
    expect(normalizeExpression('3\u00d74+Ans+\u03c0', '9')).toBe('3*4+9+pi');
  });

  it.each([
    ['2+6', '0', '8'],
    ['100-45.5', '0', '54.5'],
    ['12\u00d712', '0', '144'],
    ['9\u00f74', '0', '2.25'],
    ['2+3\u00d74', '0', '14'],
  ])('evaluates arithmetic %s', (expression, lastAnswer, expected) => {
    expect(evaluateCalculatorExpression(expression, lastAnswer)).toBe(expected);
  });

  it.each([
    ['\u221a(144)', '0', '12'],
    ['5^2', '0', '25'],
    ['2^3', '0', '8'],
    ['-5+8', '0', '3'],
    ['4^-1', '0', '0.25'],
  ])('evaluates scientific expression %s', (expression, lastAnswer, expected) => {
    expect(evaluateCalculatorExpression(expression, lastAnswer)).toBe(expected);
  });

  it.each([
    ['sin(30)', '0', '0.5'],
    ['cos(60)', '0', '0.5'],
    ['tan(45)', '0', '1'],
    ['log(100)', '0', '2'],
    ['ln(1)', '0', '0'],
  ])('evaluates trig/log expression %s', (expression, lastAnswer, expected) => {
    expect(evaluateCalculatorExpression(expression, lastAnswer)).toBe(expected);
  });

  it('substitutes Ans with the last computed answer', () => {
    expect(evaluateCalculatorExpression('Ans+1', '41')).toBe('42');
  });

  it('inserts text at the cursor without losing the existing expression', () => {
    expect(insertAtCursor('12+4', 2, '7', false)).toEqual({
      display: '127+4',
      cursorPos: 3,
    });
  });

  it('replaces the demo expression when requested', () => {
    expect(insertAtCursor('65', 2, '3', true)).toEqual({
      display: '3',
      cursorPos: 1,
    });
  });

  it('replaces repeated operators instead of stacking them', () => {
    expect(applyOperatorInput('1+', 2, '+')).toEqual({
      display: '1+',
      cursorPos: 2,
      changed: true,
    });

    expect(applyOperatorInput('1+', 2, '\u00f7')).toEqual({
      display: '1\u00f7',
      cursorPos: 2,
      changed: true,
    });
  });

  it('allows a leading minus but blocks other empty operators', () => {
    expect(applyOperatorInput('', 0, '-')).toEqual({
      display: '-',
      cursorPos: 1,
      changed: true,
    });

    expect(applyOperatorInput('', 0, '+')).toEqual({
      display: '',
      cursorPos: 0,
      changed: false,
    });
  });

  it('formats engineering notation and memory helpers', () => {
    expect(toEngineeringNotation(1500)).toBe('1.5e3');
    expect(toFiniteNumber('12.5')).toBe(12.5);
    expect(resolveRecallText('0', '42')).toBe('42');
    expect(resolveRecallText('88', '42')).toBe('88');
    expect(resolveEngineeringText('1500', null, '0')).toBe('1.5e3');
    expect(resolveMemoryAddition('10+5', null, '0')).toBe(15);
    expect(addToMemory('5', 7)).toBe('12');
  });

  it('returns the current numeric value from the result when available', () => {
    expect(getCurrentNumericValue('10+5', '15', '0')).toBe(15);
  });
});
