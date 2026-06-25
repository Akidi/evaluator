import { CursorSourceError } from "./errors";

export interface ICursor {
  getSource: () => string;
  setSource: (src: string) => void;
  current: () => string;
  peek: (offset?: number) => string | undefined;
  advance: (num?: number) => void;
  column: () => number;
  line: () => number;
}

export class Cursor implements ICursor {
  private index: number = 0;
  private src: string = "";

  setSource(src: string): void {
    this.index = 0;
    this.src = src;
  }

  getSource(): string {
    return this.src;
  }

  current(): string {
    if (!this.src) throw new CursorSourceError()
    return this.src[this.index];
  }

  peek(offset: number = 1): string {
    if (!this.src) throw new CursorSourceError()
    return this.src[this.index + offset];
  }

  advance(num: number = 1): void {
    if (!this.src) throw new CursorSourceError()
    this.index += num;
  }

  column(): number {
    if (!this.src) throw new CursorSourceError()
    return this.index + 1;
  }

  line(): number {
    if (!this.src) throw new CursorSourceError()
    let count = 1;
    for (let i = 0; i < this.index; i++) {
      if (this.src[i] === '\n') count++;
    }
    return count;
  }
}