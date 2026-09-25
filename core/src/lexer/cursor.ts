import { CursorSourceError } from "./errors";

export interface ICursor {
  reset: (src: string) => void;
  current: () => string | undefined;
  peek: (offset?: number) => string | undefined;
  advance: (num?: number) => void;
  column: () => number;
  line: () => number;
  startsWith: (s: string) => boolean;
}

export class Cursor implements ICursor {
  private index = 0;
  private src: string | undefined;
  private lineNo = 1;

  reset(src: string) {
    this.index = 0;
    this.lineNo = 1;
    this.src = src;
  }

  current(): string | undefined {
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

  startsWith(s: string): boolean {
    if (this.src === undefined) throw new CursorSourceError();
    return this.src.startsWith(s, this.index);
  }
}
