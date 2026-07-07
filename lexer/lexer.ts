import { Cursor, type ICursor } from "./cursor";
import { UnknownCharacterError } from "./errors";
import {
  IdentRule,
  NumberRule,
  PunctRule,
  RelOpRule,
  WhitespaceRule,
} from "./rules";
import type { TokenRule } from "./rules/types";
import type { Token } from "./token";
import type { ILexer } from "./types";



export class Lexer implements ILexer {
  private rules: TokenRule[] = [
    new WhitespaceRule(),
    new NumberRule(),
    new IdentRule(),
    new RelOpRule(),
    new PunctRule(),
  ];

  constructor(private cursor: ICursor = new Cursor()) {}

  scan(src: string): Token[] {
    this.cursor.setSource(src);
    const tokens: Token[] = [];
    let c: string | undefined;
    while ((c = this.cursor.current()) !== undefined) {
      const rule = this.rules.find((r) => r.match(this.cursor));
      if (!rule) throw new UnknownCharacterError(c, this.cursor.column());
      const token = rule.scan(this.cursor);
      if (token) tokens.push(token);
    }
    tokens.push({
      kind: "EOF",
      position: {
        start: this.cursor.column(),
        end: this.cursor.column(),
        line: this.cursor.line(),
      },
    });
    return tokens;
  }
}