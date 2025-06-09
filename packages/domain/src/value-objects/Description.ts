export class Description {
  private readonly value: string;

  constructor(value: string = '') {
    const trimmed = value.trim();
    if (trimmed.length > 1000) {
      throw new Error('Description cannot exceed 1000 characters');
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

  equals(other: Description): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): Description {
    return new Description(value);
  }

  static empty(): Description {
    return new Description('');
  }

  static isValid(value: string): boolean {
    try {
      new Description(value);
      return true;
    } catch {
      return false;
    }
  }
} 