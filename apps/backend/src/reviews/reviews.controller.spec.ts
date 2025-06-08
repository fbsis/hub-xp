import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewFactory, ReviewScenarios } from '@test-utils/core';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReviewsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByBook: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: mockReviewsService }],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      const createDto = ReviewFactory.createReviewDto();
      const expected = ReviewFactory.reviewPrimitive();
      mockReviewsService.create.mockResolvedValue(expected);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException when service throws error', async () => {
      const createDto = ReviewFactory.createReviewDto();
      mockReviewsService.create.mockRejectedValue(new Error(ReviewScenarios.ERRORS.BOOK_NOT_FOUND('123')));

      await expect(controller.create(createDto)).rejects.toThrow(
        new BadRequestException(ReviewScenarios.ERRORS.BOOK_NOT_FOUND('123'))
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated reviews', async () => {
      const query = ReviewScenarios.QUERIES.WITH_RATING;
      const expected = ReviewFactory.paginatedResponse();
      mockReviewsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });

    it('should handle empty query parameters', async () => {
      const query = ReviewScenarios.QUERIES.EMPTY;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockReviewsService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findByBook', () => {
    it('should return reviews for a specific book', async () => {
      const bookId = ReviewScenarios.IDS.BOOK_ID;
      const query = ReviewScenarios.QUERIES.WITH_PAGINATION;
      const expected = ReviewFactory.paginatedResponse();
      mockReviewsService.findByBook.mockResolvedValue(expected);

      const result = await controller.findByBook(bookId, query);

      expect(service.findByBook).toHaveBeenCalledWith(bookId, query);
      expect(result).toEqual(expected);
    });

    it('should handle empty results for book', async () => {
      const bookId = 'nonexistent';
      const query = ReviewScenarios.QUERIES.WITH_PAGINATION;
      const expected = ReviewFactory.paginatedResponse([], { page: 1, limit: 10, total: 0 });
      mockReviewsService.findByBook.mockResolvedValue(expected);

      const result = await controller.findByBook(bookId, query);

      expect(service.findByBook).toHaveBeenCalledWith(bookId, query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a review when found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const expected = ReviewFactory.reviewPrimitive({ _id: reviewId });
      mockReviewsService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(reviewId);

      expect(service.findOne).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(reviewId)).rejects.toThrow(
        new NotFoundException(ReviewScenarios.ERRORS.REVIEW_NOT_FOUND(reviewId))
      );
    });
  });

  describe('update', () => {
    it('should update a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const expected = ReviewFactory.reviewPrimitive({ _id: reviewId, ...updateDto });
      mockReviewsService.update.mockResolvedValue(expected);

      const result = await controller.update(reviewId, updateDto);

      expect(service.update).toHaveBeenCalledWith(reviewId, updateDto);
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      mockReviewsService.update.mockResolvedValue(null);

      await expect(controller.update(reviewId, updateDto)).rejects.toThrow(
        new NotFoundException(ReviewScenarios.ERRORS.REVIEW_NOT_FOUND(reviewId))
      );
    });

    it('should throw BadRequestException when service throws error', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      mockReviewsService.update.mockRejectedValue(new Error(ReviewScenarios.ERRORS.VALIDATION_ERROR));

      await expect(controller.update(reviewId, updateDto)).rejects.toThrow(
        new BadRequestException(ReviewScenarios.ERRORS.VALIDATION_ERROR)
      );
    });

    it('should re-throw NotFoundException from service', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      const updateDto = ReviewFactory.updateReviewDto();
      const notFoundError = new NotFoundException('Not found');
      mockReviewsService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(reviewId, updateDto)).rejects.toThrow(notFoundError);
    });
  });

  describe('remove', () => {
    it('should delete a review successfully', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewsService.remove.mockResolvedValue(true);

      await controller.remove(reviewId);

      expect(service.remove).toHaveBeenCalledWith(reviewId);
    });

    it('should throw NotFoundException when review not found', async () => {
      const reviewId = ReviewScenarios.IDS.REVIEW_ID;
      mockReviewsService.remove.mockResolvedValue(false);

      await expect(controller.remove(reviewId)).rejects.toThrow(
        new NotFoundException(ReviewScenarios.ERRORS.REVIEW_NOT_FOUND(reviewId))
      );
    });
  });
}); 