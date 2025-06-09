import { BookPrimitive, BookWithStats, CreateBookDto, UpdateBookDto } from '@domain/core';

export class BookFactory {
  static createBookDto(overrides: Partial<CreateBookDto> = {}): CreateBookDto {
    return {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publishedYear: 2008,
      description: 'A handbook of agile software craftsmanship.',
      ...overrides,
    } as CreateBookDto;
  }

  static updateBookDto(overrides: Partial<UpdateBookDto> = {}): UpdateBookDto {
    return {
      title: 'Updated Title',
      description: 'Updated description',
      ...overrides,
    } as UpdateBookDto;
  }

  static bookPrimitive(overrides: Partial<BookPrimitive> = {}): BookPrimitive {
    return {
      _id: '507f1f77bcf86cd799439011',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      publishedYear: 2008,
      description: 'A handbook of agile software craftsmanship.',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      ...overrides,
    };
  }

  static bookWithStats(overrides: Partial<BookWithStats> = {}): BookWithStats {
    return {
      ...BookFactory.bookPrimitive(),
      avgRating: 4.8,
      reviewCount: 100,
      ...overrides,
    };
  }

  static bookList(count: number = 1, overrides: Partial<BookPrimitive> = {}): BookPrimitive[] {
    return Array.from({ length: count }, (_, i) =>
      BookFactory.bookPrimitive({
        _id: `book${i + 1}`,
        title: `Book ${i + 1}`,
        ...overrides,
      })
    );
  }

  static paginatedResponse(
    books: BookPrimitive[] = [BookFactory.bookPrimitive()],
    pagination = { page: 1, limit: 10, total: 1 }
  ) {
    return {
      books,
      ...pagination,
    };
  }
} 