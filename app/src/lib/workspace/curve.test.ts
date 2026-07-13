import { describe, expect, test } from 'vitest';
import { defaultXVar, sweepFormula, stepperSeries } from './curve';
import type { VarRow, CustomFnRow } from '$lib/formula';

const NO_FNS: CustomFnRow[] = [];

describe('defaultXVar', () => {
	test('returns the sole referenced variable', () => {
		expect(defaultXVar('level * 2')).toBe('level');
	});
	test('returns undefined when the formula references multiple variables', () => {
		expect(defaultXVar('a + b')).toBeUndefined();
	});
	test('returns undefined for a constant expression', () => {
		expect(defaultXVar('1 + 2')).toBeUndefined();
	});
});

describe('sweepFormula', () => {
	const vars: VarRow[] = [{ name: 'level', value: '1' }];
	test('samples the endpoints of an integer range for a linear formula', () => {
		const pts = sweepFormula('level * 2', vars, NO_FNS, 'level', { min: 1, max: 5 });
		expect(pts.length).toBe(5);
		expect(pts[0]).toEqual({ x: 1, y: 2 });
		expect(pts.at(-1)).toEqual({ x: 5, y: 10 });
	});
	test('returns [] for an invalid range', () => {
		expect(sweepFormula('level', vars, NO_FNS, 'level', { min: 5, max: 5 })).toEqual([]);
	});
	test('skips points where evaluation does not produce a finite number', () => {
		const pts = sweepFormula('1 / (level - 3)', vars, NO_FNS, 'level', { min: 1, max: 5 });
		// level=3 -> division yields non-finite; that point is dropped.
		expect(pts.every((p) => Number.isFinite(p.y))).toBe(true);
		expect(pts.some((p) => p.x === 3)).toBe(false);
	});
});

describe('stepperSeries', () => {
	test('produces one series per variable across the timeline', () => {
		const series = stepperSeries([
			{ step: 0, vars: { hp: 100, mp: 10 } },
			{ step: 1, vars: { hp: 110, mp: 12 } }
		]);
		expect(series.map((s) => s.name)).toEqual(['hp', 'mp']);
		expect(series[0].points).toEqual([
			{ x: 0, y: 100 },
			{ x: 1, y: 110 }
		]);
	});
	test('returns [] for an empty timeline', () => {
		expect(stepperSeries([])).toEqual([]);
	});
});
