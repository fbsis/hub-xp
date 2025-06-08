import { Author } from './Author';

describe('Author Value Object', () => {
  describe('constructor', () => {
    it('should create valid author', () => {
      const author = new Author('Robert C. Martin');
      expect(author.getValue()).toBe('Robert C. Martin');
    });

    it('should trim whitespace', () => {
      const author = new Author('  Martin Fowler  ');
      expect(author.getValue()).toBe('Martin Fowler');
    });

    it('should throw error for empty author', () => {
      expect(() => new Author('')).toThrow('Author name cannot be empty');
      expect(() => new Author('   ')).toThrow('Author name cannot be empty');
    });

    it('should throw error for author exceeding 100 characters', () => {
      const longAuthor = 'a'.repeat(101);
      expect(() => new Author(longAuthor)).toThrow('Author name cannot exceed 100 characters');
    });

    it('should accept author with exactly 100 characters', () => {
      const maxAuthor = 'a'.repeat(100);
      const author = new Author(maxAuthor);
      expect(author.getValue()).toBe(maxAuthor);
    });
  });

  describe('getValue', () => {
    it('should return the author value', () => {
      const author = new Author('Kent Beck');
      expect(author.getValue()).toBe('Kent Beck');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const author = new Author('Eric Evans');
      expect(author.toString()).toBe('Eric Evans');
    });
  });

  describe('equals', () => {
    it('should return true for equal authors', () => {
      const author1 = new Author('Uncle Bob');
      const author2 = new Author('Uncle Bob');
      expect(author1.equals(author2)).toBe(true);
    });

    it('should return false for different authors', () => {
      const author1 = new Author('Uncle Bob');
      const author2 = new Author('Martin Fowler');
      expect(author1.equals(author2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create author from valid string', () => {
        const author = Author.fromString('Joshua Bloch');
        expect(author.getValue()).toBe('Joshua Bloch');
      });
    });

    describe('isValid', () => {
      it('should return true for valid authors', () => {
        expect(Author.isValid('Valid Author')).toBe(true);
        expect(Author.isValid('a'.repeat(100))).toBe(true);
      });

      it('should return false for invalid authors', () => {
        expect(Author.isValid('')).toBe(false);
        expect(Author.isValid('   ')).toBe(false);
        expect(Author.isValid('a'.repeat(101))).toBe(false);
      });
    });
  });
}); 