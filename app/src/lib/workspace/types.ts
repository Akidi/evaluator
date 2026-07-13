import type { VarRow, RuleRow, CustomFnRow } from '$lib/formula';

export type FormulaCell = {
	id: string;
	type: 'formula';
	expr: string;
	xVar?: string;
	xRange?: { min: number; max: number };
};

export type StepperCell = {
	id: string;
	type: 'stepper';
	rules: RuleRow[];
	steps: number;
};

export type Cell = FormulaCell | StepperCell;

export type { VarRow, RuleRow, CustomFnRow };
