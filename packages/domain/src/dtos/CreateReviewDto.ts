import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookId, Rating, Comment, ReviewerName } from '../value-objects';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The ID of the book being reviewed',
    example: '6846130ff221d26b39d254d1',
    pattern: '^[0-9a-fA-F]{24}$'
  })
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Book ID must be a valid ObjectId' })
  bookId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating: number;

  @ApiProperty({
    description: 'Optional comment about the book (max 500 characters)',
    example: 'Excellent book! Highly recommended for software architects.',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Comment must be less than 500 characters' })
  comment?: string;

  @ApiProperty({
    description: 'Name of the person reviewing the book',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100
  })
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