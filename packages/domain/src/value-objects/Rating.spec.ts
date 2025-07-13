import { Rating } from './Rating';

describe('Rating Value Object', () => {
  describe('constructor', () => {
    it('should create a valid rating with integer values 1-5', () => {
      for (let i = 1; i <= 5; i++) {
        const rating = new Rating(i);
        expect(rating.getValue()).toBe(i);
      }
    });

    it('should throw error for rating below 1', () => {
      expect(() => new Rating(0)).toThrow('Rating must be an integer between 1 and 5');
      expect(() => new Rating(-1)).toThrow('Rating must be an integer between 1 and 5');
    });

    it('should throw error for rating above 5', () => {
      expect(() => new Rating(6)).toThrow('Rating must be an integer between 1 and 5');
      expect(() => new Rating(10)).toThrow('Rating must be an integer between 1 and 5');
    });

    it('should throw error for non-integer values', () => {
      expect(() => new Rating(3.5)).toThrow('Rating must be an integer between 1 and 5');
      expect(() => new Rating(4.7)).toThrow('Rating must be an integer between 1 and 5');
    });

    it('should throw error for NaN', () => {
      expect(() => new Rating(NaN)).toThrow('Rating must be an integer between 1 and 5');
    });
  });

  describe('getValue', () => {
    it('should return the rating value', () => {
      const rating = new Rating(4);
      expect(rating.getValue()).toBe(4);
    });
  });

  describe('toString', () => {
    it('should return string representation of rating', () => {
      const rating = new Rating(5);
      expect(rating.toString()).toBe('5');
    });
  });

  describe('equals', () => {
    it('should return true for equal ratings', () => {
      const rating1 = new Rating(3);
      const rating2 = new Rating(3);
      expect(rating1.equals(rating2)).toBe(true);
    });

    it('should return false for different ratings', () => {
      const rating1 = new Rating(3);
      const rating2 = new Rating(4);
      expect(rating1.equals(rating2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromNumber', () => {
      it('should create rating from valid number', () => {
        const rating = Rating.fromNumber(2);
        expect(rating.getValue()).toBe(2);
      });

      it('should throw for invalid number', () => {
        expect(() => Rating.fromNumber(0)).toThrow();
      });
    });

    describe('isValid', () => {
      it('should return true for valid ratings', () => {
        expect(Rating.isValid(1)).toBe(true);
        expect(Rating.isValid(3)).toBe(true);
        expect(Rating.isValid(5)).toBe(true);
      });

      it('should return false for invalid ratings', () => {
        expect(Rating.isValid(0)).toBe(false);
        expect(Rating.isValid(6)).toBe(false);
        expect(Rating.isValid(3.5)).toBe(false);
        expect(Rating.isValid(NaN)).toBe(false);
      });
    });
  });
}); 