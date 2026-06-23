import { Ident, Kind, Num, Token } from "../lexer/token";
import { ParserError } from "./errors";
import { IParser, Node } from "./types";



export class Parser implements IParser {
  pos: number = 0;

  constructor(private tokens: Token[]) {}
  
  private peek() { return this.tokens[this.pos]; }
  private advance() { return this.tokens[this.pos++]; }
  private check(kind: Kind) { return this.peek() && this.peek().kind === kind; }
  private expect(kind: Kind) { 
    if (!this.check(kind)) throw new ParserError("Another error to be more specific about.");
    return this.advance();
  }

  private NumberNode(value: number): Node {
    return { type: "Num", value}
  }

  private IdentNode(name: string): Node {
    return { type: "Ident", name}
  }
  
  public parse(): Node {
    return this.parseExpr();
  };

  private parseExpr(): Node {
    return this.parsePrimary();
  }

  private parsePrimary(): Node {
    let node = this.peek();
    switch(node.kind) {
      case "NUM":
        return this.NumberNode((this.advance() as Num).value);
      case "IDENT":
        return this.IdentNode((this.advance() as Ident).name);
      case "LPAREN":
        let inner: Node = this.parseExpr();
        this.expect("RPAREN");
      default:
        throw new ParserError("We borked, figure out a better message later.")
    }
  }
} 