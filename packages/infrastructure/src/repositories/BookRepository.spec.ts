import { BookRepository } from './BookRepository';
import { BookFactory, BookScenarios } from '@test-utils/core';
import { GetBooksDto } from '@domain/core';

describe('BookRepository', () => {
  let repository: BookRepository;
  let mockModel: any;

  beforeEach(() => {
    // Create a proper model constructor mock
    const MockDoc = jest.fn().mockImplementation((data: any) => {
      const instance = {
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };
      return instance;
    });

    mockModel = MockDoc;
    mockModel.find = jest.fn();
    mockModel.findById = jest.fn();
    mockModel.findByIdAndUpdate = jest.fn();
    mockModel.findByIdAndDelete = jest.fn();
    mockModel.countDocuments = jest.fn();
    mockModel.deleteMany = jest.fn();
    mockModel.insertMany = jest.fn();
    mockModel.aggregate = jest.fn();

    repository = new BookRepository(mockModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createDto = BookFactory.createBookDto();

      const result = await repository.create(createDto);

      expect(mockModel).toHaveBeenCalledWith({
        title: createDto.title,
        author: createDto.author,
        isbn: createDto.isbn,
        publishedYear: createDto.publishedYear,
        description: createDto.description
      });
      expect(result).toEqual(expect.objectContaining({
        _id: expect.any(String),
        title: createDto.title,
        author: createDto.author,
        isbn: createDto.isbn,
        publishedYear: createDto.publishedYear,
        description: createDto.description
      }));
    });
  });

  describe('findById', () => {
    it('should return a book when found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const expected = BookFactory.bookPrimitive({ _id: bookId });
      mockModel.findById.mockResolvedValue(expected);

      const result = await repository.findById(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockModel.findById.mockResolvedValue(null);

      const result = await repository.findById(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const filters: GetBooksDto = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
      const books = BookFactory.bookList(2);
      const chainMethods = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(books),
      };
      mockModel.find.mockReturnValue(chainMethods);
      mockModel.countDocuments.mockResolvedValue(2);

      const result = await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({});
      expect(chainMethods.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(chainMethods.skip).toHaveBeenCalledWith(0);
      expect(chainMethods.limit).toHaveBeenCalledWith(10);
      expect(result.books).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should use aggregation for rating-based queries', async () => {
      const filters: GetBooksDto = { page: 1, limit: 10, minRating: 4 };
      const books = [BookFactory.bookWithStats()];
      mockModel.aggregate.mockResolvedValue([{ total: 1 }]);
      mockModel.aggregate.mockResolvedValueOnce([{ total: 1 }]);
      mockModel.aggregate.mockResolvedValueOnce(books);

      const result = await repository.findAll(filters);

      expect(mockModel.aggregate).toHaveBeenCalledTimes(2);
      expect(result.books).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const expected = BookFactory.bookPrimitive({ _id: bookId, ...updateDto });
      mockModel.findByIdAndUpdate.mockResolvedValue(expected);

      const result = await repository.update(bookId, updateDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        bookId,
        { title: updateDto.title, description: updateDto.description },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      mockModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await repository.update(bookId, updateDto);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const mockBook = BookFactory.bookPrimitive({ _id: bookId });
      mockModel.findByIdAndDelete.mockResolvedValue(mockBook);

      const result = await repository.delete(bookId);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(true);
    });

    it('should return false when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await repository.delete(bookId);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true when book exists', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const mockBook = BookFactory.bookPrimitive({ _id: bookId });
      mockModel.findById.mockResolvedValue(mockBook);

      const result = await repository.exists(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBe(true);
    });

    it('should return false when book does not exist', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockModel.findById.mockResolvedValue(null);

      const result = await repository.exists(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBe(false);
    });
  });

  describe('getTopRated', () => {
    it('should return top rated books with default limit', async () => {
      const books = [BookFactory.bookWithStats()];
      mockModel.aggregate.mockResolvedValue(books);

      const result = await repository.getTopRated();

      expect(mockModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ $match: { reviewCount: { $gt: 0 } } }),
          expect.objectContaining({ $sort: { avgRating: -1, reviewCount: -1 } }),
          expect.objectContaining({ $limit: 10 })
        ])
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expect.objectContaining({
        avgRating: expect.any(Number),
        reviewCount: expect.any(Number)
      }));
    });

    it('should return top rated books with custom limit', async () => {
      const books = [BookFactory.bookWithStats()];
      mockModel.aggregate.mockResolvedValue(books);

      const result = await repository.getTopRated(5);

      expect(mockModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ $limit: 5 })
        ])
      );
      expect(result).toHaveLength(1);
    });

    it('should handle empty results', async () => {
      mockModel.aggregate.mockResolvedValue([]);

      const result = await repository.getTopRated();

      expect(result).toEqual([]);
    });
  });

  describe('seedBooks', () => {
    it('should seed books successfully', async () => {
      const seedData = [BookFactory.bookPrimitive()];
      mockModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
      mockModel.insertMany.mockResolvedValue(seedData);

      const result = await repository.seedBooks(seedData);

      expect(mockModel.deleteMany).toHaveBeenCalledWith({});
      expect(mockModel.insertMany).toHaveBeenCalledWith(seedData);
      expect(result).toEqual({
        message: 'Successfully seeded 1 books',
        count: 1
      });
    });
  });

  describe('countDocuments', () => {
    it('should return document count', async () => {
      mockModel.countDocuments.mockResolvedValue(5);

      const result = await repository.countDocuments();

      expect(mockModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toBe(5);
    });

    it('should return document count with query', async () => {
      const query = { author: 'Test Author' };
      mockModel.countDocuments.mockResolvedValue(2);

      const result = await repository.countDocuments(query);

      expect(mockModel.countDocuments).toHaveBeenCalledWith(query);
      expect(result).toBe(2);
    });
  });
}); 