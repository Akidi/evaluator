# Stepper Syntax Design

**Date:** 2026-06-29  
**Status:** Design (awaiting implementation)

## Overview

The **Stepper** applies incremental variable progression to an Evaluator over a fixed number of steps. Each variable follows its own rule: apply an increment formula every N steps, starting from the variable's current Evaluator value.

## Syntax

### Grammar

```
spec      := rule (';' rule)* ';' totalSteps
rule      := name '|' incrementFormula '|' divisor
totalSteps := integer (number of steps to run)
```

### Parsing Rules

- **Field separator:** `|` (pipe) separates three fields within a rule
- **Rule separator:** `;` (semicolon) separates rules and precedes the final step count
- **Simple splitting:** Split on `|` and `;` without depth tracking
  - Pipe is not used in formulas, so no conflicts
  - Commas inside function calls are transparent: `clamp(x, y, z)` parses cleanly
  - Colons inside ternary `x ? a : b` are transparent

### Examples

**Single rule, simple increment:**
```
Level|1|1; 3
```
- Variable: `Level`
- Increment: `1` (add 1 each step)
- Divisor: `1` (fire every step)
- Total steps: `3`

**Multiple rules, conditional firing:**
```
Level|1|1; CON|3|2; 4
```
- `Level` increases by 1 every step (4 total → 1 + 4)
- `CON` increases by 3 every 2nd step (fires on steps 2, 4 → 10 + 6)
- Total steps: `4`

**Ternary in formula:**
```
L|L < 5 ? 2 : 1|1; 3
```
- Variable: `L`
- Increment: `L < 5 ? 2 : 1` (conditional: +2 if L < 5, else +1)
- Divisor: `1` (every step)
- Total steps: `3`

**Formula with function calls:**
```
HP|clamp(CON, 0, 99)|1; 2
```
- Variable: `HP`
- Increment: `clamp(CON, 0, 99)` (function call with multiple args)
- Divisor: `1` (every step)
- Total steps: `2`

## Semantics

### Initialization

- Each tracked variable's **base value** is its current value on the Evaluator (set via `evaluator.setVar()` before calling `run()`)
- If a tracked variable has no value, throw `UndefinedVariableError`

### Execution

- Run for **totalSteps** iterations (1-indexed)
- On each step `i`:
  1. For each rule (left to right):
     - If `i % divisor === 0`, apply the increment
     - Evaluate `incrementFormula` against the current (evolving) Evaluator state
     - Add the result to the tracked variable's current value
  2. Capture a snapshot of all tracked variables
- Return both the final snapshot and the full timeline

### Evaluation Context

- Increment formulas are evaluated against the **current Evaluator state**, including:
  - All tracked variables at their current stepped values
  - Any non-tracked variables the user set (constants, helpers)
- Rules **apply in spec order** within each step (left-to-right)
  - Later rules can read earlier rules' updated values in the same step

### Snapshot Capture

- **Timeline includes step 0:** The base snapshot (all tracked vars before any increment)
- **Length:** `timeline.length === totalSteps + 1`
- **Tracked vars only:** Snapshots contain only the rule names; non-tracked setVars are excluded
- **Final:** Alias for the last snapshot

### Evaluator Mutation

- `run()` mutates the passed Evaluator's variables as it steps (reuses it to evaluate formulas)
- If this is undesirable, it's a design change (would require cloning the Evaluator per step)

## Implementation Notes

### Lexer/Parser Integration

- Stepper constructs its own Lexer and Parser instances
- Constructor: `new Stepper(evaluator)`
- Parser must implement **depth-aware splitting**:
  - Track nesting depth (parens, brackets, braces)
  - Only recognize `,` and `;` as delimiters at depth 0
  - Reject syntax errors (mismatched parens, incomplete rules)

### Types

```typescript
type Snapshot   = { step: number; vars: Record<string, number> };
type StepResult = { final: Record<string, number>; timeline: Snapshot[] };
interface IStepper { 
  run(spec: string): StepResult;
}
```

### Error Handling

| Error | Condition |
|-------|-----------|
| `UndefinedVariableError` | A tracked var has no base value on the Evaluator |
| `SyntaxError` | Malformed spec (unmatched parens, incomplete rule, etc.) |
| `DivisionByZeroError` | Divisor is 0 (if applicable) |
| Formula evaluation errors | Propagated from Evaluator (e.g., undefined var in formula) |

## Testing Strategy

Tests are organized by increasing complexity and cover:
1. Basic single-rule, simple increment
2. Timeline capture and step-0 base snapshot
3. Divisor-based firing (not every step)
4. Multiple concurrent rules
5. Cross-rule dependencies (rules reading other rules' values)
6. Ternary expressions (no escape hatch needed)
7. Function calls with multiple arguments
8. Error handling (undefined variables)
