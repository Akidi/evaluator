import { Cursor, ICursor } from "./cursor";
import { UnknownCharacterError } from "./errors";
import {
  IdentRule,
  NumberRule,
  PunctRule,
  RelOpRule,
  WhitespaceRule,
} from "./rules";
import { TokenRule } from "./rules/types";
import { Token } from "./token";

export interface ILexer {
  scan: (src: string) => Token[];
}

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

// export class Lexer implements ILexer {
//   private tokens: Token[] = [];
//   private cursor: ICursor;
//   private scanners: Scanner[];
//   private rules: TokenRule[] = [
//     new WhitespaceRule(),
//     new
//   ]

//   constructor() {
//     this.cursor = new Cursor();
//     this.scanners = [
//       { test: isDigit, scan: (c) => scanNumber(this.cursor, c) },
//       { test: isLetter, scan: (c) => scanIdent(this.cursor, c) },
//     ];
//   }

//   public scan(src: string): Token[] {
//     this.tokens = [];
//     this.cursor.setSource(src);
//     let c: string | undefined;
//     while ((c = this.cursor.current()) !== undefined) {
//       const start = this.cursor.column();
//       const line = this.cursor.line();

//       const relop = this.matchRelOp(c);
//       if (isWhitespace(c)) {
//         this.cursor.advance();
//         continue;
//       }
//       if (relop) {
//         const [kind, len] = relop;
//         this.tokens.push(makeToken(kind, start, start + len, line));
//         this.cursor.advance(len);
//         continue;
//       }

//       if (PUNCT[c]) {
//         this.tokens.push(makeToken(PUNCT[c], start, start + 1, line));
//         this.cursor.advance();
//         continue;
//       }

//       const scanner = this.scanners.find((s) => s.test(c!));
//       if (scanner) {
//         this.tokens.push(scanner.scan(c));
//         continue;
//       }

//       throw new UnknownCharacterError(c, start);
//     }
//     this.tokens.push(makeToken("EOF", this.cursor.column(), this.cursor.column(), this.cursor.line()));
//     return this.tokens;
//   }

//   private matchRelOp(c: string): [RelOp['kind'], number] | undefined {
//     for (let len = MAX_RELOP_LEN; len >= 1; len--) {
//       let slice = c;
//       let complete = true;
//       for (let i = 1; i < len; i++) {
//         const ch = this.cursor.peek(i);
//         if (ch === undefined) { complete = false; break; }
//         slice += ch;
//       }
//       if (!complete) continue;
//       const kind = RELOP_BY_LEN.get(len)?.[slice];
//       if (kind) return [kind, len];
//     }
//     return undefined;
//   }
// }
