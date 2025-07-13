export class AverageRating {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0 || value > 5) {
      throw new Error('Average rating must be between 0 and 5');
    }
    if (Number.isNaN(value)) {
      throw new Error('Average rating cannot be NaN');
    }
    this.value = Math.round(value * 10) / 10; // Round to 1 decimal place
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toFixed(1);
  }

  equals(other: AverageRating): boolean {
    return this.value === other.value;
  }

  static fromNumber(value: number): AverageRating {
    return new AverageRating(value);
  }

  static zero(): AverageRating {
    return new AverageRating(0);
  }

  static isValid(value: number): boolean {
    try {
      new AverageRating(value);
      return true;
    } catch {
      return false;
    }
  }
} 