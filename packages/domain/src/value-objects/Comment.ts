export class Comment {
  private readonly value: string;

  constructor(value: string = '') {
    const trimmed = value.trim();
    if (trimmed.length > 500) {
      throw new Error('Comment cannot exceed 500 characters');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  isEmpty(): boolean {
    return this.value.length === 0;
  }

  equals(other: Comment): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): Comment {
    return new Comment(value);
  }

  static empty(): Comment {
    return new Comment('');
  }

  static isValid(value: string): boolean {
    try {
      new Comment(value);
      return true;
    } catch {
      return false;
    }
  }
} 