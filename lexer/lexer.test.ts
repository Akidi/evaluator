import { describe, it, expect, beforeAll } from "vitest";
import { Lexer } from "./lexer";
import { Token } from "./token";
import { CursorSourceError, DuplicateDecimalError, MalformedDecimalNumberError, UnknownCharacterError } from "./errors";
import { ILexer } from "./types";

const at = (start: number, end: number, line: number = 1) => ({ start, end, line });

const lexer: ILexer = new Lexer();

describe("lexer", () => {
  it("throws error when no src provided", () => {
    // @ts-expect-error - intentionally calling with no args to test runtime throw
    expect(() => lexer.scan()).toThrow(CursorSourceError);
    // @ts-expect-error - intentionally calling with no args to test runtime throw
    expect(() => lexer.scan()).toThrow('Cursor Source missing use setSource to set the source before trying again.');
  });
  it("throws error when unexpected character is encountered", () => {
    expect(() => lexer.scan("CON @")).toThrow(UnknownCharacterError);
  });
  it("scans an identifier", () => {
    let tokens: Token[] = lexer.scan("CON");
    expect(tokens).toEqual([
      { kind: "IDENT", name: "CON", position: at(1, 4) },
      { kind: "EOF", position: at(4, 4) },
    ]);
  });

  it("scans a negative identifier", () => {
    let tokens: Token[] = lexer.scan("-CON");
    expect(tokens).toEqual([
      {kind: "MINUS", position: at(1, 2) },
      {kind: "IDENT", name: "CON", position: at(2, 5)},
      {kind: "EOF", position: at(5,5)}
    ])
  })

  it("scans a punctuation.", () => {
    let tokens: Token[] = lexer.scan("/ * - + ( ) , % [ ] ^");
    expect(tokens).toEqual([
      { kind: "SLASH", position: at(1, 2) },
      { kind: "STAR", position: at(3, 4) },
      { kind: "MINUS", position: at(5, 6) },
      { kind: "PLUS", position: at(7, 8) },
      { kind: "LPAREN", position: at(9, 10) },
      { kind: "RPAREN", position: at(11, 12) },
      { kind: "COMMA", position: at(13, 14) },
      { kind: "PERCENT", position: at(15, 16) },
      { kind: "LBRACKET", position: at(17, 18) },
      { kind: "RBRACKET", position: at(19, 20) },
      { kind: "CARROT", position: at(21, 22) },
      { kind: "EOF", position: at(22, 22) },
    ])
  });

  it("scans relationship operators.", () => {
    let tokens: Token[] = lexer.scan("== < > <= >= !=");
    expect(tokens).toEqual([
      { kind: "EQ", position: at(1, 3) },
      { kind: "LT", position: at(4, 5) },
      { kind: "GT", position: at(6, 7) },
      { kind: "LTE", position: at(8, 10) },
      { kind: "GTE", position: at(11, 13) },
      { kind: "NEQ", position: at(14, 16) },
      { kind: "EOF", position: at(16, 16) },
    ]);
  });

  it('scans logical operators.', () => {
    let tokens: Token[] = lexer.scan("&& || ! ? :");
    expect(tokens).toEqual([
      { kind: "AND", position: at(1, 3) },
      { kind: "OR", position: at(4, 6) },
      { kind: "NOT", position: at(7, 8) },
      { kind: "QUESTION", position: at(9, 10) },
      { kind: "COLON", position: at(11, 12) },
      { kind: "EOF", position: at(12, 12) },
    ]);
  });

  it("tracks line numbers across newlines.", () => {
    let tokens: Token[] = lexer.scan("CON\n42");
    expect(tokens).toEqual([
      { kind: "IDENT", name: "CON", position: at(1, 4) },
      { kind: "NUM", value: 42, position: at(5, 7, 2) },
      { kind: "EOF", position: at(7, 7, 2) },
    ]);
  });

  it("produces fresh tokens on reuse, with no leakage from a prior scan.", () => {
    const first = lexer.scan("CON 1");
    const second = lexer.scan("42");

    expect(first).toEqual([
      { kind: "IDENT", name: "CON", position: at(1, 4) },
      { kind: "NUM", value: 1, position: at(5, 6) },
      { kind: "EOF", position: at(6, 6) },
    ]);
    expect(second).toEqual([
      { kind: "NUM", value: 42, position: at(1, 3) },
      { kind: "EOF", position: at(3, 3) },
    ]);
  });
  it("scans a valid decimal number", () => {
    let tokens: Token[] = lexer.scan("3.14");
    expect(tokens).toEqual([
      { kind: "NUM", value: 3.14, position: at(1, 5) },
      { kind: "EOF", position: at(5, 5) },
    ]);
  });
  it("throws an error on incomplete or malformed decimals", () => {
    // Case A: Missing fractional part at the end of the string
    expect(() => lexer.scan("3.")).toThrow(MalformedDecimalNumberError);

    // CASE B: Missing fractional at the beginning
    expect(() => lexer.scan(".3")).toThrow(UnknownCharacterError);

    // Case C: Multiple Decimals
    expect(() => lexer.scan("0.3.5")).toThrow(DuplicateDecimalError);

    // Case D: Decimal followed by a non-digit
    expect(() => lexer.scan("3.A")).toThrow(MalformedDecimalNumberError);

  });
});
