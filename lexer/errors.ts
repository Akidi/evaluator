import { ProjectError } from "../shared/errors";

export class LexerError extends ProjectError {}

export class LexerUnknownCharError extends LexerError {
  constructor(char: string, column: number) {
    super(`Unexpected character '${char}' at column ${column}.`);
  }
}

export class LexerDecimalError extends LexerError {
  constructor(column: number) {
    super(`Missing number either before or after a decimal @ column ${column} Must be in form of x.y`);
  }
}

export class LexerDuplicateDecimalError extends LexerError {
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