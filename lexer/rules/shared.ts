import { Ident, Kind, Num, Token } from "../token";

export const isDigit = (c: string): boolean => c >= "0" && c <= "9";
export const isLetter = (c: string): boolean =>
  (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";

export const makeToken = (
  kind: Exclude<Kind, Ident['kind'] | Num['kind']>,
  start: number,
  end: number,
  line: number = 1
): Token => ({ kind, position: { start, end, line } });