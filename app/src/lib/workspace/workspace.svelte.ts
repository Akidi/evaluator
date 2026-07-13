import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import { fillMissingVarsForCustomFns, type VarRow, type CustomFnRow } from '$lib/formula';
import type { Cell } from './types';

const KEY = Symbol('workspace');
const FN_STORAGE_KEY = 'formula.customFns';

let counter = 0;
const uid = () => `cell-${Date.now().toString(36)}-${counter++}`;

function makeCell(type: 'formula' | 'stepper'): Cell {
	return type === 'formula'
		? { id: uid(), type: 'formula', expr: '' }
		: { id: uid(), type: 'stepper', rules: [{ variable: '', inc: '', div: '' }], steps: 5 };
}

export interface Workspace {
	readonly variables: VarRow[];
	readonly functions: CustomFnRow[];
	readonly cells: Cell[];
	addVariable(): void;
	removeVariable(i: number): void;
	addFunction(): void;
	removeFunction(i: number): void;
	persistFunctions(): void;
	loadFunctions(): void;
	refreshDerivedVars(): void;
	addCell(type: 'formula' | 'stepper'): void;
	removeCell(id: string): void;
	moveCell(id: string, dir: -1 | 1): void;
}

export function createWorkspace(): Workspace {
	const variables = $state<VarRow[]>([{ name: '', value: '' }]);
	const functions = $state<CustomFnRow[]>([{ name: '', expr: '', params: '' }]);
	const cells = $state<Cell[]>([makeCell('formula')]);

	function persistFunctions() {
		if (!browser) return;
		const toSave = functions.filter((f) => f.name.trim() !== '' && f.expr.trim() !== '');
		localStorage.setItem(FN_STORAGE_KEY, JSON.stringify(toSave));
	}

	function loadFunctions() {
		if (!browser) return;
		const raw = localStorage.getItem(FN_STORAGE_KEY);
		if (!raw) return;
		try {
			const parsed: Partial<CustomFnRow>[] = JSON.parse(raw);
			functions.splice(
				0,
				functions.length,
				...parsed.map((f) => ({ name: f.name ?? '', expr: f.expr ?? '', params: f.params ?? '' }))
			);
			if (functions.length === 0) functions.push({ name: '', expr: '', params: '' });
		} catch {
			// Silent fail on corrupted localStorage
			return;
		}
	}

	return {
		get variables() {
			return variables;
		},
		get functions() {
			return functions;
		},
		get cells() {
			return cells;
		},
		addVariable() {
			variables.push({ name: '', value: '' });
		},
		removeVariable(i: number) {
			variables.splice(i, 1);
		},
		addFunction() {
			functions.push({ name: '', expr: '', params: '' });
		},
		removeFunction(i: number) {
			functions.splice(i, 1);
			persistFunctions();
		},
		persistFunctions,
		loadFunctions,
		refreshDerivedVars() {
			fillMissingVarsForCustomFns(variables, functions);
		},
		addCell(type) {
			cells.push(makeCell(type));
		},
		removeCell(id: string) {
			const i = cells.findIndex((c) => c.id === id);
			if (i >= 0) cells.splice(i, 1);
		},
		moveCell(id: string, dir: -1 | 1) {
			const i = cells.findIndex((c) => c.id === id);
			const j = i + dir;
			if (i < 0 || j < 0 || j >= cells.length) return;
			[cells[i], cells[j]] = [cells[j], cells[i]];
		}
	};
}

export function setWorkspace(ws: Workspace = createWorkspace()): Workspace {
	setContext(KEY, ws);
	return ws;
}

export function getWorkspace(): Workspace {
	return getContext<Workspace>(KEY);
}
