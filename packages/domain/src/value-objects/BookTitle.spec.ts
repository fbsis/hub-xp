import { BookTitle } from './BookTitle';

describe('BookTitle Value Object', () => {
  describe('constructor', () => {
    it('should create valid book title', () => {
      const title = new BookTitle('Clean Architecture');
      expect(title.getValue()).toBe('Clean Architecture');
    });

    it('should trim whitespace', () => {
      const title = new BookTitle('  Clean Code  ');
      expect(title.getValue()).toBe('Clean Code');
    });

    it('should throw error for empty title', () => {
      expect(() => new BookTitle('')).toThrow('Book title cannot be empty');
      expect(() => new BookTitle('   ')).toThrow('Book title cannot be empty');
    });

    it('should throw error for title exceeding 200 characters', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => new BookTitle(longTitle)).toThrow('Book title cannot exceed 200 characters');
    });

    it('should accept title with exactly 200 characters', () => {
      const maxTitle = 'a'.repeat(200);
      const title = new BookTitle(maxTitle);
      expect(title.getValue()).toBe(maxTitle);
    });
  });

  describe('getValue', () => {
    it('should return the title value', () => {
      const title = new BookTitle('The Pragmatic Programmer');
      expect(title.getValue()).toBe('The Pragmatic Programmer');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const title = new BookTitle('Design Patterns');
      expect(title.toString()).toBe('Design Patterns');
    });
  });

  describe('equals', () => {
    it('should return true for equal titles', () => {
      const title1 = new BookTitle('Refactoring');
      const title2 = new BookTitle('Refactoring');
      expect(title1.equals(title2)).toBe(true);
    });

    it('should return false for different titles', () => {
      const title1 = new BookTitle('Clean Code');
      const title2 = new BookTitle('Clean Architecture');
      expect(title1.equals(title2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create title from valid string', () => {
        const title = BookTitle.fromString('Effective Java');
        expect(title.getValue()).toBe('Effective Java');
      });
    });

    describe('isValid', () => {
      it('should return true for valid titles', () => {
        expect(BookTitle.isValid('Valid Title')).toBe(true);
        expect(BookTitle.isValid('a'.repeat(200))).toBe(true);
      });

      it('should return false for invalid titles', () => {
        expect(BookTitle.isValid('')).toBe(false);
        expect(BookTitle.isValid('   ')).toBe(false);
        expect(BookTitle.isValid('a'.repeat(201))).toBe(false);
      });
    });
  });
}); 