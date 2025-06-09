import { BookId, Rating, Comment, ReviewerName } from '../value-objects';
import { Review, ReviewPrimitive } from '../entities/Review';
import { CreateReviewDto, UpdateReviewDto } from '../dtos';

export class ReviewMapper {
  /**
   * Convert CreateReviewDto to partial Review domain entity (without ID and timestamps)
   */
  static fromCreateDto(dto: CreateReviewDto): Omit<Review, '_id' | 'createdAt' | 'updatedAt'> {
    return {
      bookId: new BookId(dto.bookId),
      rating: new Rating(dto.rating),
      comment: dto.comment ? new Comment(dto.comment) : undefined,
      reviewerName: new ReviewerName(dto.reviewerName),
    };
  }

  /**
   * Convert partial Review domain entity to CreateReviewDto for repository operations
   */
  static toCreateDto(review: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): CreateReviewDto {
    const dto = new CreateReviewDto();
    dto.bookId = review.bookId.getValue();
    dto.rating = review.rating.getValue();
    dto.comment = review.comment?.getValue();
    dto.reviewerName = review.reviewerName.getValue();
    return dto;
  }

  /**
   * Convert UpdateReviewDto to partial Review domain entity (only provided fields)
   */
  static fromUpdateDto(dto: UpdateReviewDto): Partial<Omit<Review, '_id' | 'bookId' | 'createdAt' | 'updatedAt'>> {
    const result: Partial<Omit<Review, '_id' | 'bookId' | 'createdAt' | 'updatedAt'>> = {};

    if (dto.rating !== undefined) {
      result.rating = new Rating(dto.rating);
    }
    if (dto.comment !== undefined) {
      result.comment = new Comment(dto.comment);
    }
    if (dto.reviewerName !== undefined) {
      result.reviewerName = new ReviewerName(dto.reviewerName);
    }

    return result;
  }

  /**
   * Convert Review domain entity to ReviewPrimitive for persistence/API
   */
  static toPrimitive(review: Review): ReviewPrimitive {
    return {
      _id: review._id,
      bookId: review.bookId.getValue(),
      rating: review.rating.getValue(),
      comment: review.comment?.getValue(),
      reviewerName: review.reviewerName.getValue(),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  /**
   * Convert ReviewPrimitive to Review domain entity
   */
  static fromPrimitive(primitive: ReviewPrimitive): Review {
    return {
      _id: primitive._id,
      bookId: new BookId(primitive.bookId),
      rating: new Rating(primitive.rating),
      comment: primitive.comment ? new Comment(primitive.comment) : undefined,
      reviewerName: new ReviewerName(primitive.reviewerName),
      createdAt: primitive.createdAt,
      updatedAt: primitive.updatedAt,
    };
  }

  /**
   * Create UpdateReviewDto from partial Review for repository operations
   */
  static toUpdateDto(review: Partial<Omit<Review, '_id' | 'bookId' | 'createdAt' | 'updatedAt'>>): UpdateReviewDto {
    const result: UpdateReviewDto = {};

    if (review.rating !== undefined) {
      result.rating = review.rating.getValue();
    }
    if (review.comment !== undefined) {
      result.comment = review.comment.getValue();
    }
    if (review.reviewerName !== undefined) {
      result.reviewerName = review.reviewerName.getValue();
    }

    return result;
  }
} 