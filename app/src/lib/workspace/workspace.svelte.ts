import { getContext, setContext } from 'svelte';
import { browser } from '$app/env';
import { fillMissingVarsForCustomFns, type VarRow, type CustomFnRow } from '$lib/formula';
import type { Cell } from './types';

const KEY = Symbol('workspace');
const FN_STORAGE_KEY = 'formula.customFns';

let counter = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${counter++}`;

export function newId(prefix: string): string {
	return uid(prefix);
}

function makeCell(type: 'formula' | 'stepper'): Cell {
	return type === 'formula'
		? { id: uid('cell'), type: 'formula', expr: '' }
		: {
				id: uid('cell'),
				type: 'stepper',
				rules: [{ id: uid('rule'), variable: '', inc: '', div: '' }],
				steps: 5
			};
}

export interface Workspace {
	readonly variables: VarRow[];
	readonly functions: CustomFnRow[];
	readonly debouncedVariables: VarRow[];
	readonly debouncedFunctions: CustomFnRow[];
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
	const variables = $state<VarRow[]>([{ id: uid('var'), name: '', value: '' }]);
	const functions = $state<CustomFnRow[]>([{ name: '', expr: '', params: '' }]);
	const cells = $state<Cell[]>([makeCell('formula')]);

	// Debounced mirrors of `variables`/`functions` so that the expensive
	// fan-out (every formula cell re-evaluating + re-sweeping, every stepper
	// cell re-running) doesn't happen synchronously on every keystroke in the
	// ScopeBar. UI that binds directly to `variables`/`functions` stays live;
	// only the per-cell computations should read the debounced copies.
	const debouncedVariables = $state<VarRow[]>(variables.map((v) => ({ ...v })));
	const debouncedFunctions = $state<CustomFnRow[]>(functions.map((f) => ({ ...f })));
	let varsFnsTimer: ReturnType<typeof setTimeout>;
	// createWorkspace() is called once from Notebook.svelte during component
	// init, but it's also called directly by unit tests (and could in
	// principle be called from other non-component code). A bare `$effect`
	// requires an enclosing effect tree and throws `effect_orphan` outside of
	// one, so wrap it in `$effect.root()` — the standard Svelte 5 idiom for
	// effects owned by a non-component module — to make it work regardless of
	// calling context.
	$effect.root(() => {
		$effect(() => {
			const nextVars = variables.map((v) => ({ ...v }));
			const nextFns = functions.map((f) => ({ ...f }));
			clearTimeout(varsFnsTimer);
			varsFnsTimer = setTimeout(() => {
				debouncedVariables.splice(0, debouncedVariables.length, ...nextVars);
				debouncedFunctions.splice(0, debouncedFunctions.length, ...nextFns);
			}, 120);
			return () => clearTimeout(varsFnsTimer);
		});
	});

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
		get debouncedVariables() {
			return debouncedVariables;
		},
		get debouncedFunctions() {
			return debouncedFunctions;
		},
		get cells() {
			return cells;
		},
		addVariable() {
			variables.push({ id: uid('var'), name: '', value: '' });
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
			for (const v of variables) {
				if (!v.id) v.id = uid('var');
			}
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
