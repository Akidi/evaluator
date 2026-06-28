import { CursorSourceError } from "./errors";

export interface ICursor {
  getSource: () => string | undefined;
  setSource: (src: string) => void;
  current: () => string | undefined;
  peek: (offset?: number) => string | undefined;
  advance: (num?: number) => void;
  column: () => number;
  line: () => number;
}

export class Cursor implements ICursor {
  private index = 0;
  private src: string | undefined;
  private lineNo = 1;

  setSource(src: string) {
    this.index = 0;
    this.lineNo = 1;
    this.src = src;
  }

  getSource(): string | undefined {
    return this.src;
  }

  current() {
    if (this.src === undefined) throw new CursorSourceError();
    return this.src[this.index];
  }

  peek(offset: number = 1) {
    if (this.src === undefined) throw new CursorSourceError();
    return this.src[this.index + offset];
  }

  advance(num = 1) {
    if (this.src === undefined) throw new CursorSourceError();
    for (let i = 0; i < num; i++) {
      if (this.src[this.index] === "\n") this.lineNo++;
      this.index++;
    }
  }

  column() {
    if (this.src === undefined) throw new CursorSourceError();
    return this.index + 1;
  }

  line() {
    return this.lineNo;
  }
}
