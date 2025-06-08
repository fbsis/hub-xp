export class ReviewerName {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length === 0) {
      throw new Error('Reviewer name cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new Error('Reviewer name cannot exceed 100 characters');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ReviewerName): boolean {
    return this.value === other.value;
  }

  static fromString(value: string): ReviewerName {
    return new ReviewerName(value);
  }

  static isValid(value: string): boolean {
    try {
      new ReviewerName(value);
      return true;
    } catch {
      return false;
    }
  }
} 