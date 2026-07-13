import type { ICursor } from "../cursor";
import { MalformedDecimalNumberError, DuplicateDecimalError } from "../errors";
import type { Token } from "../token";
import { isDigit } from "./shared";
import type { TokenRule } from "./types";

export class NumberRule implements TokenRule {
  match(cur: ICursor): boolean {
    const c = cur.current();
    return c !== undefined && isDigit(c);
  }
  scan(cur: ICursor): Token {
    let start: number = cur.column();
    let line: number = cur.line();
    let isFloat: boolean = false;
    // match() guarantees a current char here
    let value = cur.current()!;
    cur.advance();
    let next: string | undefined;
    while ((next = cur.current()) !== undefined) {
      const isPeriod = next === ".";
      const peek = cur.peek();

      if (!isDigit(next) && !isPeriod) break;
      if (isPeriod && isFloat) throw new DuplicateDecimalError(cur.column());
      if (isPeriod && (!peek || !isDigit(peek)))
        throw new MalformedDecimalNumberError(cur.column());
      if (isPeriod) isFloat = true;

      value += next;
      cur.advance();
    }

    return {
      kind: "NUM",
      value: Number(value),
      position: { start, end: cur.column(), line },
    };
  }
}