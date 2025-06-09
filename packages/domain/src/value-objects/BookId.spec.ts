import { BookId } from './BookId';

describe('BookId Value Object', () => {
  const validObjectId = '507f1f77bcf86cd799439011';

  describe('constructor', () => {
    it('should create valid BookId with ObjectId string', () => {
      const bookId = new BookId(validObjectId);
      expect(bookId.getValue()).toBe(validObjectId);
    });

    it('should throw error for invalid ObjectId format', () => {
      expect(() => new BookId('invalid')).toThrow('Invalid ObjectId format');
      expect(() => new BookId('123')).toThrow('Invalid ObjectId format');
      expect(() => new BookId('507f1f77bcf86cd79943901')).toThrow('Invalid ObjectId format'); // too short
      expect(() => new BookId('507f1f77bcf86cd7994390111')).toThrow('Invalid ObjectId format'); // too long
    });

    it('should throw error for non-hex characters', () => {
      expect(() => new BookId('507f1f77bcf86cd79943901g')).toThrow('Invalid ObjectId format');
      expect(() => new BookId('507f1f77bcf86cd79943901Z')).toThrow('Invalid ObjectId format');
    });

    it('should throw error for empty string', () => {
      expect(() => new BookId('')).toThrow('Invalid ObjectId format');
      expect(() => new BookId('   ')).toThrow('Invalid ObjectId format');
    });
  });

  describe('getValue', () => {
    it('should return the ObjectId value', () => {
      const bookId = new BookId(validObjectId);
      expect(bookId.getValue()).toBe(validObjectId);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const bookId = new BookId(validObjectId);
      expect(bookId.toString()).toBe(validObjectId);
    });
  });

  describe('equals', () => {
    it('should return true for equal BookIds', () => {
      const bookId1 = new BookId(validObjectId);
      const bookId2 = new BookId(validObjectId);
      expect(bookId1.equals(bookId2)).toBe(true);
    });

    it('should return false for different BookIds', () => {
      const bookId1 = new BookId('507f1f77bcf86cd799439011');
      const bookId2 = new BookId('507f1f77bcf86cd799439012');
      expect(bookId1.equals(bookId2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create BookId from valid string', () => {
        const bookId = BookId.fromString(validObjectId);
        expect(bookId.getValue()).toBe(validObjectId);
      });

      it('should throw for invalid string', () => {
        expect(() => BookId.fromString('invalid')).toThrow();
      });
    });

    describe('isValid', () => {
      it('should return true for valid ObjectIds', () => {
        expect(BookId.isValid('507f1f77bcf86cd799439011')).toBe(true);
        expect(BookId.isValid('507f191e810c19729de860ea')).toBe(true);
        expect(BookId.isValid('000000000000000000000000')).toBe(true);
        expect(BookId.isValid('ABCDEF123456789012345678')).toBe(true); // uppercase hex
      });

      it('should return false for invalid ObjectIds', () => {
        expect(BookId.isValid('invalid')).toBe(false);
        expect(BookId.isValid('507f1f77bcf86cd79943901')).toBe(false); // too short
        expect(BookId.isValid('507f1f77bcf86cd7994390111')).toBe(false); // too long
        expect(BookId.isValid('507f1f77bcf86cd79943901g')).toBe(false); // invalid char
        expect(BookId.isValid('')).toBe(false);
      });
    });
  });
}); 