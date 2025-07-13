import { AverageRating } from './AverageRating';

describe('AverageRating Value Object', () => {
  describe('constructor', () => {
    it('should create valid average rating', () => {
      const rating = new AverageRating(4.7);
      expect(rating.getValue()).toBe(4.7);
    });

    it('should round to 1 decimal place', () => {
      const rating = new AverageRating(4.76543);
      expect(rating.getValue()).toBe(4.8);
    });

    it('should accept rating of 0', () => {
      const rating = new AverageRating(0);
      expect(rating.getValue()).toBe(0);
    });

    it('should accept rating of 5', () => {
      const rating = new AverageRating(5);
      expect(rating.getValue()).toBe(5);
    });

    it('should throw error for negative rating', () => {
      expect(() => new AverageRating(-0.1)).toThrow('Average rating must be between 0 and 5');
      expect(() => new AverageRating(-5)).toThrow('Average rating must be between 0 and 5');
    });

    it('should throw error for rating above 5', () => {
      expect(() => new AverageRating(5.1)).toThrow('Average rating must be between 0 and 5');
      expect(() => new AverageRating(10)).toThrow('Average rating must be between 0 and 5');
    });

    it('should throw error for NaN', () => {
      expect(() => new AverageRating(NaN)).toThrow('Average rating cannot be NaN');
    });
  });

  describe('toString', () => {
    it('should return formatted string with 1 decimal place', () => {
      const rating = new AverageRating(4.7);
      expect(rating.toString()).toBe('4.7');
    });

    it('should show .0 for whole numbers', () => {
      const rating = new AverageRating(4);
      expect(rating.toString()).toBe('4.0');
    });
  });

  describe('equals', () => {
    it('should return true for equal ratings', () => {
      const rating1 = new AverageRating(4.7);
      const rating2 = new AverageRating(4.7);
      expect(rating1.equals(rating2)).toBe(true);
    });

    it('should return false for different ratings', () => {
      const rating1 = new AverageRating(4.7);
      const rating2 = new AverageRating(4.8);
      expect(rating1.equals(rating2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromNumber', () => {
      it('should create rating from valid number', () => {
        const rating = AverageRating.fromNumber(3.5);
        expect(rating.getValue()).toBe(3.5);
      });
    });

    describe('zero', () => {
      it('should create zero rating', () => {
        const rating = AverageRating.zero();
        expect(rating.getValue()).toBe(0);
      });
    });

    describe('isValid', () => {
      it('should return true for valid ratings', () => {
        expect(AverageRating.isValid(0)).toBe(true);
        expect(AverageRating.isValid(2.5)).toBe(true);
        expect(AverageRating.isValid(5)).toBe(true);
      });

      it('should return false for invalid ratings', () => {
        expect(AverageRating.isValid(-0.1)).toBe(false);
        expect(AverageRating.isValid(5.1)).toBe(false);
        expect(AverageRating.isValid(NaN)).toBe(false);
      });
    });
  });
}); 