import { ICursor } from "../cursor";
import { Token } from "../token";
import { isDigit, isLetter } from "./shared";
import { TokenRule } from "./types";

export class IdentRule implements TokenRule {
  match(cur: ICursor): boolean {
    const c = cur.current();
    return c !== undefined && isLetter(c);
  }
  scan(cur: ICursor): Token {
    let start: number = cur.column();
    let line: number = cur.line();
    // match() guarantees a current char here
    let name = cur.current()!;
    cur.advance();
    let next: string | undefined;
    while ((next = cur.current()) !== undefined) {
      if (!isDigit(next) && !isLetter(next) ) break;
      name += next;
      cur.advance();
    }

    return {
      kind: "IDENT",
      name,
      position: { start, end: cur.column(), line },
    };
  }
}