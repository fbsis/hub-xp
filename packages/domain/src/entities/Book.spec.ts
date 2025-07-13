import { Book, BookPrimitive, BookDocument, BookWithStats } from './Book';
import { BookTitle, Author, ISBN, PublishedYear, Description, AverageRating, ReviewCount } from '../value-objects';

describe('Book Entity', () => {
  it('should create a book with all properties', () => {
    const book: Book = {
      _id: '507f1f77bcf86cd799439011',
      title: new BookTitle('Clean Architecture'),
      author: new Author('Robert C. Martin'),
      isbn: new ISBN('978-3-16-148410-0'),
      publishedYear: new PublishedYear(2017),
      description: new Description('A comprehensive guide to software architecture.'),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(book._id).toBe('507f1f77bcf86cd799439011');
    expect(book.title).toBeInstanceOf(BookTitle);
    expect(book.title.getValue()).toBe('Clean Architecture');
    expect(book.author).toBeInstanceOf(Author);
    expect(book.author.getValue()).toBe('Robert C. Martin');
    expect(book.isbn).toBeInstanceOf(ISBN);
    expect(book.isbn!.getValue()).toBe('9783161484100');
    expect(book.publishedYear).toBeInstanceOf(PublishedYear);
    expect(book.publishedYear.getValue()).toBe(2017);
    expect(book.description).toBeInstanceOf(Description);
    expect(book.description!.getValue()).toBe('A comprehensive guide to software architecture.');
  });

  it('should create a book without optional properties', () => {
    const book: Book = {
      _id: '507f1f77bcf86cd799439011',
      title: new BookTitle('Clean Code'),
      author: new Author('Robert C. Martin'),
      publishedYear: new PublishedYear(2008),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(book.isbn).toBeUndefined();
    expect(book.description).toBeUndefined();
  });

  it('should create a BookPrimitive with all properties', () => {
    const bookPrimitive: BookPrimitive = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      isbn: '978-3-16-148410-0',
      publishedYear: 2017,
      description: 'A comprehensive guide to software architecture.',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(bookPrimitive._id).toBe('507f1f77bcf86cd799439011');
    expect(typeof bookPrimitive.title).toBe('string');
    expect(typeof bookPrimitive.author).toBe('string');
    expect(typeof bookPrimitive.isbn).toBe('string');
    expect(typeof bookPrimitive.publishedYear).toBe('number');
    expect(typeof bookPrimitive.description).toBe('string');
    expect(bookPrimitive.createdAt).toBeInstanceOf(Date);
    expect(bookPrimitive.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a BookPrimitive without optional properties', () => {
    const bookPrimitive: BookPrimitive = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(bookPrimitive.isbn).toBeUndefined();
    expect(bookPrimitive.description).toBeUndefined();
  });

  it('should create a BookDocument with all properties', () => {
    const bookDocument: BookDocument = {
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      isbn: '978-3-16-148410-0',
      publishedYear: 2017,
      description: 'A comprehensive guide to software architecture.',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(bookDocument._id).toBeUndefined();
    expect(typeof bookDocument.title).toBe('string');
    expect(typeof bookDocument.author).toBe('string');
  });

  it('should create a BookDocument without optional properties', () => {
    const bookDocument: BookDocument = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(bookDocument.isbn).toBeUndefined();
    expect(bookDocument.description).toBeUndefined();
  });

  it('should create a BookWithStats with calculated statistics', () => {
    const bookWithStats: BookWithStats = {
      _id: '507f1f77bcf86cd799439011',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      isbn: '978-3-16-148410-0',
      publishedYear: 2017,
      description: 'A comprehensive guide to software architecture.',
      avgRating: 4.7,
      reviewCount: 150,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    expect(bookWithStats.avgRating).toBe(4.7);
    expect(bookWithStats.reviewCount).toBe(150);
  });

  it('should convert from Book to BookPrimitive', () => {
    const book: Book = {
      _id: '507f1f77bcf86cd799439011',
      title: new BookTitle('Clean Architecture'),
      author: new Author('Robert C. Martin'),
      isbn: new ISBN('978-3-16-148410-0'),
      publishedYear: new PublishedYear(2017),
      description: new Description('A comprehensive guide to software architecture.'),
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02')
    };

    const bookPrimitive: BookPrimitive = {
      _id: book._id,
      title: book.title.getValue(),
      author: book.author.getValue(),
      isbn: book.isbn!.getValue(),
      publishedYear: book.publishedYear.getValue(),
      description: book.description!.getValue(),
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    };

    expect(bookPrimitive._id).toBe('507f1f77bcf86cd799439011');
    expect(bookPrimitive.title).toBe('Clean Architecture');
    expect(bookPrimitive.author).toBe('Robert C. Martin');
  });
}); 