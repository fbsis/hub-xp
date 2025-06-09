export class ReviewCount {
  private readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Review count must be a non-negative integer');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: ReviewCount): boolean {
    return this.value === other.value;
  }

  increment(): ReviewCount {
    return new ReviewCount(this.value + 1);
  }

  decrement(): ReviewCount {
    return new ReviewCount(Math.max(0, this.value - 1));
  }

  static fromNumber(value: number): ReviewCount {
    return new ReviewCount(value);
  }

  static zero(): ReviewCount {
    return new ReviewCount(0);
  }

  static isValid(value: number): boolean {
    try {
      new ReviewCount(value);
      return true;
    } catch {
      return false;
    }
  }
} 