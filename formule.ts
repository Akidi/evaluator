import { Evaluator } from "./evaluator/evaluator";
import { IEvaluator } from "./evaluator/types";
import { Lexer, ILexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";
import { IParser } from "./parser/types";

const lexer = new Lexer();
const parser = new Parser();
const evaluator = new Evaluator();

export class Formulate {
  lexer: ILexer = lexer;
  parser: IParser = parser;
  evaluator: IEvaluator = evaluator;
  constructor() {}
  run(formulae: string): boolean | number {
    const tokens = lexer.scan(formulae);
    const [ast, identList] = parser.parse(tokens);
    return evaluator.evaluate(ast, identList);
  }
}