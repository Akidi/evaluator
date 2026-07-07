import type { ICursor } from "../cursor";
import type { Token } from "../token";

export interface TokenRule {
  match(cursor: ICursor): boolean; // applies at the current char?
  scan(cursor: ICursor): Token | null; // consume input; null = produced nothing (whitespace)
}