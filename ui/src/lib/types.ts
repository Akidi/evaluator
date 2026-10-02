export type TableHeaders = string[];
type ScopeKind = 'var' | 'fn'
export type ScopeRow = { kind: ScopeKind; id: string; name: string; value: string; enabled: boolean };
export type ScopeFnRow = {
	kind: ScopeKind;
	id: string;
	name: string;
	params: string;
	body: string;
	enabled: boolean;
};
export type Row = ScopeRow[] | ScopeFnRow[];
