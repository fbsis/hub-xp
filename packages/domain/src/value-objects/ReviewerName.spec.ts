import { ReviewerName } from './ReviewerName';

describe('ReviewerName Value Object', () => {
  describe('constructor', () => {
    it('should create valid reviewer name', () => {
      const name = new ReviewerName('John Doe');
      expect(name.getValue()).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      const name = new ReviewerName('  Jane Smith  ');
      expect(name.getValue()).toBe('Jane Smith');
    });

    it('should throw error for empty name', () => {
      expect(() => new ReviewerName('')).toThrow('Reviewer name cannot be empty');
      expect(() => new ReviewerName('   ')).toThrow('Reviewer name cannot be empty');
    });

    it('should throw error for name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(() => new ReviewerName(longName)).toThrow('Reviewer name cannot exceed 100 characters');
    });

    it('should accept name with exactly 100 characters', () => {
      const maxName = 'a'.repeat(100);
      const name = new ReviewerName(maxName);
      expect(name.getValue()).toBe(maxName);
    });
  });

  describe('getValue', () => {
    it('should return the name value', () => {
      const name = new ReviewerName('Alice Johnson');
      expect(name.getValue()).toBe('Alice Johnson');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const name = new ReviewerName('Bob Wilson');
      expect(name.toString()).toBe('Bob Wilson');
    });
  });

  describe('equals', () => {
    it('should return true for equal names', () => {
      const name1 = new ReviewerName('Charlie Brown');
      const name2 = new ReviewerName('Charlie Brown');
      expect(name1.equals(name2)).toBe(true);
    });

    it('should return false for different names', () => {
      const name1 = new ReviewerName('David Lee');
      const name2 = new ReviewerName('Emma Davis');
      expect(name1.equals(name2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create reviewer name from valid string', () => {
        const name = ReviewerName.fromString('Frank Miller');
        expect(name.getValue()).toBe('Frank Miller');
      });

      it('should throw for invalid string', () => {
        expect(() => ReviewerName.fromString('')).toThrow();
      });
    });

    describe('isValid', () => {
      it('should return true for valid names', () => {
        expect(ReviewerName.isValid('Valid Name')).toBe(true);
        expect(ReviewerName.isValid('a'.repeat(100))).toBe(true);
        expect(ReviewerName.isValid('John')).toBe(true);
      });

      it('should return false for invalid names', () => {
        expect(ReviewerName.isValid('')).toBe(false);
        expect(ReviewerName.isValid('   ')).toBe(false);
        expect(ReviewerName.isValid('a'.repeat(101))).toBe(false);
      });
    });
  });
}); 