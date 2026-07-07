import type { ICursor } from "../cursor";
import { type Punct, PUNCT_TO_CHAR, type Token } from "../token";
import type { TokenRule } from "./types";


const PUNCT = Object.fromEntries(
  Object.entries(PUNCT_TO_CHAR).map(([kind, char]) => [char, kind]),
) as Record<string, Punct["kind"]>;

export class PunctRule implements TokenRule {
  match(cur: ICursor) {
    const c = cur.current();
    return c !== undefined && c in PUNCT;
  }
  scan(cur: ICursor): Token {
    const start = cur.column(),
      line = cur.line();
    const kind = PUNCT[cur.current()!];
    cur.advance();
    return { kind, position: { start, end: cur.column(), line } };
  }
}