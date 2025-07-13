import { ReviewRepository } from './ReviewRepository';

// Mock Mongoose Model Constructor
const MockReviewModel = jest.fn();

// Create chainable methods for query building
const createQueryChain = (result: any) => ({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result)
});

describe('ReviewRepository', () => {
  let repository: ReviewRepository;
  let mockModel: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset the constructor mock
    MockReviewModel.mockClear();
    
    // Set up static methods on the mock constructor
    mockModel = MockReviewModel;
    mockModel.findById = jest.fn();
    mockModel.find = jest.fn();
    mockModel.findByIdAndUpdate = jest.fn();
    mockModel.findByIdAndDelete = jest.fn();
    mockModel.countDocuments = jest.fn();
    
    repository = new ReviewRepository(mockModel as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new review successfully', async () => {
      const createReviewDto: any = {
        bookId: '507f1f77bcf86cd799439011',
        rating: 5,
        comment: 'Excellent book!',
        reviewerName: 'John Doe'
      };

      const mockSavedReview = {
        _id: '507f1f77bcf86cd799439012',
        ...createReviewDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439012',
          ...createReviewDto,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      // Mock the constructor call
      MockReviewModel.mockImplementation(() => mockSavedReview);

      const result = await repository.create(createReviewDto);

      expect(MockReviewModel).toHaveBeenCalledWith({
        bookId: createReviewDto.bookId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        reviewerName: createReviewDto.reviewerName
      });
      
      expect(mockSavedReview.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439012',
        bookId: createReviewDto.bookId,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        reviewerName: createReviewDto.reviewerName,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should create a review with empty comment when not provided', async () => {
      const createReviewDto: any = {
        bookId: '507f1f77bcf86cd799439011',
        rating: 4,
        reviewerName: 'Jane Smith'
      };

      const mockSavedReview = {
        _id: '507f1f77bcf86cd799439012',
        ...createReviewDto,
        comment: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439012',
          ...createReviewDto,
          comment: '',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      MockReviewModel.mockImplementation(() => mockSavedReview);

      const result = await repository.create(createReviewDto);

      expect(MockReviewModel).toHaveBeenCalledWith({
        bookId: createReviewDto.bookId,
        rating: createReviewDto.rating,
        comment: '',
        reviewerName: createReviewDto.reviewerName
      });
      
      expect(result.comment).toBe('');
    });
  });

  describe('findById', () => {
    it('should return a review when found', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      const mockReview = {
        _id: { toString: () => reviewId },
        bookId: '507f1f77bcf86cd799439011',
        rating: 5,
        comment: 'Great book!',
        reviewerName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockModel.findById.mockResolvedValue(mockReview);

      const result = await repository.findById(reviewId);

      expect(mockModel.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toEqual({
        _id: reviewId,
        bookId: mockReview.bookId,
        rating: mockReview.rating,
        comment: mockReview.comment,
        reviewerName: mockReview.reviewerName,
        createdAt: mockReview.createdAt,
        updatedAt: mockReview.updatedAt
      });
    });

    it('should return null when review not found', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      mockModel.findById.mockResolvedValue(null);

      const result = await repository.findById(reviewId);

      expect(mockModel.findById).toHaveBeenCalledWith(reviewId);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return reviews with pagination and default filters', async () => {
      const mockReviews = [
        {
          _id: { toString: () => '1' },
          bookId: 'book1',
          rating: 5,
          comment: 'Great!',
          reviewerName: 'User1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const queryChain = createQueryChain(mockReviews);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(1);

      const filters: any = {
        page: 1,
        limit: 10
      };

      const result = await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({});
      expect(mockModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual({
        reviews: [
          {
            _id: '1',
            bookId: 'book1',
            rating: 5,
            comment: 'Great!',
            reviewerName: 'User1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      });
    });

    it('should filter reviews by bookId', async () => {
      const mockReviews = [
        {
          _id: { toString: () => '1' },
          bookId: 'book1',
          rating: 5,
          comment: 'Great!',
          reviewerName: 'User1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const queryChain = createQueryChain(mockReviews);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(1);

      const filters: any = {
        page: 1,
        limit: 10,
        bookId: 'book1'
      };

      const result = await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({ bookId: 'book1' });
      expect(mockModel.countDocuments).toHaveBeenCalledWith({ bookId: 'book1' });
      expect(result.reviews).toHaveLength(1);
    });

    it('should filter reviews by rating', async () => {
      const filters: any = {
        page: 1,
        limit: 10,
        rating: '5'
      };

      const queryChain = createQueryChain([]);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(0);

      await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({ rating: 5 });
    });

    it('should filter reviews by reviewer name', async () => {
      const filters: any = {
        page: 1,
        limit: 10,
        reviewerName: 'John'
      };

      const queryChain = createQueryChain([]);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(0);

      await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({
        reviewerName: { $regex: 'John', $options: 'i' }
      });
    });
  });

  describe('findByBook', () => {
    it('should return reviews for a specific book', async () => {
      const bookId = 'book1';
      const mockReviews = [
        {
          _id: { toString: () => '1' },
          bookId: bookId,
          rating: 5,
          comment: 'Great book!',
          reviewerName: 'User1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const queryChain = createQueryChain(mockReviews);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(1);

      const filters: any = { page: 1, limit: 10 };

      const result = await repository.findByBook(bookId, filters);

      expect(mockModel.find).toHaveBeenCalledWith({ bookId });
      expect(mockModel.countDocuments).toHaveBeenCalledWith({ bookId });
      expect(result).toEqual({
        reviews: [
          {
            _id: '1',
            bookId: bookId,
            rating: 5,
            comment: 'Great book!',
            reviewerName: 'User1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      });
    });
  });

  describe('update', () => {
    it('should update a review successfully', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      const updateDto: any = {
        rating: 4,
        comment: 'Updated comment'
      };

      const updatedReview = {
        _id: { toString: () => reviewId },
        bookId: '507f1f77bcf86cd799439011',
        rating: 4,
        comment: 'Updated comment',
        reviewerName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockModel.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const result = await repository.update(reviewId, updateDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        reviewId,
        {
          rating: 4,
          comment: 'Updated comment'
        },
        { new: true, runValidators: true }
      );

      expect(result).toEqual({
        _id: reviewId,
        bookId: '507f1f77bcf86cd799439011',
        rating: 4,
        comment: 'Updated comment',
        reviewerName: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should return null when review to update is not found', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      const updateDto: any = { rating: 4 };

      mockModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await repository.update(reviewId, updateDto);

      expect(result).toBeNull();
    });

    it('should only update provided fields', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      const updateDto: any = { rating: 3 };

      const updatedReview = {
        _id: { toString: () => reviewId },
        bookId: '507f1f77bcf86cd799439011',
        rating: 3,
        comment: 'Old comment',
        reviewerName: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockModel.findByIdAndUpdate.mockResolvedValue(updatedReview);

      const result = await repository.update(reviewId, updateDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        reviewId,
        { rating: 3 },
        { new: true, runValidators: true }
      );
      
      expect(result).toEqual({
        _id: reviewId,
        bookId: '507f1f77bcf86cd799439011',
        rating: 3,
        comment: 'Old comment',
        reviewerName: 'John Doe',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('delete', () => {
    it('should delete a review successfully', async () => {
      const reviewId = '507f1f77bcf86cd799439012';
      const deletedReview = { _id: reviewId };

      mockModel.findByIdAndDelete.mockResolvedValue(deletedReview);

      const result = await repository.delete(reviewId);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(reviewId);
      expect(result).toBe(true);
    });

    it('should return false when review to delete is not found', async () => {
      const reviewId = '507f1f77bcf86cd799439012';

      mockModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await repository.delete(reviewId);

      expect(result).toBe(false);
    });
  });
}); 