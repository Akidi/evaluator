import { describe, expect, it } from "vitest";
import { ProjectError } from "../shared/errors";
import { EvaluatorError, UndefinedFunctionError, UndefinedVariableError } from "./errors";

describe("EvaluatorError", () => {
  it("extends ProjectError", () => {
    const err = new EvaluatorError("boom");
    expect(err).toBeInstanceOf(ProjectError);
    expect(err.message).toBe("boom");
  });
});

describe("UndefinedVariableError", () => {
  it("extends EvaluatorError", () => {
    const err = new UndefinedVariableError("x");
    expect(err).toBeInstanceOf(EvaluatorError);
  });

  it("includes the missing variable name in the message", () => {
    const err = new UndefinedVariableError("x");
    expect(err.message).toContain("x");
  });
});

describe("UndefinedFunctionError", () => {
  it("extends EvaluatorError", () => {
    const err = new UndefinedFunctionError("MAX");
    expect(err).toBeInstanceOf(EvaluatorError);
  });

  it("includes the missing function name in the message", () => {
    const err = new UndefinedFunctionError("MAX");
    expect(err.message).toContain("MAX");
  });
});
