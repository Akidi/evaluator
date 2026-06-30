import { Evaluator } from "./evaluator/evaluator";
import { IEvaluator } from "./evaluator/types";
import { Lexer } from "./lexer/lexer";
import { ILexer } from "./lexer/types";
import { Parser } from "./parser/parser";
import { IParser } from "./parser/types";

const lexer = new Lexer();
const parser = new Parser();

export interface IFormulate {
  run: (formulae: string) => boolean | number;
}

export class Formulate implements IFormulate {
  lexer: ILexer = lexer;
  parser: IParser = parser;
  constructor(private evaluator: IEvaluator = new Evaluator()) {}
  run(formulae: string): boolean | number {
    const tokens = lexer.scan(formulae);
    const [ast, identList] = parser.parse(tokens);
    return this.evaluator.evaluate(ast, identList);
  }
}