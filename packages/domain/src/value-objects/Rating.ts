export class Rating {
  private readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: Rating): boolean {
    return this.value === other.value;
  }

  static fromNumber(value: number): Rating {
    return new Rating(value);
  }

  static isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }
} 