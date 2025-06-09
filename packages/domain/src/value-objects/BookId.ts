export class BookId {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!this.isValidObjectId(trimmed)) {
      throw new Error('Invalid ObjectId format');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: BookId): boolean {
    return this.value === other.value;
  }

  private isValidObjectId(id: string): boolean {
    // MongoDB ObjectId: 24 character hex string
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  static fromString(value: string): BookId {
    return new BookId(value);
  }

  static isValid(value: string): boolean {
    try {
      new BookId(value);
      return true;
    } catch {
      return false;
    }
  }
} 