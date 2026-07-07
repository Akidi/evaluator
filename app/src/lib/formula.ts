import { Formulate } from '$formula/formule';
import { Evaluator } from '$formula/evaluator/evaluator';
import { Stepper } from '$formula/stepper/stepper';
import { ProjectError } from '$formula/shared/errors';
import { Lexer } from '$formula/lexer/lexer';
import { Parser } from '$formula/parser/parser';
import type { StepResult } from '$formula/stepper/types';

export type VarRow = { name: string; value: string };
export type RuleRow = { variable: string; inc: string; div: string };
export type CustomFnRow = { name: string; expr: string; params: string };

export type EvalResult =
	| { ok: true; value: number | boolean }
	| { ok: false; error: string };

export type StepperResult =
	| { ok: true; result: StepResult }
	| { ok: false; error: string };

function describe(e: unknown): string {
	if (e instanceof ProjectError) return `${e.name}: ${e.message}`;
	if (e instanceof Error) return e.message;
	return String(e);
}

// Apply the shared variable table to an evaluator. Used by both the evaluator
// and the stepper so variables live in a single place.
function applyVars(evaluator: Evaluator, vars: VarRow[]): void {
	for (const { name, value } of vars) {
		const trimmed = name.trim();
		if (trimmed === '' || value.trim() === '') continue;
		evaluator.setVar(trimmed, Number(value));
	}
}

const lexer = new Lexer();
const parser = new Parser();

// The variable names an expression references directly (not through a nested
// function call). Falls back to an empty list if the expression doesn't parse —
// callers that need the real error will hit it when the expression is actually run.
export function getReferencedVars(expr: string): string[] {
	try {
		const tokens = lexer.scan(expr);
		const [, identList] = parser.parse(tokens);
		return [...new Set(identList.filter((i) => i.type === 'VAR').map((i) => i.name))];
	} catch {
		return [];
	}
}

// A custom function's declared params, e.g. "x, y" -> ["x", "y"]. Empty/blank
// entries are dropped so "x, , y" doesn't produce a phantom parameter.
export function getParamNames(params: string): string[] {
	return params
		.split(',')
		.map((p) => p.trim())
		.filter((p) => p !== '');
}

// Register each custom function so calling it re-evaluates its expression
// against the evaluator's live variables at call time (not just once, up front).
// Params are bound by shadowing: the evaluator has no call stack, so we save
// whatever the param names currently hold, overwrite them with the call's
// arguments, run the expression, then restore the saved values.
function applyCustomFns(evaluator: Evaluator, customFns: CustomFnRow[]): void {
	for (const { name, expr, params } of customFns) {
		const trimmedName = name.trim();
		if (trimmedName === '' || expr.trim() === '') continue;
		const paramNames = getParamNames(params);
		evaluator.defineFn(
			trimmedName,
			(...args) => {
				const saved = paramNames.map((p) => evaluator.getVar(p));
				paramNames.forEach((p, i) => evaluator.setVar(p, args[i]));
				try {
					return new Formulate(evaluator).run(expr);
				} finally {
					paramNames.forEach((p, i) => {
						const prior = saved[i];
						if (prior !== undefined) evaluator.setVar(p, prior);
						else evaluator.deleteVar(p);
					});
				}
			},
			paramNames.length
		);
	}
}

// Make sure every variable a custom function references exists, so calling it
// doesn't error with "undefined variable" just because the user hasn't added
// that variable yet. Defaults new variables to 1. Params are excluded since
// they're bound per-call, not read from the shared variable table.
export function fillMissingVarsForCustomFns(vars: VarRow[], customFns: CustomFnRow[]): void {
	const existing = new Set(vars.map((v) => v.name.trim()).filter((n) => n !== ''));
	for (const { expr, params } of customFns) {
		if (expr.trim() === '') continue;
		const paramNames = new Set(getParamNames(params));
		for (const name of getReferencedVars(expr)) {
			if (paramNames.has(name)) continue;
			if (!existing.has(name)) {
				vars.push({ name, value: '1' });
				existing.add(name);
			}
		}
	}
}

export function evaluate(formula: string, vars: VarRow[], customFns: CustomFnRow[] = []): EvalResult {
	try {
		const evaluator = new Evaluator();
		applyVars(evaluator, vars);
		applyCustomFns(evaluator, customFns);
		const value = new Formulate(evaluator).run(formula);
		return { ok: true, value };
	} catch (e) {
		return { ok: false, error: describe(e) };
	}
}

// The stepper's starting values come from the same shared variable table.
export function runStepper(
	rules: RuleRow[],
	steps: number,
	vars: VarRow[],
	customFns: CustomFnRow[] = []
): StepperResult {
	try {
		const evaluator = new Evaluator();
		applyVars(evaluator, vars);
		applyCustomFns(evaluator, customFns);
		const active = rules.filter((r) => r.variable.trim() !== '');
		const spec =
			active.map((r) => `${r.variable.trim()}|${r.inc.trim()}|${r.div.trim()}`).join(';') +
			';' +
			steps;
		const result = new Stepper(evaluator).run(spec);
		return { ok: true, result };
	} catch (e) {
		return { ok: false, error: describe(e) };
	}
}

export type BuiltInFn = { name: string; signature: string; arity: number; variadic?: boolean };

export const BUILT_IN_FNS: BuiltInFn[] = [
	{ name: 'sqrt', signature: 'sqrt(x)', arity: 1 },
	{ name: 'abs', signature: 'abs(x)', arity: 1 },
	{ name: 'pow', signature: 'pow(x, y)', arity: 2 },
	{ name: 'floor', signature: 'floor(x)', arity: 1 },
	{ name: 'ceil', signature: 'ceil(x)', arity: 1 },
	{ name: 'round', signature: 'round(x)', arity: 1 },
	{ name: 'log', signature: 'log(x)', arity: 1 },
	{ name: 'exp', signature: 'exp(x)', arity: 1 },
	{ name: 'min', signature: 'min(a, b, ...)', arity: 1, variadic: true },
	{ name: 'max', signature: 'max(a, b, ...)', arity: 1, variadic: true },
	{ name: 'random', signature: 'random(min, max)', arity: 0, variadic: true }
];
