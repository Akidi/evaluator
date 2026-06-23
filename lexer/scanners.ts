import { ICursor } from "./cursor";
import { Token } from "./token";

export function scanIdent(cursor: ICursor, c: string): Token {
  let start: number = cursor.column();
  let line: number = cursor.line();
  let value = c;
  cursor.advance();
  let next: string | undefined;
  while ((next = cursor.current()) !== undefined) {
    if (!isDigit(next) && !isLetter(next)) break;
    value += next;
    cursor.advance();
  }

  return {kind: "IDENT", value, position: { start, end: cursor.column(), line }};
}

export function scanNumber(cursor: ICursor, c: string): Token {
  let start: number = cursor.column();
  let line: number = cursor.line();
  let isFloat: boolean = false;
  let value = c;
  cursor.advance();
  let next: string | undefined;
  while ((next = cursor.current()) !== undefined) {
    const isDigitCheck = isDigit(next);
    const isPeriod = next === ".";
    const peek = cursor.peek();
    
    if (!isDigitCheck && !isPeriod) break;
    if (isPeriod && isFloat) throw new Error(`Duplicate period found at ${cursor.column()}`);
    if (isPeriod && (!peek || !isDigit(peek))) throw new Error(`Dangling period at column ${cursor.column()}`)
    if (isPeriod && !isFloat) isFloat = true;
    
    value += next;
    cursor.advance();
  }
  
  return { kind: "NUM", value: Number(value), position: { start, end: cursor.column(), line }}
}

export function isWhitespace(c: string): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r";
}

export function isLetter(c: string): boolean {
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c === "_");
}

export function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}