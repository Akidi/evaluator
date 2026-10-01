import { describe, expect, it, vi } from 'vitest';
import type { FnEntry, IFormulate, Scope } from '@formula/core';
import { Playground, type ScopeFnRow, type ScopeRow } from './playground.svelte';

// Records every call so tests can inspect the scope the Playground builds.
// scope/varScope/fnScope are private, so run() is the only seam to observe them.
const fakeFormulate = (returns: boolean | number = 0) => {
  const run = vi.fn<IFormulate['run']>(() => returns);
  return { formulate: { run } satisfies IFormulate, run };
};

const varRow = (over: Partial<ScopeRow> = {}): ScopeRow => ({
  id: crypto.randomUUID(),
  name: 'x',
  value: '1',
  enabled: true,
  ...over
});

const fnRow = (over: Partial<ScopeFnRow> = {}): ScopeFnRow => ({
  id: crypto.randomUUID(),
  name: 'f',
  params: '',
  body: '1',
  enabled: true,
  ...over
});

// Runs the playground once and returns the scope it handed to the evaluator.
const scopeOf = (pg: Playground, run: ReturnType<typeof fakeFormulate>['run']): Scope => {
  pg.run();
  return run.mock.calls.at(-1)![1]!;
};

const entryOf = (scope: Scope, name: string): FnEntry => {
  const entry = scope.get(name);
  if (typeof entry !== 'object') throw new Error(`expected ${name} to be a function entry`);
  return entry;
};

describe('Playground', () => {
  describe('initial state', () => {
    it('starts empty with no result and no error', () => {
      const pg = new Playground();

      expect(pg.formula).toBe('');
      expect(pg.result).toBeUndefined();
      expect(pg.error).toBe('');
      expect(pg.varRows).toEqual([]);
      expect(pg.fnRows).toEqual([]);
    });

    it('seeds rows from options', () => {
      const vars = [varRow({ name: 'a' })];
      const fns = [fnRow({ name: 'g' })];
      const pg = new Playground({ formulate: fakeFormulate().formulate, varRows: vars, fnRows: fns });

      expect(pg.varRows.map((r) => r.name)).toEqual(['a']);
      expect(pg.fnRows.map((r) => r.name)).toEqual(['g']);
    });

    it('uses an injected formulate instead of the default', () => {
      const { formulate, run } = fakeFormulate(42);
      const pg = new Playground({ formulate, varRows: [], fnRows: [] });
      pg.formula = 'anything';

      pg.run();

      expect(run).toHaveBeenCalledTimes(1);
      expect(pg.result).toBe(42);
    });
  });

  describe('run', () => {
    it('evaluates the current formula against the built scope', () => {
      const { formulate, run } = fakeFormulate(7);
      const pg = new Playground({ formulate, varRows: [], fnRows: [] });
      pg.formula = '1 + 6';

      pg.run();

      expect(run).toHaveBeenCalledWith('1 + 6', expect.any(Map));
      expect(pg.result).toBe(7);
      expect(pg.error).toBe('');
    });

    it.each([
      ['zero', 0],
      ['false', false],
      ['true', true]
    ])('keeps %s as a real result, not "no result"', (_label, value) => {
      const { formulate } = fakeFormulate(value);
      const pg = new Playground({ formulate, varRows: [], fnRows: [] });

      pg.run();

      expect(pg.result).toBe(value);
    });

    it('stores the message of a thrown Error without the "Error:" prefix', () => {
      const run = vi.fn<IFormulate['run']>(() => {
        throw new Error('Variable y is undefined.');
      });
      const pg = new Playground({ formulate: { run }, varRows: [], fnRows: [] });

      pg.run();

      expect(pg.error).toBe('Variable y is undefined.');
      expect(pg.result).toBeUndefined();
    });

    it('stringifies a thrown non-Error', () => {
      const run = vi.fn<IFormulate['run']>(() => {
        throw 'boom';
      });
      const pg = new Playground({ formulate: { run }, varRows: [], fnRows: [] });

      pg.run();

      expect(pg.error).toBe('boom');
    });

    it('clears a previous error when the next run succeeds', () => {
      const run = vi
        .fn<IFormulate['run']>()
        .mockImplementationOnce(() => {
          throw new Error('bad');
        })
        .mockImplementationOnce(() => 3);
      const pg = new Playground({ formulate: { run }, varRows: [], fnRows: [] });

      pg.run();
      expect(pg.error).toBe('bad');
      pg.run();

      expect(pg.error).toBe('');
      expect(pg.result).toBe(3);
    });

    it('clears a previous result when the next run fails', () => {
      const run = vi
        .fn<IFormulate['run']>()
        .mockImplementationOnce(() => 3)
        .mockImplementationOnce(() => {
          throw new Error('bad');
        });
      const pg = new Playground({ formulate: { run }, varRows: [], fnRows: [] });

      pg.run();
      expect(pg.result).toBe(3);
      pg.run();

      expect(pg.result).toBeUndefined();
      expect(pg.error).toBe('bad');
    });
  });

  describe('variable rows', () => {
    it('addVar appends an enabled row with a generated id', () => {
      const pg = new Playground();

      pg.addVar('LEVEL', '5');

      expect(pg.varRows).toHaveLength(1);
      expect(pg.varRows[0]).toMatchObject({ name: 'LEVEL', value: '5', enabled: true });
      expect(pg.varRows[0].id).toBeTruthy();
    });

    it('gives every added row a distinct id', () => {
      const pg = new Playground();

      pg.addVar('a', '1');
      pg.addVar('b', '2');

      expect(new Set(pg.varRows.map((r) => r.id)).size).toBe(2);
    });

    it('removeVar removes only the row with that id', () => {
      const pg = new Playground();
      pg.addVar('a', '1');
      pg.addVar('b', '2');
      const [a] = pg.varRows;

      pg.removeVar(a.id);

      expect(pg.varRows.map((r) => r.name)).toEqual(['b']);
    });

    it('removeVar with an unknown id changes nothing', () => {
      const pg = new Playground();
      pg.addVar('a', '1');

      pg.removeVar('does-not-exist');

      expect(pg.varRows).toHaveLength(1);
    });
  });

  describe('function rows', () => {
    it('addFn appends an enabled row with a generated id', () => {
      const pg = new Playground();

      pg.addFn('double', 'x', 'x * 2');

      expect(pg.fnRows).toHaveLength(1);
      expect(pg.fnRows[0]).toMatchObject({
        name: 'double',
        params: 'x',
        body: 'x * 2',
        enabled: true
      });
      expect(pg.fnRows[0].id).toBeTruthy();
    });

    it('removeFn removes only the row with that id', () => {
      const pg = new Playground();
      pg.addFn('a', '', '1');
      pg.addFn('b', '', '2');
      const [a] = pg.fnRows;

      pg.removeFn(a.id);

      expect(pg.fnRows.map((r) => r.name)).toEqual(['b']);
    });

    it('removeFn with an unknown id changes nothing', () => {
      const pg = new Playground();
      pg.addFn('a', '', '1');

      pg.removeFn('does-not-exist');

      expect(pg.fnRows).toHaveLength(1);
    });
  });

  describe('variable scope', () => {
    it('includes enabled variables as numbers', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'LEVEL', value: '5' })],
        fnRows: []
      });

      expect(scopeOf(pg, run).get('LEVEL')).toBe(5);
    });

    it('excludes disabled variables', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'off', enabled: false })],
        fnRows: []
      });

      expect(scopeOf(pg, run).has('off')).toBe(false);
    });

    it('excludes variables whose value is not a number', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'bad', value: 'abc' })],
        fnRows: []
      });

      expect(scopeOf(pg, run).has('bad')).toBe(false);
    });

    it('lets the last row win when two share a name', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'x', value: '1' }), varRow({ name: 'x', value: '2' })],
        fnRows: []
      });

      expect(scopeOf(pg, run).get('x')).toBe(2);
    });

    it('picks up a variable added after construction', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({ formulate, varRows: [], fnRows: [] });
      expect(scopeOf(pg, run).has('late')).toBe(false);

      pg.addVar('late', '9');

      expect(scopeOf(pg, run).get('late')).toBe(9);
    });

    it('drops a variable once it is removed', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({ formulate, varRows: [], fnRows: [] });
      pg.addVar('gone', '1');
      expect(scopeOf(pg, run).has('gone')).toBe(true);

      pg.removeVar(pg.varRows[0].id);

      expect(scopeOf(pg, run).has('gone')).toBe(false);
    });

    it('follows an in-place toggle of enabled', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'x', value: '1' })],
        fnRows: []
      });
      expect(scopeOf(pg, run).has('x')).toBe(true);

      pg.varRows[0].enabled = false;

      expect(scopeOf(pg, run).has('x')).toBe(false);
    });

    it('follows an in-place edit of a value', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'x', value: '1' })],
        fnRows: []
      });
      expect(scopeOf(pg, run).get('x')).toBe(1);

      pg.varRows[0].value = '8';

      expect(scopeOf(pg, run).get('x')).toBe(8);
    });
  });

  describe('function scope', () => {
    it('exposes enabled functions with arity taken from params', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'add', params: 'a, b', body: 'a + b' })]
      });

      const entry = entryOf(scopeOf(pg, run), 'add');

      expect(entry.arity).toBe(2);
      expect(typeof entry.fn).toBe('function');
    });

    it('treats blank params as arity zero', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'one', params: '' })]
      });

      expect(entryOf(scopeOf(pg, run), 'one').arity).toBe(0);
    });

    it('ignores empty segments and surrounding whitespace in params', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'g', params: ' a ,, b ,' })]
      });

      expect(entryOf(scopeOf(pg, run), 'g').arity).toBe(2);
    });

    it('excludes disabled functions', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'off', enabled: false })]
      });

      expect(scopeOf(pg, run).has('off')).toBe(false);
    });

    it('evaluates the body with params bound to the call arguments', () => {
      const { formulate, run } = fakeFormulate(99);
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'add', params: 'a, b', body: 'a + b' })]
      });
      const entry = entryOf(scopeOf(pg, run), 'add');
      run.mockClear();

      const out = entry.fn(3, 4);

      expect(out).toBe(99);
      expect(run).toHaveBeenCalledTimes(1);
      const [body, bodyScope] = run.mock.calls[0];
      expect(body).toBe('a + b');
      expect(bodyScope!.get('a')).toBe(3);
      expect(bodyScope!.get('b')).toBe(4);
    });

    it('makes enabled variables visible inside a function body', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'LEVEL', value: '5' }), varRow({ name: 'off', enabled: false })],
        fnRows: [fnRow({ name: 'f', params: 'x', body: 'x + LEVEL' })]
      });
      const entry = entryOf(scopeOf(pg, run), 'f');
      run.mockClear();

      entry.fn(1);

      const bodyScope = run.mock.calls[0][1]!;
      expect(bodyScope.get('LEVEL')).toBe(5);
      expect(bodyScope.has('off')).toBe(false);
    });

    it('lets params shadow variables of the same name', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'x', value: '100' })],
        fnRows: [fnRow({ name: 'f', params: 'x', body: 'x' })]
      });
      const entry = entryOf(scopeOf(pg, run), 'f');
      run.mockClear();

      entry.fn(2);

      expect(run.mock.calls[0][1]!.get('x')).toBe(2);
    });

    it('does not leak params into the outer scope', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'f', params: 'x', body: 'x' })]
      });
      const outer = scopeOf(pg, run);
      entryOf(outer, 'f').fn(2);

      expect(outer.has('x')).toBe(false);
    });

    it('follows an in-place edit of a function body', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [],
        fnRows: [fnRow({ name: 'f', params: '', body: '1' })]
      });
      entryOf(scopeOf(pg, run), 'f');

      pg.fnRows[0].body = '2';
      const entry = entryOf(scopeOf(pg, run), 'f');
      run.mockClear();
      entry.fn();

      expect(run.mock.calls[0][0]).toBe('2');
    });

    it('lets a function win when it shares a name with a variable', () => {
      const { formulate, run } = fakeFormulate();
      const pg = new Playground({
        formulate,
        varRows: [varRow({ name: 'dup', value: '1' })],
        fnRows: [fnRow({ name: 'dup' })]
      });

      expect(typeof scopeOf(pg, run).get('dup')).toBe('object');
    });
  });

  describe('with the real Formulate', () => {
    it('evaluates a plain formula with no default injection', () => {
      const pg = new Playground();
      pg.formula = '1 + 2';

      pg.run();

      expect(pg.result).toBe(3);
      expect(pg.error).toBe('');
    });

    it('uses a custom variable in a formula', () => {
      const pg = new Playground();
      pg.addVar('LEVEL', '5');
      pg.formula = 'LEVEL * 2';

      pg.run();

      expect(pg.result).toBe(10);
    });

    it('calls a custom function with arguments', () => {
      const pg = new Playground();
      pg.addFn('double', 'x', 'x * 2');
      pg.formula = 'double(4)';

      pg.run();

      expect(pg.result).toBe(8);
    });

    it('lets a custom function read a custom variable', () => {
      const pg = new Playground();
      pg.addVar('BASE', '10');
      pg.addFn('plusBase', 'x', 'x + BASE');
      pg.formula = 'plusBase(5)';

      pg.run();

      expect(pg.result).toBe(15);
    });

    it('reports an undefined variable as an error message', () => {
      const pg = new Playground();
      pg.formula = 'missing + 1';

      pg.run();

      expect(pg.result).toBeUndefined();
      expect(pg.error).toBe('Variable missing is undefined.');
    });

    it('reports an arity mismatch for a custom function', () => {
      const pg = new Playground();
      pg.addFn('double', 'x', 'x * 2');
      pg.formula = 'double(1, 2)';

      pg.run();

      expect(pg.error).toBe('Function double expects 1 argument(s) but received 2.');
    });

    it('does not see a variable once it is disabled', () => {
      const pg = new Playground();
      pg.addVar('LEVEL', '5');
      pg.formula = 'LEVEL';
      pg.varRows[0].enabled = false;

      pg.run();

      expect(pg.error).toBe('Variable LEVEL is undefined.');
    });
  });
});
