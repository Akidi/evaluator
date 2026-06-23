import { describe, it, expect, beforeAll } from "vitest";
import { Lexer } from "./lexer";
import { Token } from "./token";

const at = (start: number, end: number, line: number = 1) => ({ start, end, line });

describe("lexer", () => {
  it("throws error when no src provided", () => {
    expect(() => new Lexer().scan()).toThrow('Cursor Source missing use setSource to set the source before trying again.');
  });
  it("throws error when unexpected character is encountered", () => {
    expect(() => new Lexer().scan("CON @")).toThrow('Unexpected character \'@\' at column 5');
  });
  it("scans an identifier", () => {
    let tokens: Token[] = new Lexer().scan("CON");
    expect(tokens).toEqual([
      { kind: "IDENT", value: "CON", position: at(1, 4) },
      { kind: "EOF", position: at(4, 4) },
    ]);
  });

  it("scans a punctuation.", () => {
    let tokens: Token[] = new Lexer().scan("/ * - + ( ) , % [ ] ^");
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
    let tokens: Token[] = new Lexer().scan("== < > <= >= !=");
    expect(tokens).toEqual([
      { kind: "EQ", position: at(1, 3) },
      { kind: "LT", position: at(4, 5) },
      { kind: "GT", position: at(6, 7) },
      { kind: "LE", position: at(8, 10) },
      { kind: "GE", position: at(11, 13) },
      { kind: "NEQ", position: at(14, 16) },
      { kind: "EOF", position: at(16, 16) },
    ]);
  });

  it('scans logical operators.', () => {
    let tokens: Token[] = new Lexer().scan("&& || ! ? :");
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
    let tokens: Token[] = new Lexer().scan("CON\n42");
    expect(tokens).toEqual([
      { kind: "IDENT", value: "CON", position: at(1, 4) },
      { kind: "NUM", value: 42, position: at(5, 7, 2) },
      { kind: "EOF", position: at(7, 7, 2) },
    ]);
  });
});
