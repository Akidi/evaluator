import type { Kind, Token } from "../lexer/token";

export type NumNode   = { type: 'Num', value: number };
export type IdentNode = { type: 'Ident', name: string };
export type UnaryNode = { type: 'Unary', op: 'MINUS' | 'NOT', operand: Node };
export type BinaryNode = { type: 'Binary', op: Kind, left: Node, right: Node };
export type CallNode  = { type: 'Call', callee: IdentNode, args: Node[] };
export type TernaryNode = { type: 'Ternary', test: Node, ifTrue: Node, ifFalse: Node };

export type Node = NumNode | IdentNode | UnaryNode | BinaryNode | CallNode | TernaryNode;
export type IdentItem = {
  name: string
  type: 'FN' | 'VAR';
}

export interface IParser {
  parse: (tokens: Token[]) => [Node, IdentItem[]];
}