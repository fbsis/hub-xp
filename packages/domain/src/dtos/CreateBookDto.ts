import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookTitle, Author, ISBN, PublishedYear, Description } from '../value-objects';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'Clean Architecture',
    minLength: 1,
    maxLength: 200
  })
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'Robert C. Martin',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'Author must be between 1 and 100 characters' })
  author: string;

  @ApiProperty({
    description: 'The ISBN of the book (optional)',
    example: '9780134494166',
    required: false,
    pattern: '^\\d{9}[\\dX]$|^\\d{13}$'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{9}[\dX]$|^\d{13}$/, {
    message: 'Invalid ISBN format. Must be 10 or 13 digits.'
  })
  isbn?: string;

  @ApiProperty({
    description: 'The year the book was published',
    example: 2017,
    minimum: 1000,
    maximum: new Date().getFullYear() + 1
  })
  @IsNumber()
  @Min(1000, { message: 'Published year must be after 1000' })
  @Max(new Date().getFullYear() + 1, { message: 'Published year cannot be in the future' })
  publishedYear: number;

  @ApiProperty({
    description: 'A brief description of the book (optional)',
    example: 'A comprehensive guide to building maintainable software architectures.',
    required: false,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000, { message: 'Description must be less than 1000 characters' })
  description?: string;

  // Factory methods para criar value objects
  createTitle(): BookTitle {
    return new BookTitle(this.title);
  }

  createAuthor(): Author {
    return new Author(this.author);
  }

  createISBN(): ISBN | undefined {
    return this.isbn ? new ISBN(this.isbn) : undefined;
  }

  createPublishedYear(): PublishedYear {
    return new PublishedYear(this.publishedYear);
  }

  createDescription(): Description | undefined {
    return this.description ? new Description(this.description) : undefined;
  }
} 