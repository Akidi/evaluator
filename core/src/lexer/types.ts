import type { Token } from "./token";

export interface ILexer {
  scan: (src: string) => Token[];
}