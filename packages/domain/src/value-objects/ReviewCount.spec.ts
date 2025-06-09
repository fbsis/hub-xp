import { ReviewCount } from './ReviewCount';

describe('ReviewCount Value Object', () => {
  describe('constructor', () => {
    it('should create valid review count', () => {
      const count = new ReviewCount(5);
      expect(count.getValue()).toBe(5);
    });

    it('should accept zero reviews', () => {
      const count = new ReviewCount(0);
      expect(count.getValue()).toBe(0);
    });

    it('should throw error for negative count', () => {
      expect(() => new ReviewCount(-1)).toThrow('Review count must be a non-negative integer');
      expect(() => new ReviewCount(-10)).toThrow('Review count must be a non-negative integer');
    });

    it('should throw error for non-integer count', () => {
      expect(() => new ReviewCount(3.5)).toThrow('Review count must be a non-negative integer');
      expect(() => new ReviewCount(NaN)).toThrow('Review count must be a non-negative integer');
    });
  });

  describe('getValue', () => {
    it('should return the count value', () => {
      const count = new ReviewCount(25);
      expect(count.getValue()).toBe(25);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const count = new ReviewCount(42);
      expect(count.toString()).toBe('42');
    });
  });

  describe('equals', () => {
    it('should return true for equal counts', () => {
      const count1 = new ReviewCount(15);
      const count2 = new ReviewCount(15);
      expect(count1.equals(count2)).toBe(true);
    });

    it('should return false for different counts', () => {
      const count1 = new ReviewCount(10);
      const count2 = new ReviewCount(20);
      expect(count1.equals(count2)).toBe(false);
    });
  });

  describe('increment', () => {
    it('should increment count by 1', () => {
      const count = new ReviewCount(5);
      const incremented = count.increment();
      expect(incremented.getValue()).toBe(6);
      expect(count.getValue()).toBe(5); // original should be unchanged
    });
  });

  describe('decrement', () => {
    it('should decrement count by 1', () => {
      const count = new ReviewCount(5);
      const decremented = count.decrement();
      expect(decremented.getValue()).toBe(4);
      expect(count.getValue()).toBe(5); // original should be unchanged
    });

    it('should not decrement below zero', () => {
      const count = new ReviewCount(0);
      const decremented = count.decrement();
      expect(decremented.getValue()).toBe(0); // should stay at 0
    });

    it('should decrement 1 to 0', () => {
      const count = new ReviewCount(1);
      const decremented = count.decrement();
      expect(decremented.getValue()).toBe(0);
    });
  });

  describe('static methods', () => {
    describe('fromNumber', () => {
      it('should create count from valid number', () => {
        const count = ReviewCount.fromNumber(8);
        expect(count.getValue()).toBe(8);
      });

      it('should throw for invalid number', () => {
        expect(() => ReviewCount.fromNumber(-1)).toThrow();
      });
    });

    describe('zero', () => {
      it('should create zero count', () => {
        const count = ReviewCount.zero();
        expect(count.getValue()).toBe(0);
      });
    });

    describe('isValid', () => {
      it('should return true for valid counts', () => {
        expect(ReviewCount.isValid(0)).toBe(true);
        expect(ReviewCount.isValid(10)).toBe(true);
        expect(ReviewCount.isValid(100)).toBe(true);
      });

      it('should return false for invalid counts', () => {
        expect(ReviewCount.isValid(-1)).toBe(false);
        expect(ReviewCount.isValid(3.5)).toBe(false);
        expect(ReviewCount.isValid(NaN)).toBe(false);
      });
    });
  });
}); 