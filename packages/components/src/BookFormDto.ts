import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';

// Mirrors CreateBookDto validations exactly but without backend dependencies
export class BookFormDto {
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title: string;

  @IsString()
  @Length(1, 100, { message: 'Author must be between 1 and 100 characters' })
  author: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{9}[\dX]$|^\d{13}$/, {
    message: 'Invalid ISBN format. Must be 10 or 13 digits.'
  })
  isbn?: string;

  @IsNumber()
  @Min(1000, { message: 'Published year must be after 1000' })
  @Max(new Date().getFullYear() + 1, { message: 'Published year cannot be in the future' })
  publishedYear: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Description must be less than 1000 characters' })
  description?: string;

  constructor() {
    this.title = '';
    this.author = '';
    this.isbn = '';
    this.publishedYear = new Date().getFullYear();
    this.description = '';
  }
} 