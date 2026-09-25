// App-facing entry to the interpreter. Import from '#lib/formula' in routes/components.
export {
	Formulate,
	Lexer,
	Parser,
	Evaluator,
	Stepper,
	ProjectError,
	EvaluatorError,
	UndefinedVariableError,
	UndefinedFunctionError,
	InvalidOperandError,
	ArityMismatchError,
	FunctionRedefinitionError,
	DivisionByZeroError
} from '@formula/core';

export type {
	IFormulate,
	ILexer,
	IParser,
	IEvaluator,
	IStepper,
	Scope,
	EvalFn,
	Rule,
	Snapshot,
	StepResult
} from '@formula/core';
