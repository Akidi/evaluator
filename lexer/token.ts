export type Punct = {
  kind: 'STAR'
    | 'PLUS'
    | 'MINUS'
    | 'MULT'
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
  'MULT': '·',
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
    | 'GTE'
    | 'GT'
    | 'LTE'
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
  { chars: '>=', kind: 'GTE' },
  { chars: '<=', kind: 'LTE' },
  { chars: '&&', kind: 'AND' },
  { chars: '||', kind: 'OR' },
  { chars: '>', kind: 'GT' },
  { chars: '<', kind: 'LT' },
  { chars: '!', kind: 'NOT' },
  { chars: '?', kind: 'QUESTION' },
  { chars: ':', kind: 'COLON' },
];

export const RELOPS_BY_MUNCH: readonly { chars: string; kind: RelOp['kind'] }[] =
  [...RELOPS].sort((a, b) => b.chars.length - a.chars.length);

  
export type Position = { start: number, end: number, line: number; }
export type Ident = { kind: 'IDENT', name: string; };
export type Num = { kind: 'NUM', value: number; };
export type EOF = { kind: 'EOF' };
export type Located<T> = T & { position: Position,  };
export type Token = Located<Punct | RelOp | Ident | Num | EOF >;
export type Kind = Token['kind'];
