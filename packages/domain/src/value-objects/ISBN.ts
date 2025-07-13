export class ISBN {
  private readonly value: string;

  constructor(value: string) {
    const cleaned = value.replace(/[-\s]/g, '').toUpperCase();
    if (!this.isValidFormat(cleaned)) {
      throw new Error('Invalid ISBN format. Must be 10 or 13 digits.');
    }
    this.value = cleaned;
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    if (this.value.length === 10) {
      return `${this.value.slice(0, 1)}-${this.value.slice(1, 4)}-${this.value.slice(4, 9)}-${this.value.slice(9)}`;
    } else {
      return `${this.value.slice(0, 3)}-${this.value.slice(3, 4)}-${this.value.slice(4, 6)}-${this.value.slice(6, 12)}-${this.value.slice(12)}`;
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: ISBN): boolean {
    return this.value === other.value;
  }

  private isValidFormat(isbn: string): boolean {
    // ISBN-10: 9 digits + 1 digit or X
    // ISBN-13: 13 digits
    return /^\d{9}[\dX]$/.test(isbn) || /^\d{13}$/.test(isbn);
  }

  static fromString(value: string): ISBN {
    return new ISBN(value);
  }

  static isValid(value: string): boolean {
    try {
      new ISBN(value);
      return true;
    } catch {
      return false;
    }
  }
} 