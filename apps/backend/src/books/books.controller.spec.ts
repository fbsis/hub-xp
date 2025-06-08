import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BookFactory, BookScenarios } from '@test-utils/core';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    seedDatabase: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getTopRated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: mockBooksService }],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book successfully', async () => {
      const createDto = BookFactory.createBookDto();
      const expected = BookFactory.bookPrimitive();
      mockBooksService.create.mockResolvedValue(expected);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException when service throws error', async () => {
      const createDto = BookFactory.createBookDto();
      mockBooksService.create.mockRejectedValue(new Error(BookScenarios.ERRORS.INVALID_DATA));

      await expect(controller.create(createDto)).rejects.toThrow(
        new BadRequestException(BookScenarios.ERRORS.INVALID_DATA)
      );
    });
  });

  describe('seedBooks', () => {
    it('should seed database successfully', async () => {
      mockBooksService.seedDatabase.mockResolvedValue(BookScenarios.SEED_RESPONSE);

      const result = await controller.seedBooks();

      expect(service.seedDatabase).toHaveBeenCalled();
      expect(result).toEqual(BookScenarios.SEED_RESPONSE);
    });

    it('should throw BadRequestException when seeding fails', async () => {
      mockBooksService.seedDatabase.mockRejectedValue(new Error(BookScenarios.ERRORS.SEEDING_FAILED));

      await expect(controller.seedBooks()).rejects.toThrow(
        new BadRequestException(BookScenarios.ERRORS.SEEDING_FAILED)
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const query = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' } as any;
      const expected = BookFactory.paginatedResponse();
      mockBooksService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should handle empty query parameters', async () => {
      const query = {} as any;
      const expected = BookFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockBooksService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('getTopBooks', () => {
    it('should return top books with default limit', async () => {
      const expected = [BookFactory.bookWithStats()];
      mockBooksService.getTopRated.mockResolvedValue(expected);

      const result = await controller.getTopBooks();

      expect(service.getTopRated).toHaveBeenCalledWith(10);
      expect(result).toEqual(expected);
    });

    it('should return top books with custom limit', async () => {
      const expected = [];
      mockBooksService.getTopRated.mockResolvedValue(expected);

      const result = await controller.getTopBooks('5');

      expect(service.getTopRated).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a book when found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const expected = BookFactory.bookPrimitive({ _id: bookId });
      mockBooksService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(bookId);

      expect(service.findOne).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBooksService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(bookId)).rejects.toThrow(
        new NotFoundException(BookScenarios.ERRORS.BOOK_NOT_FOUND(bookId))
      );
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const expected = BookFactory.bookPrimitive({ _id: bookId, ...updateDto });
      mockBooksService.update.mockResolvedValue(expected);

      const result = await controller.update(bookId, updateDto);

      expect(service.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      mockBooksService.update.mockResolvedValue(null);

      await expect(controller.update(bookId, updateDto)).rejects.toThrow(
        new NotFoundException(BookScenarios.ERRORS.BOOK_NOT_FOUND(bookId))
      );
    });

    it('should throw BadRequestException when service throws error', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      mockBooksService.update.mockRejectedValue(new Error(BookScenarios.ERRORS.VALIDATION_ERROR));

      await expect(controller.update(bookId, updateDto)).rejects.toThrow(
        new BadRequestException(BookScenarios.ERRORS.VALIDATION_ERROR)
      );
    });

    it('should re-throw NotFoundException from service', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      const updateDto = BookFactory.updateBookDto();
      const notFoundError = new NotFoundException('Not found');
      mockBooksService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(bookId, updateDto)).rejects.toThrow(notFoundError);
    });
  });

  describe('remove', () => {
    it('should delete a book successfully', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBooksService.remove.mockResolvedValue(true);

      await controller.remove(bookId);

      expect(service.remove).toHaveBeenCalledWith(bookId);
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = BookScenarios.IDS.BOOK_ID;
      mockBooksService.remove.mockResolvedValue(false);

      await expect(controller.remove(bookId)).rejects.toThrow(
        new NotFoundException(BookScenarios.ERRORS.BOOK_NOT_FOUND(bookId))
      );
    });
  });
}); 