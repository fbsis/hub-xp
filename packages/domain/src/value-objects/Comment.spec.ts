import { Comment } from './Comment';

describe('Comment Value Object', () => {
  describe('constructor', () => {
    it('should create valid comment', () => {
      const comment = new Comment('This is a great book!');
      expect(comment.getValue()).toBe('This is a great book!');
    });

    it('should trim whitespace', () => {
      const comment = new Comment('  Amazing story  ');
      expect(comment.getValue()).toBe('Amazing story');
    });

    it('should accept empty comment', () => {
      const comment = new Comment('');
      expect(comment.getValue()).toBe('');
      expect(comment.isEmpty()).toBe(true);
    });

    it('should accept whitespace-only comment as empty', () => {
      const comment = new Comment('   ');
      expect(comment.getValue()).toBe('');
      expect(comment.isEmpty()).toBe(true);
    });

    it('should throw error for comment exceeding 500 characters', () => {
      const longComment = 'a'.repeat(501);
      expect(() => new Comment(longComment)).toThrow('Comment cannot exceed 500 characters');
    });

    it('should accept comment with exactly 500 characters', () => {
      const maxComment = 'a'.repeat(500);
      const comment = new Comment(maxComment);
      expect(comment.getValue()).toBe(maxComment);
    });
  });

  describe('getValue', () => {
    it('should return the comment value', () => {
      const comment = new Comment('Excellent read!');
      expect(comment.getValue()).toBe('Excellent read!');
    });
  });

  describe('toString', () => {
    it('should return string representation', () => {
      const comment = new Comment('Highly recommended');
      expect(comment.toString()).toBe('Highly recommended');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty comment', () => {
      const comment = new Comment('');
      expect(comment.isEmpty()).toBe(true);
    });

    it('should return false for non-empty comment', () => {
      const comment = new Comment('Good book');
      expect(comment.isEmpty()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for equal comments', () => {
      const comment1 = new Comment('Same opinion');
      const comment2 = new Comment('Same opinion');
      expect(comment1.equals(comment2)).toBe(true);
    });

    it('should return false for different comments', () => {
      const comment1 = new Comment('First opinion');
      const comment2 = new Comment('Second opinion');
      expect(comment1.equals(comment2)).toBe(false);
    });
  });

  describe('static methods', () => {
    describe('fromString', () => {
      it('should create comment from valid string', () => {
        const comment = Comment.fromString('Valid comment');
        expect(comment.getValue()).toBe('Valid comment');
      });
    });

    describe('empty', () => {
      it('should create empty comment', () => {
        const comment = Comment.empty();
        expect(comment.getValue()).toBe('');
        expect(comment.isEmpty()).toBe(true);
      });
    });

    describe('isValid', () => {
      it('should return true for valid comments', () => {
        expect(Comment.isValid('Valid comment')).toBe(true);
        expect(Comment.isValid('a'.repeat(500))).toBe(true);
        expect(Comment.isValid('Short')).toBe(true);
        expect(Comment.isValid('')).toBe(true); // empty is valid
        expect(Comment.isValid('   ')).toBe(true); // whitespace is valid (becomes empty)
      });

      it('should return false for invalid comments', () => {
        expect(Comment.isValid('a'.repeat(501))).toBe(false);
      });
    });
  });
}); 