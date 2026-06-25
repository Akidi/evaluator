import { describe, expect, it } from "vitest";
import { Parser } from "./parser";
import { IParser, Node } from "./types";
import { Token } from "../lexer/token";
import { Lexer } from "../lexer/lexer";

// A quick helper function to reduce boilerplate when creating mock tokens
function mockToken(partial: Partial<Token> & { kind: Token["kind"] }): Token {
  return {
    position: { start: 0, end: 0, line: 1 },
    ...partial,
  } as Token;
}

describe("Parser", () => {
  it("should return a NumNode", () => {
    const parser: IParser = new Parser();
    
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "EOF" }),
    ];
    
    const parsed: Node = parser.parse(tokens);
    expect(parsed).toEqual({ type: 'Num', value: 1 });
  });

  it("should return a IdentNode", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = [
      mockToken({ kind: "IDENT", name: "ident" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);
    expect(parsed).toEqual({ type: 'Ident', name: 'ident' });
  });

  it("resets position on reuse, with no leakage from a prior parse.", () => {
    const parser: IParser = new Parser();

    const firstTokens: Token[] = [
      mockToken({ kind: "IDENT", name: "CON" }),
      mockToken({ kind: "EOF" }),
    ];
    const first = parser.parse(firstTokens);

    const secondTokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "EOF" }),
    ];
    const second = parser.parse(secondTokens);

    expect(first).toEqual({ type: "Ident", name: "CON" });
    expect(second).toEqual({ type: "Num", value: 1 });
  });
});

describe("Parser (Pratt Parsing Tests)", () => {
  it("should parse a single number literal", () => {
    const parser = new Parser();
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 42 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Num",
      value: 42,
    });
  });

  it("should respect operator precedence (1 + 2 * 3)", () => {
    const parser = new Parser();
    // 1 + 2 * 3
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "PLUS" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "STAR" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    // Multiplication (*) should bind tighter, becoming the right-child of the addition (+)
    expect(ast).toEqual({
      type: "Binary",
      op: "PLUS",
      left: { type: "Num", value: 1 },
      right: {
        type: "Binary",
        op: "STAR",
        left: { type: "Num", value: 2 },
        right: { type: "Num", value: 3 },
      },
    });
  });

  it("should handle unary operators with higher precedence (-5 + 2)", () => {
    const parser = new Parser();
    // -5 + 2
    const tokens: Token[] = [
      mockToken({ kind: "MINUS" }),
      mockToken({ kind: "NUM", value: 5 }),
      mockToken({ kind: "PLUS" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    // The unary minus should attach to the 5 first, before adding 2
    expect(ast).toEqual({
      type: "Binary",
      op: "PLUS",
      left: {
        type: "Unary",
        op: "MINUS",
        operand: { type: "Num", value: 5 },
      },
      right: { type: "Num", value: 2 },
    });
  });

  it("should handle grouping with parentheses to override precedence (1 + 2) * 3", () => {
    const parser: IParser = new Parser();

    // ( 1 + 2 ) * 3
    const tokens: Token[] = [
      mockToken({ kind: "LPAREN" }),
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "PLUS" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "RPAREN" }),
      mockToken({ kind: "STAR" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);

    // Because of the parentheses, the addition (+) should be deep inside the left child of the multiplication (*)
    expect(parsed).toEqual({
      type: "Binary",
      op: "STAR",
      left: {
        type: "Binary",
        op: "PLUS",
        left: { type: "Num", value: 1 },
        right: { type: "Num", value: 2 },
      },
      right: { type: "Num", value: 3 },
    });
  });

  it("should handle unary MINUS negation (-1)", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = [
      mockToken({ kind: "MINUS" }),
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Num", value: 1 },
    });
  });

  it("should handle unary NOT operator (!ident)", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = [
      mockToken({ kind: "NOT" }),
      mockToken({ kind: "IDENT", name: "ident" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "NOT",
      operand: { type: "Ident", name: "ident" },
    });
  });

  it("should handle unary MINUS operator (-ident)", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = [
      mockToken({ kind: "MINUS" }),
      mockToken({ kind: "IDENT", name: "CON" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Ident", name: "CON" },
    });
  });

  it("should parse a function call with a single argument (abs(1))", () => {
    const parser: IParser = new Parser();

    // abs ( 1 )
    const tokens: Token[] = [
      mockToken({ kind: "IDENT", name: "abs" }),
      mockToken({ kind: "LPAREN" }),
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "RPAREN" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);

    expect(parsed).toEqual({
      type: "Call",
      callee: { type: "Ident", name: "abs" },
      args: [{ type: "Num", value: 1 }],
    });
  });

  it("should parse a function call with multiple arguments (pow(2, 3))", () => {
    const parser: IParser = new Parser();

    // pow ( 2 , 3 )
    const tokens: Token[] = [
      mockToken({ kind: "IDENT", name: "pow" }),
      mockToken({ kind: "LPAREN" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "COMMA" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "RPAREN" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);

    expect(parsed).toEqual({
      type: "Call",
      callee: { type: "Ident", name: "pow" },
      args: [
        { type: "Num", value: 2 },
        { type: "Num", value: 3 },
      ],
    });
  });

  it("should handle expressions inside function arguments (max(1 + 2, 3 * 4))", () => {
    const parser: IParser = new Parser();

    // max ( 1 + 2 , 3 * 4 )
    const tokens: Token[] = [
      mockToken({ kind: "IDENT", name: "max" }),
      mockToken({ kind: "LPAREN" }),
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "PLUS" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "COMMA" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "STAR" }),
      mockToken({ kind: "NUM", value: 4 }),
      mockToken({ kind: "RPAREN" }),
      mockToken({ kind: "EOF" }),
    ];

    const parsed = parser.parse(tokens);

    expect(parsed).toEqual({
      type: "Call",
      callee: { type: "Ident", name: "max" },
      args: [
        {
          type: "Binary",
          op: "PLUS",
          left: { type: "Num", value: 1 },
          right: { type: "Num", value: 2 },
        },
        {
          type: "Binary",
          op: "STAR",
          left: { type: "Num", value: 3 },
          right: { type: "Num", value: 4 },
        },
      ],
    });
  });

  it("should parse logical OR (1 || 2)", () => {
    const parser = new Parser();
    // 1 || 2
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "OR" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "OR",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should bind AND tighter than OR (1 || 2 && 3)", () => {
    const parser = new Parser();
    // 1 || 2 && 3
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "OR" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "AND" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    // AND (bp 2) binds tighter than OR (bp 1), so it nests as the right child of OR
    expect(ast).toEqual({
      type: "Binary",
      op: "OR",
      left: { type: "Num", value: 1 },
      right: {
        type: "Binary",
        op: "AND",
        left: { type: "Num", value: 2 },
        right: { type: "Num", value: 3 },
      },
    });
  });

  it("should treat division as left-associative (8 / 4 / 2)", () => {
    const parser = new Parser();
    // 8 / 4 / 2
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 8 }),
      mockToken({ kind: "SLASH" }),
      mockToken({ kind: "NUM", value: 4 }),
      mockToken({ kind: "SLASH" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    // Left-associative: groups as (8 / 4) / 2, so the first division is the left child
    expect(ast).toEqual({
      type: "Binary",
      op: "SLASH",
      left: {
        type: "Binary",
        op: "SLASH",
        left: { type: "Num", value: 8 },
        right: { type: "Num", value: 4 },
      },
      right: { type: "Num", value: 2 },
    });
  });

  it("should treat exponent as right-associative (2 ^ 3 ^ 2)", () => {
    const parser = new Parser();
    const lexer = new Lexer();

    const ast = parser.parse(lexer.scan("2 ^ 3 ^ 2"));


    expect(ast).toEqual({
      type: "Binary",
      op: "CARROT",
      left: { type: "Num", value: 2 },
      right: {
        type: "Binary",
        op: "CARROT",
        left: { type: "Num", value: 3 },
        right: { type: "Num", value: 2 },
      },
    });
  });

  it("should parse a complex expression across every implemented tier", () => {
    const parser = new Parser();
    const lexer = new Lexer();
    const ast = parser.parse(lexer.scan("1 + 2 * 3 ^ 2 && max(4, 5) || -6"));

    // Reads as: ((1 + 2 * (3 ^ 2)) && max(4, 5)) || (-6)
    expect(ast).toEqual({
      type: "Binary",
      op: "OR",
      left: {
        type: "Binary",
        op: "AND",
        left: {
          type: "Binary",
          op: "PLUS",
          left: { type: "Num", value: 1 },
          right: {
            type: "Binary",
            op: "STAR",
            left: { type: "Num", value: 2 },
            right: {
              type: "Binary",
              op: "CARROT",
              left: { type: "Num", value: 3 },
              right: { type: "Num", value: 2 },
            },
          },
        },
        right: {
          type: "Call",
          callee: { type: "Ident", name: "max" },
          args: [
            { type: "Num", value: 4 },
            { type: "Num", value: 5 },
          ],
        },
      },
      right: {
        type: "Unary",
        op: "MINUS",
        operand: { type: "Num", value: 6 },
      },
    });
  });

  // --- Not yet implemented: these are expected to fail until comparisons + ternary land ---

  it("should parse a less-than comparison (1 < 2)", () => {
    const parser = new Parser();
    // 1 < 2
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "LT" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "LT",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should parse an equality comparison (1 == 2)", () => {
    const parser = new Parser();
    // 1 == 2
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "EQ" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "EQ",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should parse a ternary conditional (1 ? 2 : 3)", () => {
    const parser = new Parser();
    // 1 ? 2 : 3
    const tokens: Token[] = [
      mockToken({ kind: "NUM", value: 1 }),
      mockToken({ kind: "QUESTION" }),
      mockToken({ kind: "NUM", value: 2 }),
      mockToken({ kind: "COLON" }),
      mockToken({ kind: "NUM", value: 3 }),
      mockToken({ kind: "EOF" }),
    ];

    const ast = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Ternary",
      cond: { type: "Num", value: 1 },
      then: { type: "Num", value: 2 },
      else: { type: "Num", value: 3 },
    });
  });

  /*
  // STRESS TEST — the full target, including tiers not yet built (comparisons + ternary).
  // Commented out so it stays inert in watch mode. Uncomment once `<`/`==` and the `? :`
  // ternary are parsing, and it'll prove they slot into the binding-power order correctly.
  //
  // Encodes these assumptions — adjust the expected tree if you decide differently:
  //   - ternary `? :` is the LOOSEST tier (looser than OR), so it wraps the whole thing
  //   - comparison `<` (bp 4) binds tighter than OR/AND but looser than arithmetic
  //   - the condition, then-branch, and else-branch are each a full sub-expression
  //
  it("should parse the full target: !a || b < c ? max(1, 2) ^ 2 : foo(d) && -e", () => {
    const parser = new Parser();
    const lexer = new Lexer();

    const ast = parser.parse(lexer.scan("!a || b < c ? max(1, 2) ^ 2 : foo(d) && -e"));

    // Reads as: ( (!a) || (b < c) ) ? ( max(1, 2) ^ 2 ) : ( foo(d) && (-e) )
    expect(ast).toEqual({
      type: "Ternary",
      cond: {
        type: "Binary",
        op: "OR",
        left: { type: "Unary", op: "NOT", operand: { type: "Ident", name: "a" } },
        right: {
          type: "Binary",
          op: "LT",
          left: { type: "Ident", name: "b" },
          right: { type: "Ident", name: "c" },
        },
      },
      then: {
        type: "Binary",
        op: "CARROT",
        left: {
          type: "Call",
          callee: { type: "Ident", name: "max" },
          args: [
            { type: "Num", value: 1 },
            { type: "Num", value: 2 },
          ],
        },
        right: { type: "Num", value: 2 },
      },
      else: {
        type: "Binary",
        op: "AND",
        left: {
          type: "Call",
          callee: { type: "Ident", name: "foo" },
          args: [{ type: "Ident", name: "d" }],
        },
        right: { type: "Unary", op: "MINUS", operand: { type: "Ident", name: "e" } },
      },
    });
  });
  */
});