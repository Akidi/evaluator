import type { ICursor } from "../cursor";
import { type Token, type RelOp, RELOPS_BY_MUNCH } from "../token";
import type { TokenRule } from "./types";

export class RelOpRule implements TokenRule {
  match(cursor: ICursor): boolean {
    return this.longest(cursor) !== undefined;
  }

  scan(cursor: ICursor): Token {
    const start = cursor.column();
    const line = cursor.line();
    const found = this.longest(cursor);
    // match() gates scan(), so found is always defined here; the throw is a
    // contract guard, not an expected path.
    if (found === undefined) {
      throw new Error("RelOpRule.scan called when no relop matches");
    }
    const [kind, len] = found;
    cursor.advance(len);
    return { kind, position: { start, end: cursor.column(), line } };
  }

  // maximal munch: RELOPS_BY_MUNCH is longest-first, so the first hit wins
  private longest(cursor: ICursor): [RelOp["kind"], number] | undefined {
    for (const { chars, kind } of RELOPS_BY_MUNCH) {
      if (cursor.startsWith(chars)) return [kind, chars.length];
    }
    return undefined;
  }
}