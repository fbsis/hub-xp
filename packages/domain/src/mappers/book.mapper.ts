import { BookTitle, Author, ISBN, PublishedYear, Description } from '../value-objects';
import { Book, BookPrimitive } from '../entities/Book';
import { CreateBookDto, UpdateBookDto } from '../dtos';

export class BookMapper {
  /**
   * Convert CreateBookDto to partial Book domain entity (without ID and timestamps)
   */
  static fromCreateDto(dto: CreateBookDto): Omit<Book, '_id' | 'createdAt' | 'updatedAt'> {
    return {
      title: new BookTitle(dto.title),
      author: new Author(dto.author),
      isbn: dto.isbn ? new ISBN(dto.isbn) : undefined,
      publishedYear: new PublishedYear(dto.publishedYear),
      description: dto.description ? new Description(dto.description) : undefined,
    };
  }

  /**
   * Convert partial Book domain entity to CreateBookDto for repository operations
   */
  static toCreateDto(book: Omit<Book, '_id' | 'createdAt' | 'updatedAt'>): CreateBookDto {
    const dto = new CreateBookDto();
    dto.title = book.title.getValue();
    dto.author = book.author.getValue();
    dto.isbn = book.isbn?.getValue();
    dto.publishedYear = book.publishedYear.getValue();
    dto.description = book.description?.getValue();
    return dto;
  }

  /**
   * Convert UpdateBookDto to partial Book domain entity (only provided fields)
   */
  static fromUpdateDto(dto: UpdateBookDto): Partial<Omit<Book, '_id' | 'createdAt' | 'updatedAt'>> {
    const result: Partial<Omit<Book, '_id' | 'createdAt' | 'updatedAt'>> = {};

    if (dto.title !== undefined) {
      result.title = new BookTitle(dto.title);
    }
    if (dto.author !== undefined) {
      result.author = new Author(dto.author);
    }
    if (dto.isbn !== undefined) {
      result.isbn = new ISBN(dto.isbn);
    }
    if (dto.publishedYear !== undefined) {
      result.publishedYear = new PublishedYear(dto.publishedYear);
    }
    if (dto.description !== undefined) {
      result.description = new Description(dto.description);
    }

    return result;
  }

  /**
   * Convert Book domain entity to BookPrimitive for persistence/API
   */
  static toPrimitive(book: Book): BookPrimitive {
    return {
      _id: book._id,
      title: book.title.getValue(),
      author: book.author.getValue(),
      isbn: book.isbn?.getValue(),
      publishedYear: book.publishedYear.getValue(),
      description: book.description?.getValue(),
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }

  /**
   * Convert BookPrimitive to Book domain entity
   */
  static fromPrimitive(primitive: BookPrimitive): Book {
    return {
      _id: primitive._id,
      title: new BookTitle(primitive.title),
      author: new Author(primitive.author),
      isbn: primitive.isbn ? new ISBN(primitive.isbn) : undefined,
      publishedYear: new PublishedYear(primitive.publishedYear),
      description: primitive.description ? new Description(primitive.description) : undefined,
      createdAt: primitive.createdAt,
      updatedAt: primitive.updatedAt,
    };
  }

  /**
   * Create UpdateBookDto from partial Book for repository operations
   */
  static toUpdateDto(book: Partial<Omit<Book, '_id' | 'createdAt' | 'updatedAt'>>): UpdateBookDto {
    const result: UpdateBookDto = {};

    if (book.title !== undefined) {
      result.title = book.title.getValue();
    }
    if (book.author !== undefined) {
      result.author = book.author.getValue();
    }
    if (book.isbn !== undefined) {
      result.isbn = book.isbn.getValue();
    }
    if (book.publishedYear !== undefined) {
      result.publishedYear = book.publishedYear.getValue();
    }
    if (book.description !== undefined) {
      result.description = book.description.getValue();
    }

    return result;
  }
} 