import { ReviewPrimitive, CreateReviewDto, UpdateReviewDto } from '@domain/core';

export class ReviewFactory {
  static createReviewDto(overrides: Partial<CreateReviewDto> = {}): CreateReviewDto {
    return {
      bookId: '507f1f77bcf86cd799439011',
      rating: 5,
      comment: 'Excellent book!',
      reviewerName: 'John Doe',
      ...overrides,
    } as CreateReviewDto;
  }

  static updateReviewDto(overrides: Partial<UpdateReviewDto> = {}): UpdateReviewDto {
    return {
      rating: 4,
      comment: 'Updated comment',
      ...overrides,
    } as UpdateReviewDto;
  }

  static reviewPrimitive(overrides: Partial<ReviewPrimitive> = {}): ReviewPrimitive {
    return {
      _id: '507f1f77bcf86cd799439012',
      bookId: '507f1f77bcf86cd799439011',
      rating: 5,
      comment: 'Excellent book!',
      reviewerName: 'John Doe',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      ...overrides,
    };
  }

  static reviewList(count: number = 1, overrides: Partial<ReviewPrimitive> = {}): ReviewPrimitive[] {
    return Array.from({ length: count }, (_, i) =>
      ReviewFactory.reviewPrimitive({
        _id: `review${i + 1}`,
        reviewerName: `User ${i + 1}`,
        ...overrides,
      })
    );
  }

  static paginatedResponse(
    reviews: ReviewPrimitive[] = [ReviewFactory.reviewPrimitive()],
    pagination = { page: 1, limit: 10, total: 1 }
  ) {
    return {
      reviews,
      ...pagination,
    };
  }
} 