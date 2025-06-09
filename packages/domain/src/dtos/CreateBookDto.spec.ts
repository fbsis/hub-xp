import { CreateBookDto } from './CreateBookDto';
import { BookTitle } from '../value-objects/BookTitle';
import { Author } from '../value-objects/Author';
import { ISBN } from '../value-objects/ISBN';
import { PublishedYear } from '../value-objects/PublishedYear';
import { Description } from '../value-objects/Description';

describe('CreateBookDto', () => {
  const validBookData = {
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    isbn: '9780134494166',
    publishedYear: 2017,
    description: 'A comprehensive guide to software architecture'
  };

  describe('constructor', () => {
    it('should create DTO with valid data', () => {
      const dto = Object.assign(new CreateBookDto(), validBookData);
      
      expect(dto.title).toBe(validBookData.title);
      expect(dto.author).toBe(validBookData.author);
      expect(dto.isbn).toBe(validBookData.isbn);
      expect(dto.publishedYear).toBe(validBookData.publishedYear);
      expect(dto.description).toBe(validBookData.description);
    });

    it('should handle optional description', () => {
      const dataWithoutDescription = {
        title: validBookData.title,
        author: validBookData.author,
        isbn: validBookData.isbn,
        publishedYear: validBookData.publishedYear
      };
      
      const dto = Object.assign(new CreateBookDto(), dataWithoutDescription);
      expect(dto.description).toBeUndefined();
    });
  });

  describe('value object creation methods', () => {
    it('should create all value objects correctly', () => {
      const dto = Object.assign(new CreateBookDto(), validBookData);

      const title = dto.createTitle();
      expect(title).toBeInstanceOf(BookTitle);
      expect(title.getValue()).toBe(validBookData.title);

      const author = dto.createAuthor();
      expect(author).toBeInstanceOf(Author);
      expect(author.getValue()).toBe(validBookData.author);

      const isbn = dto.createISBN();
      expect(isbn).toBeInstanceOf(ISBN);
      expect(isbn!.getValue()).toBe(validBookData.isbn);

      const publishedYear = dto.createPublishedYear();
      expect(publishedYear).toBeInstanceOf(PublishedYear);
      expect(publishedYear.getValue()).toBe(validBookData.publishedYear);

      const description = dto.createDescription();
      expect(description).toBeInstanceOf(Description);
      expect(description!.getValue()).toBe(validBookData.description);
    });

    it('should handle undefined ISBN', () => {
      const dataWithoutISBN = {
        title: validBookData.title,
        author: validBookData.author,
        publishedYear: validBookData.publishedYear
      };
      
      const dto = Object.assign(new CreateBookDto(), dataWithoutISBN);
      const isbn = dto.createISBN();
      expect(isbn).toBeUndefined();
    });

    it('should handle undefined description', () => {
      const dataWithoutDescription = {
        title: validBookData.title,
        author: validBookData.author,
        isbn: validBookData.isbn,
        publishedYear: validBookData.publishedYear
      };
      
      const dto = Object.assign(new CreateBookDto(), dataWithoutDescription);
      const description = dto.createDescription();
      expect(description).toBeUndefined();
    });
  });

  describe('integration with value objects', () => {
    it('should create valid value objects that can be validated', () => {
      const dto = Object.assign(new CreateBookDto(), validBookData);
      
      expect(() => dto.createTitle()).not.toThrow();
      expect(() => dto.createAuthor()).not.toThrow();
      expect(() => dto.createISBN()).not.toThrow();
      expect(() => dto.createPublishedYear()).not.toThrow();
      expect(() => dto.createDescription()).not.toThrow();
    });

    it('should throw when creating invalid value objects', () => {
      const invalidData = {
        title: '', // invalid title
        author: 'Valid Author',
        isbn: '9780134494166',
        publishedYear: 2017
      };
      
      const dto = Object.assign(new CreateBookDto(), invalidData);
      expect(() => dto.createTitle()).toThrow('Book title cannot be empty');
    });
  });
}); 