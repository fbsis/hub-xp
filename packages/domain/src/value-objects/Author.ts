export class Author {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length === 0) {
      throw new Error('Author name cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new Error('Author name cannot exceed 100 characters');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Author): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): Author {
    return new Author(value);
  }

  static isValid(value: string): boolean {
    try {
      new Author(value);
      return true;
    } catch {
      return false;
    }
  }
} 