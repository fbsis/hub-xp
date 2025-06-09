export class BookTitle {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length === 0) {
      throw new Error('Book title cannot be empty');
    }
    if (trimmed.length > 200) {
      throw new Error('Book title cannot exceed 200 characters');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: BookTitle): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): BookTitle {
    return new BookTitle(value);
  }

  static isValid(value: string): boolean {
    try {
      new BookTitle(value);
      return true;
    } catch {
      return false;
    }
  }
} 