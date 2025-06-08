import { PublishedYear } from './PublishedYear';

describe('PublishedYear Value Object', () => {
  const currentYear = new Date().getFullYear();

  describe('constructor', () => {
    it('should create valid published year', () => {
      const year = new PublishedYear(2000);
      expect(year.getValue()).toBe(2000);
    });

    it('should accept minimum valid year', () => {
      const year = new PublishedYear(1000);
      expect(year.getValue()).toBe(1000);
    });

    it('should accept current year', () => {
      const year = new PublishedYear(currentYear);
      expect(year.getValue()).toBe(currentYear);
    });

    it('should throw error for year before 1000', () => {
      expect(() => new PublishedYear(999)).toThrow('Published year must be after 1000');
      expect(() => new PublishedYear(500)).toThrow('Published year must be after 1000');
    });

    it('should throw error for future year', () => {
      const futureYear = currentYear + 2;
      expect(() => new PublishedYear(futureYear)).toThrow('Published year cannot be in the future');
    });

    it('should throw error for non-integer year', () => {
      expect(() => new PublishedYear(2000.5)).toThrow('Published year must be an integer');
      expect(() => new PublishedYear(NaN)).toThrow('Published year must be an integer');
    });
  });

  describe('getValue', () => {
    it('should return the year value', () => {
      const year = new PublishedYear(1995);
      expect(year.getValue()).toBe(1995);
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const year = new PublishedYear(2010);
      expect(year.toString()).toBe('2010');
    });
  });

  describe('equals', () => {
    it('should return true for equal years', () => {
      const year1 = new PublishedYear(2005);
      const year2 = new PublishedYear(2005);
      expect(year1.equals(year2)).toBe(true);
    });

    it('should return false for different years', () => {
      const year1 = new PublishedYear(2005);
      const year2 = new PublishedYear(2006);
      expect(year1.equals(year2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromNumber', () => {
      it('should create year from valid number', () => {
        const year = PublishedYear.fromNumber(1985);
        expect(year.getValue()).toBe(1985);
      });

      it('should throw for invalid number', () => {
        expect(() => PublishedYear.fromNumber(999)).toThrow();
      });
    });

    describe('isValid', () => {
      it('should return true for valid years', () => {
        expect(PublishedYear.isValid(1000)).toBe(true);
        expect(PublishedYear.isValid(2000)).toBe(true);
        expect(PublishedYear.isValid(currentYear)).toBe(true);
      });

      it('should return false for invalid years', () => {
        expect(PublishedYear.isValid(999)).toBe(false);
        expect(PublishedYear.isValid(currentYear + 2)).toBe(false);
        expect(PublishedYear.isValid(2000.5)).toBe(false);
        expect(PublishedYear.isValid(NaN)).toBe(false);
      });
    });
  });
}); 