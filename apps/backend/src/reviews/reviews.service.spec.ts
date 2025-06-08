import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewRepository, BookRepository } from '@infrastructure/core';
import { CreateReviewDto, UpdateReviewDto, ReviewPrimitive } from '@domain/core';
import { ReviewFactory, ReviewScenarios } from '@test-utils/core';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepository: ReviewRepository;
  let bookRepository: BookRepository;

  const mockReviewRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByBook: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBookRepository = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: ReviewRepository, useValue: mockReviewRepository },
        { provide: BookRepository, useValue: mockBookRepository },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review successfully when book exists', async () => {
      const createDto = ReviewFactory.createReviewDto();
      const expected = ReviewFactory.reviewPrimitive();
      mockBookRepository.exists.mockResolvedValue(true);
      mockReviewRepository.create.mockResolvedValue(expected);

      const result = await service.create(createDto);

      expect(bookRepository.exists).toHaveBeenCalledWith(createDto.bookId);
      expect(reviewRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when book does not exist', async () => {
      const createDto = ReviewFactory.createReviewDto();
      mockBookRepository.exists.mockResolvedValue(false);

      await expect(service.create(createDto)).rejects.toThrow(
        new NotFoundException(ReviewScenarios.ERRORS.BOOK_NOT_FOUND(createDto.bookId))
      );

      expect(bookRepository.exists).toHaveBeenCalledWith(createDto.bookId);
      expect(reviewRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors after book validation', async () => {
      const createDto = ReviewFactory.createReviewDto();
      mockBookRepository.exists.mockResolvedValue(true);
      mockReviewRepository.create.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.create(createDto)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);

      expect(bookRepository.exists).toHaveBeenCalledWith(createDto.bookId);
      expect(reviewRepository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated reviews', async () => {
      const filters = ReviewScenarios.QUERIES.WITH_RATING;
      const expected = ReviewFactory.paginatedResponse();
      mockReviewRepository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(reviewRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expected);
    });

    it('should handle empty filters', async () => {
      const filters = ReviewScenarios.QUERIES.EMPTY;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockReviewRepository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(reviewRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expected);
    });
  });

  describe('findByBook', () => {
    it('should return reviews for a specific book', async () => {
      const bookId = ReviewScenarios.IDS.BOOK_ID;
      const filters = ReviewScenarios.QUERIES.WITH_PAGINATION;
      const expected = ReviewFactory.paginatedResponse();
      mockReviewRepository.findByBook.mockResolvedValue(expected);

      const result = await service.findByBook(bookId, filters);

      expect(reviewRepository.findByBook).toHaveBeenCalledWith(bookId, filters);
      expect(result).toEqual(expected);
    });

    it('should handle empty results for book', async () => {
      const bookId = 'nonexistent';
      const filters = ReviewScenarios.QUERIES.WITH_PAGINATION;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockReviewRepository.findByBook.mockResolvedValue(expected);

      const result = await service.findByBook(bookId, filters);

      expect(reviewRepository.findByBook).toHaveBeenCalledWith(bookId, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a review when found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const expected = ReviewFactory.reviewPrimitive({ _id: reviewId });
      mockReviewRepository.findById.mockResolvedValue(expected);

      const result = await service.findOne(reviewId);

      expect(reviewRepository.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(expected);
    });

    it('should return null when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewRepository.findById.mockResolvedValue(null);

      const result = await service.findOne(reviewId);

      expect(reviewRepository.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const expected = ReviewFactory.reviewPrimitive({ _id: reviewId, ...updateDto });
      mockReviewRepository.update.mockResolvedValue(expected);

      const result = await service.update(reviewId, updateDto);

      expect(reviewRepository.update).toHaveBeenCalledWith(reviewId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should return null when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      mockReviewRepository.update.mockResolvedValue(null);

      const result = await service.update(reviewId, updateDto);

      expect(reviewRepository.update).toHaveBeenCalledWith(reviewId, updateDto);
      expect(result).toBeNull();
    });

    it('should propagate repository errors', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      mockReviewRepository.update.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.update(reviewId, updateDto)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);

      expect(reviewRepository.update).toHaveBeenCalledWith(reviewId, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewRepository.delete.mockResolvedValue(true);

      const result = await service.remove(reviewId);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
      expect(result).toBe(true);
    });

    it('should return false when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewRepository.delete.mockResolvedValue(false);

      const result = await service.remove(reviewId);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
      expect(result).toBe(false);
    });

    it('should propagate repository errors', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewRepository.delete.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.remove(reviewId)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
    });
  });
}); 