import { Description } from './Description';

describe('Description Value Object', () => {
  describe('constructor', () => {
    it('should create valid description', () => {
      const desc = new Description('A great book about programming');
      expect(desc.getValue()).toBe('A great book about programming');
    });

    it('should trim whitespace', () => {
      const desc = new Description('  Interesting story  ');
      expect(desc.getValue()).toBe('Interesting story');
    });

    it('should accept empty description', () => {
      const desc = new Description('');
      expect(desc.getValue()).toBe('');
    });

    it('should throw error for description exceeding 1000 characters', () => {
      const longDesc = 'a'.repeat(1001);
      expect(() => new Description(longDesc)).toThrow('Description cannot exceed 1000 characters');
    });

    it('should accept description with exactly 1000 characters', () => {
      const maxDesc = 'a'.repeat(1000);
      const desc = new Description(maxDesc);
      expect(desc.getValue()).toBe(maxDesc);
    });
  });

  describe('getValue', () => {
    it('should return the description value', () => {
      const desc = new Description('Book description');
      expect(desc.getValue()).toBe('Book description');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const desc = new Description('Amazing book');
      expect(desc.toString()).toBe('Amazing book');
    });
  });

  describe('equals', () => {
    it('should return true for equal descriptions', () => {
      const desc1 = new Description('Same content');
      const desc2 = new Description('Same content');
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const desc1 = new Description('First description');
      const desc2 = new Description('Second description');
      expect(desc1.equals(desc2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create description from valid string', () => {
        const desc = Description.fromString('Valid description');
        expect(desc.getValue()).toBe('Valid description');
      });
    });

    describe('empty', () => {
      it('should create empty description', () => {
        const desc = Description.empty();
        expect(desc.getValue()).toBe('');
      });
    });

    describe('isValid', () => {
      it('should return true for valid descriptions', () => {
        expect(Description.isValid('Valid description')).toBe(true);
        expect(Description.isValid('')).toBe(true);
        expect(Description.isValid('a'.repeat(1000))).toBe(true);
      });

      it('should return false for invalid descriptions', () => {
        expect(Description.isValid('a'.repeat(1001))).toBe(false);
      });
    });
  });
}); 