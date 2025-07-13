import { IsString, IsNumber, IsOptional, Min, Max, Length } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Rating must be between 1 and 5' })
  @Max(5, { message: 'Rating must be between 1 and 5' })
  rating?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Comment must be less than 500 characters' })
  comment?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Reviewer name must be between 1 and 100 characters' })
  reviewerName?: string;
} 