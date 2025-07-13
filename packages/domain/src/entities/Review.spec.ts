import { Review, ReviewPrimitive, ReviewDocument } from './Review';
import { BookId, Rating, Comment, ReviewerName } from '../value-objects';

describe('Review Entity Interfaces', () => {
  const mockDate = new Date('2024-01-01');
  const validBookId = '507f1f77bcf86cd799439011';
  
  describe('Review interface', () => {
    it('should define Review interface with value objects', () => {
      const review: Review = {
        _id: '507f1f77bcf86cd799439012',
        bookId: new BookId(validBookId),
        rating: new Rating(5),
        comment: new Comment('Excellent book! Highly recommended.'),
        reviewerName: new ReviewerName('John Doe'),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(review._id).toBe('507f1f77bcf86cd799439012');
      expect(review.bookId).toBeInstanceOf(BookId);
      expect(review.bookId.getValue()).toBe(validBookId);
      expect(review.rating).toBeInstanceOf(Rating);
      expect(review.rating.getValue()).toBe(5);
      expect(review.comment).toBeInstanceOf(Comment);
      expect(review.comment!.getValue()).toBe('Excellent book! Highly recommended.');
      expect(review.reviewerName).toBeInstanceOf(ReviewerName);
      expect(review.reviewerName.getValue()).toBe('John Doe');
      expect(review.createdAt).toBe(mockDate);
      expect(review.updatedAt).toBe(mockDate);
    });

    it('should allow optional comment to be undefined', () => {
      const review: Review = {
        _id: '507f1f77bcf86cd799439012',
        bookId: new BookId(validBookId),
        rating: new Rating(4),
        reviewerName: new ReviewerName('Jane Smith'),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(review.comment).toBeUndefined();
      expect(review.rating.getValue()).toBe(4);
      expect(review.reviewerName.getValue()).toBe('Jane Smith');
    });
  });

  describe('ReviewPrimitive interface', () => {
    it('should define ReviewPrimitive interface with primitive types', () => {
      const reviewPrimitive: ReviewPrimitive = {
        _id: '507f1f77bcf86cd799439012',
        bookId: validBookId,
        rating: 5,
        comment: 'Excellent book! Highly recommended.',
        reviewerName: 'John Doe',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(reviewPrimitive._id).toBe('507f1f77bcf86cd799439012');
      expect(typeof reviewPrimitive.bookId).toBe('string');
      expect(typeof reviewPrimitive.rating).toBe('number');
      expect(typeof reviewPrimitive.comment).toBe('string');
      expect(typeof reviewPrimitive.reviewerName).toBe('string');
      expect(reviewPrimitive.createdAt).toBeInstanceOf(Date);
      expect(reviewPrimitive.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow optional comment in ReviewPrimitive', () => {
      const reviewPrimitive: ReviewPrimitive = {
        _id: '507f1f77bcf86cd799439012',
        bookId: validBookId,
        rating: 4,
        reviewerName: 'Jane Smith',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(reviewPrimitive.comment).toBeUndefined();
      expect(reviewPrimitive.rating).toBe(4);
      expect(reviewPrimitive.reviewerName).toBe('Jane Smith');
    });
  });

  describe('ReviewDocument interface', () => {
    it('should define ReviewDocument without required _id', () => {
      const reviewDocument: ReviewDocument = {
        bookId: validBookId,
        rating: 5,
        comment: 'Excellent book! Highly recommended.',
        reviewerName: 'John Doe',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(reviewDocument._id).toBeUndefined();
      expect(reviewDocument.bookId).toBe(validBookId);
      expect(reviewDocument.rating).toBe(5);
      expect(reviewDocument.comment).toBe('Excellent book! Highly recommended.');
      expect(reviewDocument.reviewerName).toBe('John Doe');
    });

    it('should allow optional _id in ReviewDocument', () => {
      const reviewDocument: ReviewDocument = {
        _id: '507f1f77bcf86cd799439012',
        bookId: validBookId,
        rating: 4,
        reviewerName: 'Jane Smith',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(reviewDocument._id).toBe('507f1f77bcf86cd799439012');
      expect(reviewDocument.comment).toBeUndefined();
    });
  });

  describe('Interface compatibility', () => {
    it('should convert between Review and ReviewPrimitive', () => {
      // Simulate conversion from Review to ReviewPrimitive
      const review: Review = {
        _id: '507f1f77bcf86cd799439012',
        bookId: new BookId(validBookId),
        rating: new Rating(5),
        comment: new Comment('Great read!'),
        reviewerName: new ReviewerName('Alice Johnson'),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      const reviewPrimitive: ReviewPrimitive = {
        _id: review._id,
        bookId: review.bookId.getValue(),
        rating: review.rating.getValue(),
        comment: review.comment?.getValue(),
        reviewerName: review.reviewerName.getValue(),
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      };

      expect(reviewPrimitive.bookId).toBe(validBookId);
      expect(reviewPrimitive.rating).toBe(5);
      expect(reviewPrimitive.comment).toBe('Great read!');
      expect(reviewPrimitive.reviewerName).toBe('Alice Johnson');
    });

    it('should convert Review with undefined comment', () => {
      const review: Review = {
        _id: '507f1f77bcf86cd799439012',
        bookId: new BookId(validBookId),
        rating: new Rating(3),
        reviewerName: new ReviewerName('Bob Wilson'),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      const reviewPrimitive: ReviewPrimitive = {
        _id: review._id,
        bookId: review.bookId.getValue(),
        rating: review.rating.getValue(),
        comment: review.comment?.getValue(),
        reviewerName: review.reviewerName.getValue(),
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      };

      expect(reviewPrimitive.comment).toBeUndefined();
      expect(reviewPrimitive.rating).toBe(3);
    });
  });
}); 