import type { ICursor } from "../cursor";
import type { Token } from "../token";

export interface TokenRule {
  match(cursor: ICursor, c?: string): boolean; // applies at the current char?
  scan(cursor: ICursor, c: string): Token | null; // consume input; null = produced nothing (whitespace)
}