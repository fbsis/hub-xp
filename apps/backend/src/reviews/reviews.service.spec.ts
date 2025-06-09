import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewRepository, BookRepository } from '@infrastructure/core';
import { ReviewFactory, ReviewScenarios } from '@test-utils/core';
import { ReviewMapper } from '@domain/core';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepository: jest.Mocked<ReviewRepository>;
  let bookRepository: jest.Mocked<BookRepository>;

  beforeEach(async () => {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: ReviewRepository,
          useValue: mockReviewRepository,
        },
        {
          provide: BookRepository,
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get(ReviewRepository);
    bookRepository = module.get(BookRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const createDto = ReviewFactory.createReviewDto();
      const reviewEntity = ReviewMapper.fromCreateDto(createDto);
      const expected = ReviewFactory.reviewPrimitive();

      bookRepository.exists.mockResolvedValue(true);
      reviewRepository.create.mockResolvedValue(expected);

      const result = await service.create(reviewEntity);

      expect(bookRepository.exists).toHaveBeenCalledWith(createDto.bookId);
      expect(reviewRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when book does not exist', async () => {
      const createDto = ReviewFactory.createReviewDto();
      const reviewEntity = ReviewMapper.fromCreateDto(createDto);

      bookRepository.exists.mockResolvedValue(false);

      await expect(service.create(reviewEntity)).rejects.toThrow(
        new NotFoundException(`Book with ID ${createDto.bookId} not found`)
      );
      expect(bookRepository.exists).toHaveBeenCalledWith(createDto.bookId);
      expect(reviewRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const createDto = ReviewFactory.createReviewDto();
      const reviewEntity = ReviewMapper.fromCreateDto(createDto);

      bookRepository.exists.mockResolvedValue(true);
      reviewRepository.create.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.create(reviewEntity)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);
    });
  });

  describe('findAll', () => {
    it('should return paginated reviews', async () => {
      const filters = ReviewScenarios.QUERIES.WITH_RATING;
      const expected = ReviewFactory.paginatedResponse();
      reviewRepository.findAll.mockResolvedValue(expected);

      const result = await service.findAll(filters);

      expect(reviewRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expected);
    });

    it('should handle empty filters', async () => {
      const filters = ReviewScenarios.QUERIES.EMPTY;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      reviewRepository.findAll.mockResolvedValue(expected);

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
      reviewRepository.findByBook.mockResolvedValue(expected);

      const result = await service.findByBook(bookId, filters);

      expect(reviewRepository.findByBook).toHaveBeenCalledWith(bookId, filters);
      expect(result).toEqual(expected);
    });

    it('should handle empty results for book', async () => {
      const bookId = 'nonexistent';
      const filters = ReviewScenarios.QUERIES.WITH_PAGINATION;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      reviewRepository.findByBook.mockResolvedValue(expected);

      const result = await service.findByBook(bookId, filters);

      expect(reviewRepository.findByBook).toHaveBeenCalledWith(bookId, filters);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a review when found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const expected = ReviewFactory.reviewPrimitive({ _id: reviewId });
      reviewRepository.findById.mockResolvedValue(expected);

      const result = await service.findOne(reviewId);

      expect(reviewRepository.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(expected);
    });

    it('should return null when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      reviewRepository.findById.mockResolvedValue(null);

      const result = await service.findOne(reviewId);

      expect(reviewRepository.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const reviewEntity = ReviewMapper.fromUpdateDto(updateDto);
      const expected = ReviewFactory.reviewPrimitive();

      reviewRepository.update.mockResolvedValue(expected);

      const result = await service.update(reviewId, reviewEntity);

      expect(reviewRepository.update).toHaveBeenCalledWith(reviewId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should return null when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const reviewEntity = ReviewMapper.fromUpdateDto(updateDto);

      reviewRepository.update.mockResolvedValue(null);

      const result = await service.update(reviewId, reviewEntity);

      expect(reviewRepository.update).toHaveBeenCalledWith(reviewId, updateDto);
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const reviewEntity = ReviewMapper.fromUpdateDto(updateDto);

      reviewRepository.update.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.update(reviewId, reviewEntity)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);
    });
  });

  describe('remove', () => {
    it('should delete a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      reviewRepository.delete.mockResolvedValue(true);

      const result = await service.remove(reviewId);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
      expect(result).toBe(true);
    });

    it('should return false when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      reviewRepository.delete.mockResolvedValue(false);

      const result = await service.remove(reviewId);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
      expect(result).toBe(false);
    });

    it('should propagate repository errors', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      reviewRepository.delete.mockRejectedValue(new Error(ReviewScenarios.ERRORS.DATABASE_ERROR));

      await expect(service.remove(reviewId)).rejects.toThrow(ReviewScenarios.ERRORS.DATABASE_ERROR);

      expect(reviewRepository.delete).toHaveBeenCalledWith(reviewId);
    });
  });
}); 