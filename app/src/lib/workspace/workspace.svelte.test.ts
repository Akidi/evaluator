import { describe, expect, test } from 'vitest';
import { createWorkspace } from './workspace.svelte';

describe('createWorkspace', () => {
	test('starts with one empty variable, function, and formula cell', () => {
		const ws = createWorkspace();
		expect(ws.variables.length).toBe(1);
		expect(ws.functions.length).toBe(1);
		expect(ws.cells.length).toBe(1);
		expect(ws.cells[0].type).toBe('formula');
	});

	test('addCell appends a cell of the requested type', () => {
		const ws = createWorkspace();
		ws.addCell('stepper');
		expect(ws.cells.length).toBe(2);
		const last = ws.cells.at(-1)!;
		expect(last.type).toBe('stepper');
		if (last.type === 'stepper') {
			expect(last.rules.length).toBe(1);
			expect(last.steps).toBe(5);
		}
	});

	test('removeCell removes by id', () => {
		const ws = createWorkspace();
		ws.addCell('formula');
		const id = ws.cells[0].id;
		ws.removeCell(id);
		expect(ws.cells.some((c) => c.id === id)).toBe(false);
	});

	test('moveCell swaps a cell with its neighbor', () => {
		const ws = createWorkspace();
		ws.addCell('stepper'); // now [formula, stepper]
		const stepperId = ws.cells[1].id;
		ws.moveCell(stepperId, -1);
		expect(ws.cells[0].id).toBe(stepperId);
	});

	test('moveCell is a no-op at the boundary', () => {
		const ws = createWorkspace();
		ws.addCell('stepper');
		const firstId = ws.cells[0].id;
		ws.moveCell(firstId, -1);
		expect(ws.cells[0].id).toBe(firstId);
	});

	test('addVariable and removeVariable adjust the variable list', () => {
		const ws = createWorkspace();
		ws.addVariable();
		expect(ws.variables.length).toBe(2);
		ws.removeVariable(0);
		expect(ws.variables.length).toBe(1);
	});

	test('loadFunctions does not throw when localStorage contains invalid JSON', () => {
		const ws = createWorkspace();
		const initialFunctionCount = ws.functions.length;

		// Mock localStorage.getItem to return invalid JSON
		const originalGetItem = localStorage.getItem;
		localStorage.getItem = () => 'not valid json{';

		// Should not throw
		expect(() => ws.loadFunctions()).not.toThrow();

		// Functions array should still be valid and unchanged
		expect(Array.isArray(ws.functions)).toBe(true);
		expect(ws.functions.length).toBe(initialFunctionCount);

		// Restore localStorage
		localStorage.getItem = originalGetItem;
	});
});
