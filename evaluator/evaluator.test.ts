import { describe, expect, it } from "vitest";
import { Evaluator } from "./evaluator";
import { IEvaluator } from "./types";
import { EvaluatorError, InvalidOperandError, UndefinedVariableError } from "./errors";

const evaluator: IEvaluator = new Evaluator();

describe("Evaluator", () => {
  it("evaluates a Num node to its value", () => {
    expect(evaluator.evaluate({ type: "Num", value: 1 })).toBe(1);
  });

  it("evaluates an Ident node to its assigned value", () => {
    evaluator.setVar("x", 5);

    expect(evaluator.evaluate({ type: "Ident", name: "x" })).toBe(5);
  });

  it("throws UndefinedVariableError for an unassigned Ident", () => {
    expect(() => evaluator.evaluate({ type: "Ident", name: "y" })).toThrow(UndefinedVariableError);
  });

  it("evaluates a Unary MINUS node by negating its operand", () => {
    expect(evaluator.evaluate({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Num", value: 4 },
    })).toBe(-4);
  });

  it("evaluates a Unary MINUS node by negating a non-literal operand (Ident)", () => {
    const evaluator: IEvaluator = new Evaluator();
    evaluator.setVar("x", 5);

    expect(evaluator.evaluate({
      type: "Unary",
      op: "MINUS",
      operand: { type: "Ident", name: "x" },
    })).toBe(-5);
  });

  it("throws InvalidOperandError for a Unary NOT on a non-boolean operand", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(() => evaluator.evaluate({
      type: "Unary",
      op: "NOT",
      operand: { type: "Num", value: 0 },
    })).toThrow(InvalidOperandError);
  });

  it("evaluates a Binary PLUS node by adding both operands", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "PLUS",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(5);
  });

  it("evaluates a Binary STAR node by multiplying both operands", () => {
    const evaluator: IEvaluator = new Evaluator();

    expect(evaluator.evaluate({
      type: "Binary",
      op: "STAR",
      left: { type: "Num", value: 2 },
      right: { type: "Num", value: 3 },
    })).toBe(6);
  });

  it("throws a Binary-specific error for an op not yet wired into MATH_OPS/COMP_OPS, distinct from the generic unhandled-node-type error", () => {
    const evaluator: IEvaluator = new Evaluator();
    let caught: unknown;

    try {
      evaluator.evaluate({
        type: "Binary",
        op: "AND",
        left: { type: "Num", value: 1 },
        right: { type: "Num", value: 0 },
      });
    } catch (e) {
      caught = e;
    }

    expect(caught).toBeInstanceOf(EvaluatorError);
    expect((caught as Error).message).not.toMatch(/Unhandled node type/);
  });
});
