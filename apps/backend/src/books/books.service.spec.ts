import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepository } from '@infrastructure/core';
import { BookFactory, BookScenarios } from '@test-utils/core';
import { BookMapper } from '@domain/core';

describe('BooksService', () => {
  let service: BooksService;
  let repository: jest.Mocked<BookRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getTopRated: jest.fn(),
      seedBooks: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BookRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get(BookRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createDto = BookFactory.createBookDto();
      const bookEntity = BookMapper.fromCreateDto(createDto);
      const expected = BookFactory.bookPrimitive();

      repository.create.mockResolvedValue(expected);

      const result = await service.create(bookEntity);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should handle repository errors', async () => {
      const createDto = BookFactory.createBookDto();
      const bookEntity = BookMapper.fromCreateDto(createDto);

      repository.create.mockRejectedValue(new Error(BookScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.create(bookEntity)).rejects.toThrow(BookScenarios.ERRORS.DATABASE_ERROR);
    });
  });

  describe('seedDatabase', () => {
    it('should seed the database successfully', async () => {
      const expected = BookScenarios.SEED_RESPONSE;

      repository.seedBooks.mockResolvedValue(expected);

      const result = await service.seedDatabase();

      expect(repository.seedBooks).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should handle seeding errors', async () => {
      repository.seedBooks.mockRejectedValue(new Error(BookScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.seedDatabase()).rejects.toThrow('Error seeding books: ' + BookScenarios.ERRORS.DATABASE_ERROR);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const query = { page: 1, limit: 10 } as any;
      const expected = BookFactory.paginatedResponse();

      repository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const expected = BookFactory.bookPrimitive();

      repository.findById.mockResolvedValue(expected);

      const result = await service.findOne(bookId);

      expect(repository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;

      repository.findById.mockResolvedValue(null);

      const result = await service.findOne(bookId);

      expect(repository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const bookEntity = BookMapper.fromUpdateDto(updateDto);
      const expected = BookFactory.bookPrimitive();

      repository.update.mockResolvedValue(expected);

      const result = await service.update(bookId, bookEntity);

      expect(repository.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should return null when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const bookEntity = BookMapper.fromUpdateDto(updateDto);

      repository.update.mockResolvedValue(null);

      const result = await service.update(bookId, bookEntity);

      expect(repository.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;

      repository.delete.mockResolvedValue(true);

      const result = await service.remove(bookId);

      expect(repository.delete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(true);
    });

    it('should return false when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;

      repository.delete.mockResolvedValue(false);

      const result = await service.remove(bookId);

      expect(repository.delete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(false);
    });
  });

  describe('getTopRated', () => {
    it('should return top rated books with default limit', async () => {
      const expected = [BookFactory.bookWithStats()];

      repository.getTopRated.mockResolvedValue(expected);

      const result = await service.getTopRated();

      expect(repository.getTopRated).toHaveBeenCalledWith(10);
      expect(result).toEqual(expected);
    });

    it('should return top rated books with custom limit', async () => {
      const limit = 5;
      const expected = [BookFactory.bookWithStats()];

      repository.getTopRated.mockResolvedValue(expected);

      const result = await service.getTopRated(limit);

      expect(repository.getTopRated).toHaveBeenCalledWith(limit);
      expect(result).toEqual(expected);
    });
  });
}); 