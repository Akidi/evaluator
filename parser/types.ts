import { Punct, RelOp } from "../lexer/token";

export type NumNode   = { type: 'Num', value: number };
export type IdentNode = { type: 'Ident', name: string };
export type UnaryNode = { type: 'Unary', op: 'MINUS' | 'NOT', operand: Node };
export type BinaryNode = { type: 'Binary', op: Punct['kind'] | RelOp['kind'], left: Node, right: Node };
export type CallNode  = { type: 'Call', callee: Node, args: Node[] };
export type TernaryNode = { type: 'Ternary', cond: Node, then: Node, else: Node };

export type Node = NumNode | IdentNode | UnaryNode | BinaryNode | CallNode | TernaryNode;

export interface IParser {
  parse: () => void;
}