export class PublishedYear {
  private readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Published year must be an integer');
    }
    if (value < 1000) {
      throw new Error('Published year must be after 1000');
    }
    if (value > new Date().getFullYear() + 1) {
      throw new Error('Published year cannot be in the future');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: PublishedYear): boolean {
    return this.value === other.value;
  }

  static fromNumber(value: number): PublishedYear {
    return new PublishedYear(value);
  }

  static isValid(value: number): boolean {
    try {
      new PublishedYear(value);
      return true;
    } catch {
      return false;
    }
  }
} 