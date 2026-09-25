import { ProjectError } from "../shared/errors";

export class LexerError extends ProjectError {}

export class UnknownCharacterError extends LexerError {
  constructor(char: string, column: number) {
    super(`Unexpected character '${char}' at column ${column}.`);
  }
}

export class MalformedDecimalNumberError extends LexerError {
  constructor(column: number) {
    super(`Malformed decimal number at column ${column}, only accepted format is x.y`)
  }
}

export class DuplicateDecimalError extends LexerError {
  constructor(column: number) {
    super(`Duplicate decimal located @ column ${column} Numbers can contain only 1 decimal.`);
  }
}

export class CursorError extends ProjectError {}

export class CursorSourceError extends CursorError {
  constructor() {
    super("Cursor Source missing use setSource to set the source before trying again.");
  }
}