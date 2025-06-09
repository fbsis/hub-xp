import { ISBN } from './ISBN';

describe('ISBN Value Object', () => {
  describe('constructor', () => {
    it('should create valid ISBN-10', () => {
      const isbn = new ISBN('1234567890');
      expect(isbn.getValue()).toBe('1234567890');
    });

    it('should create valid ISBN-13', () => {
      const isbn = new ISBN('9781234567890');
      expect(isbn.getValue()).toBe('9781234567890');
    });

    it('should create ISBN with X check digit', () => {
      const isbn = new ISBN('123456789X');
      expect(isbn.getValue()).toBe('123456789X');
    });

    it('should handle formatted ISBN with dashes and spaces', () => {
      const isbn1 = new ISBN('978-3-16-148410-0');
      expect(isbn1.getValue()).toBe('9783161484100');

      const isbn2 = new ISBN('978 3 16 148410 0');
      expect(isbn2.getValue()).toBe('9783161484100');
    });

    it('should throw error for invalid length', () => {
      expect(() => new ISBN('123')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
      expect(() => new ISBN('12345678901234567890')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
    });

    it('should throw error for invalid characters', () => {
      expect(() => new ISBN('12345abcde')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
      expect(() => new ISBN('978123456789Y')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
    });

    it('should throw error for empty string', () => {
      expect(() => new ISBN('')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
      expect(() => new ISBN('   ')).toThrow('Invalid ISBN format. Must be 10 or 13 digits.');
    });
  });

  describe('getValue', () => {
    it('should return cleaned ISBN value', () => {
      const isbn = new ISBN('978-3-16-148410-0');
      expect(isbn.getValue()).toBe('9783161484100');
    });
  });

  describe('getFormatted', () => {
    it('should format ISBN-10 correctly', () => {
      const isbn = new ISBN('1234567890');
      expect(isbn.getFormatted()).toBe('1-234-56789-0');
    });

    it('should format ISBN-13 correctly', () => {
      const isbn = new ISBN('9781234567890');
      expect(isbn.getFormatted()).toBe('978-1-23-456789-0');
    });
  });

  describe('toString', () => {
    it('should return unformatted ISBN', () => {
      const isbn = new ISBN('978-3-16-148410-0');
      expect(isbn.toString()).toBe('9783161484100');
    });
  });

  describe('equals', () => {
    it('should return true for equal ISBNs', () => {
      const isbn1 = new ISBN('978-3-16-148410-0');
      const isbn2 = new ISBN('9783161484100');
      expect(isbn1.equals(isbn2)).toBe(true);
    });

    it('should return false for different ISBNs', () => {
      const isbn1 = new ISBN('9781234567890');
      const isbn2 = new ISBN('9780987654321');
      expect(isbn1.equals(isbn2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create ISBN from valid string', () => {
        const isbn = ISBN.fromString('9781234567890');
        expect(isbn.getValue()).toBe('9781234567890');
      });
    });

    describe('isValid', () => {
      it('should return true for valid ISBNs', () => {
        expect(ISBN.isValid('1234567890')).toBe(true);
        expect(ISBN.isValid('123456789X')).toBe(true);
        expect(ISBN.isValid('9781234567890')).toBe(true);
        expect(ISBN.isValid('978-1-23-456789-0')).toBe(true);
      });

      it('should return false for invalid ISBNs', () => {
        expect(ISBN.isValid('123')).toBe(false);
        expect(ISBN.isValid('abcdefghij')).toBe(false);
        expect(ISBN.isValid('')).toBe(false);
        expect(ISBN.isValid('12345678901234567890')).toBe(false);
      });
    });
  });
}); 