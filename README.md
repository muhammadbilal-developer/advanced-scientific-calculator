# Advanced Scientific Calculator

<div align="center">
  <img src="./screenshot/main%20pages.png" alt="Advanced Scientific Calculator screenshot" width="1000" />
</div>

A responsive scientific calculator UI inspired by a classic Casio-style layout. It includes a realistic keypad, degree-based trigonometry, memory functions, keyboard support, and a compact mobile-friendly shell.

## Key Features

- Scientific calculator layout with a compact, phone-sized body
- Dedicated `Replay` D-pad and top utility buttons for `OPTN`, `SHIFT`, `MODE`, and `ALPHA`
- Navy-blue physical keys with separate legends for secondary functions
- Degree-mode trig support for `sin`, `cos`, and `tan`
- Standard math operations: addition, subtraction, multiplication, division, and operator replacement
- Scientific operations: square root, square, power, inverse, natural log, and base-10 log
- Memory behavior for `Ans`, `RCL`, `ENG`, and `M+`
- Cursor-based expression editing with keyboard support
- History drawer for recent calculations
- Responsive layout optimized for desktop and mobile
- Automated tests for calculator logic and reusable UI components

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- MathJS
- Vitest
- Testing Library

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The app starts on the Vite local dev server and is available at the URL shown in your terminal.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run TypeScript type checking
- `npm run test` - open Vitest in watch mode
- `npm run test:run` - run the test suite once

## Testing

The test suite lives in `src/tests` and covers:

- Arithmetic evaluation
- Scientific and power expressions
- Trigonometry and logarithms
- `Ans`, `RCL`, `ENG`, and memory behavior
- Operator replacement rules
- Reusable calculator components

Run the tests with:

```bash
npm run test:run
```

## Project Structure

```text
src/
  App.tsx
  components/
    CalculatorButton.tsx
    CalculatorControls.tsx
    CalculatorKeypad.tsx
  lib/
    calculator.ts
    utils.ts
  tests/
    calculator.test.ts
    components.test.tsx
    setup.ts
```

## Notes

- The calculator uses degree mode for trig functions.
- `Ans` stores the last successful calculation result.
- `RCL` recalls the current memory value if present, otherwise it falls back to `Ans`.
- `ENG` converts the current numeric value to engineering notation.
- The screen, keypad, and button spacing are tuned for a compact mobile-calculator look.

## Screenshot

The reference screenshot used for the current UI is stored in `screenshot/main pages.png`.
