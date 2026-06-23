export type Punct = {
  kind: 'STAR'
    | 'PLUS'
    | 'MINUS'
    | 'SLASH'
    | 'LPAREN'
    | 'RPAREN'
    | 'COMMA'
    | 'PERCENT'
    | 'RBRACKET'
    | 'LBRACKET'
    | 'CARROT'
}

export const PUNCT_TO_CHAR: Record<Punct['kind'], string> = {
  'CARROT': '^',
  'COMMA': ',',
  'LBRACKET': '[',
  'LPAREN': '(',
  'MINUS': '-',
  'PERCENT': '%',
  'PLUS': '+',
  'RBRACKET': ']',
  'RPAREN': ')',
  'SLASH': '/',
  'STAR': '*',
} 
export type RelOp = {
  kind: 'EQ'
    | 'GE'
    | 'GT'
    | 'LE'
    | 'LT'
    | 'NEQ'
    | 'AND'
    | 'OR'
    | 'NOT'
    | 'QUESTION'
    | 'COLON'
}

export const RELOPS: { chars: string; kind: RelOp['kind'] }[] = [
  { chars: '==', kind: 'EQ' },
  { chars: '!=', kind: 'NEQ' },
  { chars: '>=', kind: 'GE' },
  { chars: '<=', kind: 'LE' },
  { chars: '&&', kind: 'AND' },
  { chars: '||', kind: 'OR' },
  { chars: '>', kind: 'GT' },
  { chars: '<', kind: 'LT' },
  { chars: '!', kind: 'NOT' },
  { chars: '?', kind: 'QUESTION' },
  { chars: ':', kind: 'COLON' },
];

export const RELOP_BY_LEN: ReadonlyMap<number, Record<string, RelOp['kind']>> = (() => {
  const byLen = new Map<number, Record<string, RelOp['kind']>>();
  for (const { chars, kind } of RELOPS) {
    const bucket = byLen.get(chars.length) ?? {};
    bucket[chars] = kind;
    byLen.set(chars.length, bucket);
  }
  return byLen;
})();

export const MAX_RELOP_LEN = Math.max(...RELOP_BY_LEN.keys());

export type Position = { start: number, end: number, line: number; }
export type Ident = { kind: 'IDENT', value: string; };
export type Num = { kind: 'NUM', value: number; };
export type EOF = { kind: 'EOF' };
export type Located<T> = T & { position: Position,  };
export type Token = Located<Punct | RelOp | Ident | Num | EOF >;
export type Kind = Token['kind'];
