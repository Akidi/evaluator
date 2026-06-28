import { ICursor } from "../cursor";
import { Token, RelOp, MAX_RELOP_LEN, RELOP_BY_LEN } from "../token";
import { TokenRule } from "./types";

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

  // maximal munch: try the longest operator first so `<=` beats `<`
  private longest(cursor: ICursor): [RelOp["kind"], number] | undefined {
    const c = cursor.current();
    if (c === undefined) return undefined;

    for (let len = MAX_RELOP_LEN; len >= 1; len--) {
      let slice = c;
      let complete = true;
      for (let i = 1; i < len; i++) {
        const ch = cursor.peek(i);
        if (ch === undefined) { complete = false; break; }
        slice += ch;
      }
      if (!complete) continue;

      const kind = RELOP_BY_LEN.get(len)?.[slice];
      if (kind) return [kind, len];
    }
    return undefined;
  }
}