import { Formulate, type EvalFn, type FnEntry, type IFormulate, type Scope } from "@formula/core";
export type ScopeKind = "fn" | "var"
export type ScopeRow = { kind: ScopeKind; id: string; name: string; value: string; enabled: boolean };
export type ScopeFnRow = { kind: ScopeKind; id: string; name: string; params: string; body: string; enabled: boolean };
export type FormulateResult = number | boolean | undefined
export interface PGOptions {
  formulate: IFormulate
  fnRows: ScopeFnRow[]
  varRows: ScopeRow[]
}

export interface IPlayground {
  varRows: ScopeRow[]
  fnRows: ScopeFnRow[]
  result: FormulateResult
  error: string
  formula: string
  addVar: (name: string, value: string) => void
  removeVar: (id: string) => void
  addFn: (name: string, params: string, body: string) => void
  removeFn: (id: string) => void
  run: () => void
}


export class Playground implements IPlayground {
  public varRows: ScopeRow[] = $state([])
  public fnRows: ScopeFnRow[] = $state([])
  private formulate: IFormulate;
  private varScope = $derived<Map<string, number>>(
    // Map is recreated wholecloth and for what it is used for get / set / delete is wasted.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    new Map(
      this.varRows.filter(row => row.enabled && row.value !== '' && !isNaN(Number(row.value)))
        .map(row => [row.name, Number(row.value)]
        )
    )
  );
  private fnScope = $derived.by(() => {
    // Map is recreated wholecloth and for what it is used for get / set / delete is wasted.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    return new Map(
      this.fnRows
        .filter((row) => row.enabled)
        .map((row): [string, FnEntry] => {
          const params = row.params.split(',').map(name => name.trim()).filter(Boolean);
          const fn: EvalFn = (...args) =>
            this.formulate.run(
              row.body,
              // Map is recreated wholecloth and for what it is used for get / set / delete is wasted.
              // eslint-disable-next-line svelte/prefer-svelte-reactivity
              new Map<string, number | FnEntry>([
                ...this.varScope,
                ...params.map((name, i): [string, number] => [name, args[i]]),
              ])
            );
          return [row.name, { fn, arity: params.length }];
        })
    )
  });
  private scope: Scope = $derived<Scope>(
    // Map is recreated wholecloth and for what it is used for get / set / delete is wasted.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    new Map<string, number | FnEntry>(
      [...this.varScope, ...this.fnScope]
    )
  );
  private inspector: string[] = [];
  public error: string = $state("");
  public formula: string = $state("");
  public result: FormulateResult = $state();
  constructor(options?: PGOptions) {
    this.formulate = options?.formulate ?? new Formulate();
    this.varRows = options?.varRows ?? [];
    this.fnRows = options?.fnRows ?? [];
  }
  run = (): void => {
    this.error = '';
    this.result = undefined;
    try {
      this.result = this.formulate.run(this.formula, this.scope);
    } catch (e: unknown) {
      this.error = (e instanceof Error && e.message || String(e));
    }
  }
  addVar = (name: string, value: string): void => {
    this.varRows = [...this.varRows, { kind: "var", id: crypto.randomUUID(), enabled: true, name, value }]
  }
  removeVar = (id: string): void => {
    this.varRows = this.varRows.filter(row => row.id !== id);
  }
  addFn = (name: string, params: string, body: string): void => {
    this.fnRows = [...this.fnRows, { kind: "fn", id: crypto.randomUUID(), enabled: true, name, params, body }]
  }
  removeFn = (id: string): void => {
    this.fnRows = this.fnRows.filter(row => row.id !== id);
  }
}