import { IsString, IsNumber, IsOptional, Min, Max, Length, Matches } from 'class-validator';
import { BookTitle, Author, ISBN, PublishedYear, Description } from '../value-objects';

export class CreateBookDto {
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