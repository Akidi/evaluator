import { describe, expect, it } from "vitest";
import { Parser } from "./parser";
import { IParser } from "./types";
import { Token } from "../lexer/token";
import { Lexer } from "../lexer/lexer";
import { ILexer } from "../lexer/types";
import { UnexpectedTokenKind } from "./errors";

const lexer: ILexer = new Lexer();
const parser: IParser = new Parser();

describe("Parser", () => {
  it("should error on connecting idents without punctuation between.", () => {
    const tokens = lexer.scan("CON A B");
    expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenKind);
  })
  it("should return a NumNode", () => {
    const tokens: Token[] = lexer.scan("1");
    
    const [parsed] = parser.parse(tokens);
    expect(parsed).toEqual({ type: 'Num', value: 1 });
  });

  it("should return a IdentNode", () => {
    const tokens: Token[] = lexer.scan("ident");

    const [parsed] = parser.parse(tokens);
    expect(parsed).toEqual({ type: 'Ident', name: 'ident' });
  });

  it("resets position on reuse, with no leakage from a prior parse.", () => {
    let tokens: Token[] = lexer.scan("CON")
    const [first] = parser.parse(tokens);

    tokens = lexer.scan("1")
    const [second] = parser.parse(tokens);

    expect(first).toEqual({ type: "Ident", name: "CON" });
    expect(second).toEqual({ type: "Num", value: 1 });
  });

  it("should return an identList with a single ident as VAR", () => {
    let tokens: Token[] = lexer.scan("CON");
    const [_, identList] = parser.parse(tokens);

    expect(identList).toEqual([
      {name: 'CON', type: 'VAR'}
    ])
  });

  it("should return an identList with multiple VAR", () => {
    let tokens: Token[] = lexer.scan("CON&&A>B");
    const [_, identList] = parser.parse(tokens);

    expect(identList).toEqual([
      {name: 'B', type: 'VAR'},
      {name: 'A', type: 'VAR'},
      {name: 'CON', type: 'VAR'},
    ])
  });

  it("should return an identList with FN", () => {
    let tokens: Token[] = lexer.scan("math(1)");
    const [_, identList] = parser.parse(tokens);

    expect(identList).toEqual([
      {name: 'math', type: 'FN'}
    ])
  });

  it("should return an identList multiple FN", () => {
    let tokens: Token[] = lexer.scan("math(1)>Max(5+1,LEN(5325))||Min(1, 3)");
    const [_, identList] = parser.parse(tokens);

    expect(identList).toEqual([
      {name: 'math', type: 'FN'},
      {name: 'LEN', type: 'FN'},
      {name: 'Max', type: 'FN'},
      {name: 'Min', type: 'FN'},
    ])
  });

  it("should return an identList mixxed Call and Var", () => {
    let tokens: Token[] = lexer.scan("math(1, POW, BOB, 11 + DEX)>Max(5+1,LEN(5325 + CON))||Min(1, 3 + WIS - INT)");
    const [_, identList] = parser.parse(tokens);

    expect(identList).toEqual([
      {name: 'POW', type: 'VAR'},
      {name: 'BOB', type: 'VAR'},
      {name: 'DEX', type: 'VAR'},
      {name: 'math', type: 'FN'},
      {name: 'CON', type: 'VAR'},
      {name: 'LEN', type: 'FN'},
      {name: 'Max', type: 'FN'},
      {name: 'WIS', type: 'VAR'},
      {name: 'INT', type: 'VAR'},
      {name: 'Min', type: 'FN'},
    ])
  });
});

describe("Parser (Pratt Parsing Tests)", () => {
  it("should parse a single number literal", () => {
    const tokens: Token[] = lexer.scan("42");

    const [ast] = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Num",
      value: 42,
    });
  });

  it("should respect operator precedence (1 + 2 * 3)", () => {
    const tokens: Token[] = lexer.scan("1 + 2 * 3")

    const [ast] = parser.parse(tokens);

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
    const tokens: Token[] = lexer.scan("-5 + 2")

    const [ast] = parser.parse(tokens);

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
    const tokens: Token[] =lexer.scan("(1 + 2) * 3")
    const [parsed] = parser.parse(tokens);

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
    const tokens: Token[] = lexer.scan("-1")

    const [parsed] = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Num", value: 1 },
    });
  });

  it("should handle unary NOT operator (!ident)", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = lexer.scan("!ident");

    const [parsed] = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "NOT",
      operand: { type: "Ident", name: "ident" },
    });
  });

  it("should handle unary MINUS operator (-ident)", () => {
    const parser: IParser = new Parser();

    const tokens: Token[] = lexer.scan("-CON");

    const [parsed] = parser.parse(tokens);
    expect(parsed).toEqual({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Ident", name: "CON" },
    });
  });

  it("should parse a function call with a single argument (abs(1))", () => {
    const tokens: Token[] = lexer.scan("abs(1)")

    const [parsed] = parser.parse(tokens);

    expect(parsed).toEqual({
      type: "Call",
      callee: { type: "Ident", name: "abs" },
      args: [{ type: "Num", value: 1 }],
    });
  });

  it("should parse a function call with multiple arguments (pow(2, 3))", () => {
    const tokens: Token[] = lexer.scan("pow(2,3)");

    const [parsed] = parser.parse(tokens);

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
    const tokens: Token[] = lexer.scan("max(1+2, 3*4)");

    const [parsed] = parser.parse(tokens);

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
    const tokens: Token[] = lexer.scan("1 || 2");

    const [ast] = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "OR",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should bind AND tighter than OR (1 || 2 && 3)", () => {
    const tokens: Token[] = lexer.scan("(1 || 2 && 3)");
    const [ast] = parser.parse(tokens);

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
    const tokens: Token[] = lexer.scan("8 / 4 / 2");

    const [ast] = parser.parse(tokens);

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

  it("should treat modulo as left-associative, same precedence as * and / (10 % 3 % 2)", () => {
    const tokens: Token[] = lexer.scan("10 % 3 % 2");

    const [ast] = parser.parse(tokens);

    // Left-associative, same bp as * and /: groups as (10 % 3) % 2
    expect(ast).toEqual({
      type: "Binary",
      op: "PERCENT",
      left: {
        type: "Binary",
        op: "PERCENT",
        left: { type: "Num", value: 10 },
        right: { type: "Num", value: 3 },
      },
      right: { type: "Num", value: 2 },
    });
  });

  it("should bind modulo at the same precedence as multiplication (2 * 5 % 3)", () => {
    const tokens: Token[] = lexer.scan("2 * 5 % 3");

    const [ast] = parser.parse(tokens);

    // Same bp, left-to-right: groups as (2 * 5) % 3
    expect(ast).toEqual({
      type: "Binary",
      op: "PERCENT",
      left: {
        type: "Binary",
        op: "STAR",
        left: { type: "Num", value: 2 },
        right: { type: "Num", value: 5 },
      },
      right: { type: "Num", value: 3 },
    });
  });

  it("should bind modulo tighter than addition (1 + 4 % 3)", () => {
    const tokens: Token[] = lexer.scan("1 + 4 % 3");

    const [ast] = parser.parse(tokens);

    // % (bp 60) binds tighter than + (bp 50): groups as 1 + (4 % 3)
    expect(ast).toEqual({
      type: "Binary",
      op: "PLUS",
      left: { type: "Num", value: 1 },
      right: {
        type: "Binary",
        op: "PERCENT",
        left: { type: "Num", value: 4 },
        right: { type: "Num", value: 3 },
      },
    });
  });

  it("should throw on leftover tokens after a valid expression (1 + 2 3)", () => {
    const tokens: Token[] = lexer.scan("1 + 2 3");

    expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenKind);
  });

  it("should treat exponent as right-associative (2 ^ 3 ^ 2)", () => {
    const parser = new Parser();
    const lexer = new Lexer();

    const [ast] = parser.parse(lexer.scan("2 ^ 3 ^ 2"));


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

  it("should handle ( and [ as grouping with correct expect.", () => {
    const tokens = lexer.scan("A * (a + [B - c] ^ D) / d");
    const [ast] = parser.parse(tokens);

    // Reads as: (A * (a + ((B - c) ^ D))) / d
    expect(ast).toEqual({
      type: "Binary",
      op: "SLASH",
      left: {
        type: "Binary",
        op: "STAR",
        left: { type: "Ident", name: "A" },
        right: {
          type: "Binary",
          op: "PLUS",
          left: { type: "Ident", name: "a" },
          right: {
            type: "Binary",
            op: "CARROT",
            left: {
              type: "Binary",
              op: "MINUS",
              left: { type: "Ident", name: "B" },
              right: { type: "Ident", name: "c" },
            },
            right: { type: "Ident", name: "D" },
          },
        },
      },
      right: { type: "Ident", name: "d" },
    });
  })

  it("should parse a stress-test expression covering every implemented token", () => {

    // Exercises, in one pass, every entry in INFIX_BP and PREFIX_BP. Individual
    // tiers already have focused tests above; this confirms they all still slot
    // together correctly by binding power when combined.
    const [ast] = parser.parse(
      lexer.scan(
        "!a && (1 + 2 - 3) / 4 ^ 2 * 5 == max(6, 7) ? 16 : -8 > 9 && 10 < 11 || 12 >= 13 <= 14 != 15"
      )
    );

    // Reads as:
    //   ( (!a) && ( ((1 + 2 - 3) / (4 ^ 2) * 5) == max(6, 7) ) )
    //   ? 16
    //   : ( (-8 > 9) && (10 < 11) ) || ( ((12 >= 13) <= 14) != 15 )
    expect(ast).toEqual({
      type: "Ternary",
      test: {
        type: "Binary",
        op: "AND",
        left: {
          type: "Unary",
          op: "NOT",
          operand: { type: "Ident", name: "a" },
        },
        right: {
          type: "Binary",
          op: "EQ",
          left: {
            type: "Binary",
            op: "STAR",
            left: {
              type: "Binary",
              op: "SLASH",
              left: {
                type: "Binary",
                op: "MINUS",
                left: {
                  type: "Binary",
                  op: "PLUS",
                  left: { type: "Num", value: 1 },
                  right: { type: "Num", value: 2 },
                },
                right: { type: "Num", value: 3 },
              },
              right: {
                type: "Binary",
                op: "CARROT",
                left: { type: "Num", value: 4 },
                right: { type: "Num", value: 2 },
              },
            },
            right: { type: "Num", value: 5 },
          },
          right: {
            type: "Call",
            callee: { type: "Ident", name: "max" },
            args: [
              { type: "Num", value: 6 },
              { type: "Num", value: 7 },
            ],
          },
        },
      },
      ifTrue: { type: "Num", value: 16 },
      ifFalse: {
        type: "Binary",
        op: "OR",
        left: {
          type: "Binary",
          op: "AND",
          left: {
            type: "Binary",
            op: "GT",
            left: {
              type: "Unary",
              op: "MINUS",
              operand: { type: "Num", value: 8 },
            },
            right: { type: "Num", value: 9 },
          },
          right: {
            type: "Binary",
            op: "LT",
            left: { type: "Num", value: 10 },
            right: { type: "Num", value: 11 },
          },
        },
        right: {
          type: "Binary",
          op: "NEQ",
          left: {
            type: "Binary",
            op: "LTE",
            left: {
              type: "Binary",
              op: "GTE",
              left: { type: "Num", value: 12 },
              right: { type: "Num", value: 13 },
            },
            right: { type: "Num", value: 14 },
          },
          right: { type: "Num", value: 15 },
        },
      },
    });
  });

  it("should parse a less-than comparison (1 < 2)", () => {
    const tokens: Token[] = lexer.scan("1<2");

    const [ast] = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "LT",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should parse an equality comparison (1 == 2)", () => {
    const tokens: Token[] = lexer.scan("1==2");

    const [ast] = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Binary",
      op: "EQ",
      left: { type: "Num", value: 1 },
      right: { type: "Num", value: 2 },
    });
  });

  it("should parse a ternary conditional (1 ? 2 : 3)", () => {
    const tokens: Token[] = lexer.scan("1?2:3")

    const [ast] = parser.parse(tokens);

    expect(ast).toEqual({
      type: "Ternary",
      test: { type: "Num", value: 1 },
      ifTrue: { type: "Num", value: 2 },
      ifFalse: { type: "Num", value: 3 },
    });
  });
});