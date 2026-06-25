import { Ident, Kind, Num, Punct, RelOp, Token } from "../lexer/token";
import { ParserError, ParserMissingTokensError, ParserUnexpectedTokenError } from "./errors";
import { BinaryNode, CallNode, IdentNode, IParser, Node, NumNode, TernaryNode, UnaryNode } from "./types";

export class Parser implements IParser {
  pos: number = 0;
  tokens: Token[] = [];
  // binary operators only — consulted by the infix loop in parseExpr
  INFIX_BP: Map<Kind, {bp: number, rightAssoc?: boolean}> = new Map([
    ["QUESTION", {bp: 5}],
    ["OR", {bp: 10}],
    ["AND", {bp: 20}],
    ["EQ", {bp: 40}],
    ["LT", {bp: 40}],
    ["LTE", {bp: 40}],
    ["GT", {bp: 40}],
    ["GTE", {bp: 40}],
    ["NEQ", {bp: 40}],
    ["PLUS", {bp: 50}],
    ["MINUS", {bp: 50}],
    ["STAR", {bp: 60}],
    ["SLASH", {bp: 60}],
    ["CARROT", {bp: 70, rightAssoc: true}],
    ["LPAREN", {bp: 80}]
  ])

  // unary operators only — how far each reaches into its operand, consulted by parseUnary
  PREFIX_BP: Map<Kind, number> = new Map([
    ["NOT", 3],
    ["MINUS", 6.5],
  ])

  constructor() {}
  
  private peek(): Token { return this.tokens[this.pos]; }
  private advance(): Token { return this.tokens[this.pos++]; }
  private check(kind: Kind): boolean { return this.peek() && this.peek().kind === kind; }
  private expect(kind: Kind, token: Token): Token { 
    if (!this.check(kind)) throw new ParserUnexpectedTokenError(token);
    return this.advance();
  }

  private NumberNode(value: number): NumNode {
    return { type: "Num", value}
  }

  private IdentNode(name: string): IdentNode {
    return { type: "Ident", name}
  }

  private UnaryNode(op: "MINUS" | "NOT", operand: Node): UnaryNode {
    return {type: "Unary", op, operand}
  }

  private BinaryNode(op: Kind, left: Node, right: Node): BinaryNode {
    return {type: "Binary", op, left, right}
  }

  private CallNode(callee: Node, args: Node[]): CallNode {
    return {type: "Call", callee, args};
  }

  private TernaryNode(cond: Node, test: Node, ifTrue: Node, ifFalse: Node): TernaryNode {
    return { type: "Ternary", test, ifTrue, ifFalse};
  }
  
  public parse(tokens: Token[]): Node {
    this.tokens = tokens;
    this.pos = 0;
    return this.parseExpr();
  };

  private parseExpr(minBp: number = 0): Node {
    let left: Node = this.parsePrefix();
    
    while (true) {
      let op = this.peek();
      const bp = this.INFIX_BP.get(op.kind);
      if (bp === undefined || bp.bp < minBp) break;
      if (op.kind === "LPAREN") {
        this.advance();
        const args: Node[] = [];

        if (this.peek().kind !== 'RPAREN') {
          args.push(this.parseExpr(0))
          
          while(this.peek().kind === 'COMMA') {
            this.advance();
            args.push(this.parseExpr(0));
          }
        }


        this.expect('RPAREN', this.peek());
        left = this.CallNode(left, args);
        continue;
      }

      if (op.kind === "QUESTION") {
        this.advance();
        const test = this.peek().kind;
        this.advance();
        
        if (this.peek().kind === "COLON") {
          this.advance
        }
        
        continue;
      }
      this.advance();
      const right = this.parseExpr(bp.rightAssoc ? bp.bp : bp.bp + 1);
      left = this.BinaryNode(op.kind, left, right);
    }
    return left;
  }

  private parsePrefix(): Node {
    const token = this.advance();
  
    switch (token.kind) {
      // --- Primary Literals ---
      case "NUM":
        return this.NumberNode(token.value);
      case "IDENT":
        return this.IdentNode(token.name);
  
      // --- Grouping ---
      case "LPAREN": 
      case "LBRACKET": {
        const inner = this.parseExpr(0);
        this.expect("RPAREN", this.peek());
        return inner;
      }
  
      // --- Unary Operators ---
      case "MINUS":
      case "NOT": {
        const operand = this.parseExpr(this.PREFIX_BP.get(token.kind));
        return this.UnaryNode(token.kind, operand);
      }
  
      default:
        throw new ParserUnexpectedTokenError(token);
    }
  }
} 