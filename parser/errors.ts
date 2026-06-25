import { Token } from "../lexer/token";
import { ProjectError } from "../shared/errors";

export class ParserError extends ProjectError {}

export class ParserMissingTokensError extends ParserError {
  constructor() {
    super("Tokens is not defined, either supply them with parse or use addTokens.");
  }
}

export class ParserUnexpectedTokenError extends ParserError {
  constructor(token: Token) {
    super(`Unexpected next token of kind ${token.kind} found @ ${token.position.start} - ${token.position.end} Line: ${token.position.line}`)
  }
}

export class ParserExpectedPrefixToken extends ParserError {
  constructor(token: Token) {
    super(`Prefix did not find a valid starting or next token to evaluate. This is what we found ${token}`);
  }
}