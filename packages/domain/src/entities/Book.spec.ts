import { Book, BookPrimitive, BookDocument } from './Book';
import { BookTitle, Author, ISBN, PublishedYear, Description, AverageRating, ReviewCount } from '../value-objects';

describe('Book Entity Interfaces', () => {
  const mockDate = new Date('2024-01-01');
  
  describe('Book interface', () => {
    it('should define Book interface with value objects', () => {
      const book: Book = {
        _id: '507f1f77bcf86cd799439011',
        title: new BookTitle('Clean Architecture'),
        author: new Author('Robert C. Martin'),
        isbn: new ISBN('9780134494166'),
        publishedYear: new PublishedYear(2017),
        description: new Description('A comprehensive guide to software architecture'),
        avgRating: new AverageRating(4.7),
        reviewCount: new ReviewCount(150),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(book._id).toBe('507f1f77bcf86cd799439011');
      expect(book.title).toBeInstanceOf(BookTitle);
      expect(book.title.getValue()).toBe('Clean Architecture');
      expect(book.author).toBeInstanceOf(Author);
      expect(book.author.getValue()).toBe('Robert C. Martin');
      expect(book.isbn).toBeInstanceOf(ISBN);
      expect(book.isbn!.getValue()).toBe('9780134494166');
      expect(book.publishedYear).toBeInstanceOf(PublishedYear);
      expect(book.publishedYear.getValue()).toBe(2017);
      expect(book.description).toBeInstanceOf(Description);
      expect(book.description!.getValue()).toBe('A comprehensive guide to software architecture');
      expect(book.avgRating).toBeInstanceOf(AverageRating);
      expect(book.avgRating.getValue()).toBe(4.7);
      expect(book.reviewCount).toBeInstanceOf(ReviewCount);
      expect(book.reviewCount.getValue()).toBe(150);
      expect(book.createdAt).toBe(mockDate);
      expect(book.updatedAt).toBe(mockDate);
    });

    it('should allow optional fields to be undefined', () => {
      const book: Book = {
        _id: '507f1f77bcf86cd799439011',
        title: new BookTitle('Clean Code'),
        author: new Author('Robert C. Martin'),
        publishedYear: new PublishedYear(2008),
        avgRating: AverageRating.zero(),
        reviewCount: ReviewCount.zero(),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(book.isbn).toBeUndefined();
      expect(book.description).toBeUndefined();
    });
  });

  describe('BookPrimitive interface', () => {
    it('should define BookPrimitive interface with primitive types', () => {
      const bookPrimitive: BookPrimitive = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        isbn: '9780134494166',
        publishedYear: 2017,
        description: 'A comprehensive guide to software architecture',
        avgRating: 4.7,
        reviewCount: 150,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(bookPrimitive._id).toBe('507f1f77bcf86cd799439011');
      expect(typeof bookPrimitive.title).toBe('string');
      expect(typeof bookPrimitive.author).toBe('string');
      expect(typeof bookPrimitive.isbn).toBe('string');
      expect(typeof bookPrimitive.publishedYear).toBe('number');
      expect(typeof bookPrimitive.description).toBe('string');
      expect(typeof bookPrimitive.avgRating).toBe('number');
      expect(typeof bookPrimitive.reviewCount).toBe('number');
      expect(bookPrimitive.createdAt).toBeInstanceOf(Date);
      expect(bookPrimitive.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow optional fields in BookPrimitive', () => {
      const bookPrimitive: BookPrimitive = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedYear: 2008,
        avgRating: 0,
        reviewCount: 0,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(bookPrimitive.isbn).toBeUndefined();
      expect(bookPrimitive.description).toBeUndefined();
    });
  });

  describe('BookDocument interface', () => {
    it('should define BookDocument without required _id', () => {
      const bookDocument: BookDocument = {
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        isbn: '9780134494166',
        publishedYear: 2017,
        description: 'A comprehensive guide to software architecture',
        avgRating: 4.7,
        reviewCount: 150,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(bookDocument._id).toBeUndefined();
      expect(bookDocument.title).toBe('Clean Architecture');
      expect(bookDocument.author).toBe('Robert C. Martin');
    });

    it('should allow optional _id in BookDocument', () => {
      const bookDocument: BookDocument = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedYear: 2008,
        avgRating: 0,
        reviewCount: 0,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      expect(bookDocument._id).toBe('507f1f77bcf86cd799439011');
    });
  });

  describe('Interface compatibility', () => {
    it('should convert between Book and BookPrimitive', () => {
      // Simulate conversion from Book to BookPrimitive
      const book: Book = {
        _id: '507f1f77bcf86cd799439011',
        title: new BookTitle('Clean Architecture'),
        author: new Author('Robert C. Martin'),
        isbn: new ISBN('9780134494166'),
        publishedYear: new PublishedYear(2017),
        description: new Description('Great book'),
        avgRating: new AverageRating(4.7),
        reviewCount: new ReviewCount(150),
        createdAt: mockDate,
        updatedAt: mockDate
      };

      const bookPrimitive: BookPrimitive = {
        _id: book._id,
        title: book.title.getValue(),
        author: book.author.getValue(),
        isbn: book.isbn?.getValue(),
        publishedYear: book.publishedYear.getValue(),
        description: book.description?.getValue(),
        avgRating: book.avgRating.getValue(),
        reviewCount: book.reviewCount.getValue(),
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
      };

      expect(bookPrimitive.title).toBe('Clean Architecture');
      expect(bookPrimitive.author).toBe('Robert C. Martin');
      expect(bookPrimitive.isbn).toBe('9780134494166');
      expect(bookPrimitive.publishedYear).toBe(2017);
      expect(bookPrimitive.description).toBe('Great book');
      expect(bookPrimitive.avgRating).toBe(4.7);
      expect(bookPrimitive.reviewCount).toBe(150);
    });
  });
}); 