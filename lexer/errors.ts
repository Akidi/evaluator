export class LexerError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "LexerError";
  }
}

export class LexerUnknownCharError extends LexerError {
  constructor(char: string, column: number) {
    const message = `Unexpected character '${char}' at column ${column}`;
    super();
    this.name = 'LexerUnknownCharError';
    this.message = message;
  }
}

export class CursorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CursorError";
    this.message = message;
  }
}

export class CursorSourceError extends CursorError {
  constructor() {
    const message = "Cursor Source missing use setSource to set the source before trying again.";
    super(message);
    this.name = 'CursorSourceError';
    this.message = message;
  }
}