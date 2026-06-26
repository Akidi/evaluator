import { Node } from "../parser/types";
import { FnEnv, IEvaluator, VarEnv } from "./types";

let FNRegistry: FnEnv = new Map();
let VARRegistry: VarEnv = new Map();

export class Evaluator implements IEvaluator {
  evaluate(ast: Node): number | boolean {
    return 1;
  }
}