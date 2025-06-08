import { CreateReviewDto } from './CreateReviewDto';
import { BookId, Rating, Comment, ReviewerName } from '../value-objects';

describe('CreateReviewDto', () => {
  const validReviewData = {
    bookId: '507f1f77bcf86cd799439011',
    rating: 5,
    comment: 'Excellent book! Highly recommended for all developers.',
    reviewerName: 'John Doe'
  };

  describe('constructor and properties', () => {
    it('should create DTO with valid data', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      
      expect(dto.bookId).toBe(validReviewData.bookId);
      expect(dto.rating).toBe(validReviewData.rating);
      expect(dto.comment).toBe(validReviewData.comment);
      expect(dto.reviewerName).toBe(validReviewData.reviewerName);
    });

    it('should handle optional comment', () => {
      const dataWithoutComment = {
        bookId: validReviewData.bookId,
        rating: validReviewData.rating,
        reviewerName: validReviewData.reviewerName
      };
      
      const dto = Object.assign(new CreateReviewDto(), dataWithoutComment);
      expect(dto.comment).toBeUndefined();
    });
  });

  describe('value object creation methods', () => {
    it('should create BookId value object', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      const bookId = dto.createBookId();
      
      expect(bookId).toBeInstanceOf(BookId);
      expect(bookId.getValue()).toBe(validReviewData.bookId);
    });

    it('should create Rating value object', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      const rating = dto.createRating();
      
      expect(rating).toBeInstanceOf(Rating);
      expect(rating.getValue()).toBe(validReviewData.rating);
    });

    it('should create Comment value object when comment exists', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      const comment = dto.createComment();
      
      expect(comment).toBeInstanceOf(Comment);
      expect(comment!.getValue()).toBe(validReviewData.comment);
    });

    it('should return undefined for Comment when comment is not provided', () => {
      const dataWithoutComment = {
        bookId: validReviewData.bookId,
        rating: validReviewData.rating,
        reviewerName: validReviewData.reviewerName
      };
      
      const dto = Object.assign(new CreateReviewDto(), dataWithoutComment);
      const comment = dto.createComment();
      
      expect(comment).toBeUndefined();
    });

    it('should create ReviewerName value object', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      const reviewerName = dto.createReviewerName();
      
      expect(reviewerName).toBeInstanceOf(ReviewerName);
      expect(reviewerName.getValue()).toBe(validReviewData.reviewerName);
    });
  });

  describe('value object creation with edge cases', () => {
    it('should create Rating with minimum value', () => {
      const dataWithMinRating = { ...validReviewData, rating: 1 };
      const dto = Object.assign(new CreateReviewDto(), dataWithMinRating);
      const rating = dto.createRating();
      
      expect(rating.getValue()).toBe(1);
    });

    it('should create Rating with maximum value', () => {
      const dataWithMaxRating = { ...validReviewData, rating: 5 };
      const dto = Object.assign(new CreateReviewDto(), dataWithMaxRating);
      const rating = dto.createRating();
      
      expect(rating.getValue()).toBe(5);
    });

    it('should create Comment with non-empty string', () => {
      const dataWithComment = { ...validReviewData, comment: 'Good book!' };
      const dto = Object.assign(new CreateReviewDto(), dataWithComment);
      const comment = dto.createComment();
      
      expect(comment).toBeInstanceOf(Comment);
      expect(comment!.getValue()).toBe('Good book!');
    });

    it('should return undefined for empty comment string', () => {
      const dataWithEmptyComment = { ...validReviewData, comment: '' };
      const dto = Object.assign(new CreateReviewDto(), dataWithEmptyComment);
      const comment = dto.createComment();
      
      // Empty string is falsy, so createComment returns undefined
      expect(comment).toBeUndefined();
    });
  });

  describe('integration with value objects', () => {
    it('should create all value objects successfully', () => {
      const dto = Object.assign(new CreateReviewDto(), validReviewData);
      
      expect(() => dto.createBookId()).not.toThrow();
      expect(() => dto.createRating()).not.toThrow();
      expect(() => dto.createComment()).not.toThrow();
      expect(() => dto.createReviewerName()).not.toThrow();
    });

    it('should throw when creating invalid BookId', () => {
      const invalidData = { ...validReviewData, bookId: 'invalid-id' };
      const dto = Object.assign(new CreateReviewDto(), invalidData);
      
      expect(() => dto.createBookId()).toThrow('Invalid ObjectId format');
    });

    it('should throw when creating invalid Rating', () => {
      const invalidData = { ...validReviewData, rating: 0 };
      const dto = Object.assign(new CreateReviewDto(), invalidData);
      
      expect(() => dto.createRating()).toThrow('Rating must be an integer between 1 and 5');
    });

    it('should throw when creating invalid ReviewerName', () => {
      const invalidData = { ...validReviewData, reviewerName: '' };
      const dto = Object.assign(new CreateReviewDto(), invalidData);
      
      expect(() => dto.createReviewerName()).toThrow('Reviewer name cannot be empty');
    });
  });
}); 