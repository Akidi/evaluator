import { ICursor } from "../cursor";
import { TokenRule } from "./types";

export class WhitespaceRule implements TokenRule {
  match(cur: ICursor) {
    const c = cur.current();
    return (
      c !== undefined && (c === " " || c === "\t" || c === "\n" || c === "\r")
    );
  }
  scan(cur: ICursor) {
    cur.advance();
    return null;
  }
}