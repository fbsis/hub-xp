import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Author must be between 1 and 100 characters' })
  author?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:\d{10}|\d{13}|(?:\d{1,5}-){1,6}\d{1,7}|(?:\d{1,5}\s){1,6}\d{1,7})$/, {
    message: 'Invalid ISBN format'
  })
  isbn?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000, { message: 'Published year must be after 1000' })
  @Max(new Date().getFullYear() + 1, { message: 'Published year cannot be in the future' })
  publishedYear?: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Description must be less than 1000 characters' })
  description?: string;
} 