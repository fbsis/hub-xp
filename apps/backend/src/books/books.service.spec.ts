import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepository } from '@infrastructure/core';
import { BookFactory, BookScenarios } from '@test-utils/core';

describe('BooksService', () => {
  let service: BooksService;
  let repository: BookRepository;

  const mockBookRepository = {
    create: jest.fn(),
    seedBooks: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTopRated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: BookRepository, useValue: mockBookRepository },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<BookRepository>(BookRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createDto = BookFactory.createBookDto();
      const expected = BookFactory.bookPrimitive();
      mockBookRepository.create.mockResolvedValue(expected);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should propagate repository errors', async () => {
      const createDto = BookFactory.createBookDto();
      mockBookRepository.create.mockRejectedValue(new Error(BookScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.create(createDto)).rejects.toThrow(BookScenarios.ERRORS.DATABASE_ERROR);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('seedDatabase', () => {
    it('should seed database successfully', async () => {
      mockBookRepository.seedBooks.mockResolvedValue(BookScenarios.SEED_RESPONSE);

      const result = await service.seedDatabase();

      expect(repository.seedBooks).toHaveBeenCalled();
      expect(result).toEqual(BookScenarios.SEED_RESPONSE);
      
      // Verify that the seed data passed doesn't contain avgRating and reviewCount
      const seedDataCalled = mockBookRepository.seedBooks.mock.calls[0][0];
      expect(seedDataCalled).toBeDefined();
      if (seedDataCalled.length > 0) {
        expect(seedDataCalled[0]).not.toHaveProperty('avgRating');
        expect(seedDataCalled[0]).not.toHaveProperty('reviewCount');
      }
    });

    it('should handle seeding errors', async () => {
      mockBookRepository.seedBooks.mockRejectedValue(new Error(BookScenarios.ERRORS.SEEDING_FAILED));

      await expect(service.seedDatabase()).rejects.toThrow(
        `Error seeding books: ${BookScenarios.ERRORS.SEEDING_FAILED}`
      );
      expect(repository.seedBooks).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const query = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' } as any;
      const expected = BookFactory.paginatedResponse();
      mockBookRepository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should handle empty results', async () => {
      const query = { page: 1, limit: 10 } as any;
      const expected = BookFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockBookRepository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a book when found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const expected = BookFactory.bookPrimitive({ _id: bookId });
      mockBookRepository.findById.mockResolvedValue(expected);

      const result = await service.findOne(bookId);

      expect(repository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBookRepository.findById.mockResolvedValue(null);

      const result = await service.findOne(bookId);

      expect(repository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const expected = BookFactory.bookPrimitive({ _id: bookId, ...updateDto });
      mockBookRepository.update.mockResolvedValue(expected);

      const result = await service.update(bookId, updateDto);

      expect(repository.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      mockBookRepository.update.mockResolvedValue(null);

      const result = await service.update(bookId, updateDto);

      expect(repository.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBookRepository.delete.mockResolvedValue(true);

      const result = await service.remove(bookId);

      expect(repository.delete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(true);
    });

    it('should return false when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBookRepository.delete.mockResolvedValue(false);

      const result = await service.remove(bookId);

      expect(repository.delete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(false);
    });
  });

  describe('getTopRated', () => {
    it('should return top rated books with default limit', async () => {
      const expected = [BookFactory.bookWithStats()];
      mockBookRepository.getTopRated.mockResolvedValue(expected);

      const result = await service.getTopRated();

      expect(repository.getTopRated).toHaveBeenCalledWith(10);
      expect(result).toEqual(expected);
    });

    it('should return top rated books with custom limit', async () => {
      const limit = 5;
      const expected = [BookFactory.bookWithStats({ avgRating: 4.5, reviewCount: 50 })];
      mockBookRepository.getTopRated.mockResolvedValue(expected);

      const result = await service.getTopRated(limit);

      expect(repository.getTopRated).toHaveBeenCalledWith(limit);
      expect(result).toEqual(expected);
    });

    it('should handle empty results', async () => {
      const expected = [];
      mockBookRepository.getTopRated.mockResolvedValue(expected);

      const result = await service.getTopRated();

      expect(repository.getTopRated).toHaveBeenCalledWith(10);
      expect(result).toEqual(expected);
    });
  });
}); 