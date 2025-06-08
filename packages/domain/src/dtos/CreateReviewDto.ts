import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { BookId, Rating, Comment, ReviewerName } from '../value-objects';

export class CreateReviewDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Book ID must be a valid ObjectId' })
  bookId: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Comment must be less than 500 characters' })
  comment?: string;

  @IsString()
  @Length(1, 100, { message: 'Reviewer name must be between 1 and 100 characters' })
  reviewerName: string;

  // Factory methods para criar value objects
  createBookId(): BookId {
    return new BookId(this.bookId);
  }

  createRating(): Rating {
    return new Rating(this.rating);
  }

  createComment(): Comment | undefined {
    return this.comment ? new Comment(this.comment) : undefined;
  }

  createReviewerName(): ReviewerName {
    return new ReviewerName(this.reviewerName);
  }
} 