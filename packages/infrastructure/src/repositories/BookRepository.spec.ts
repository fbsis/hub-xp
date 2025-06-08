import { BookRepository } from './BookRepository';

// Mock Mongoose Model Constructor
const MockBookModel = jest.fn();

// Create chainable methods for query building
const createQueryChain = (result: any) => ({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
  select: jest.fn().mockReturnThis()
});

describe('BookRepository', () => {
  let repository: BookRepository;
  let mockModel: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset the constructor mock
    MockBookModel.mockClear();
    
    // Set up static methods on the mock constructor
    mockModel = MockBookModel;
    mockModel.findById = jest.fn();
    mockModel.find = jest.fn();
    mockModel.findByIdAndUpdate = jest.fn();
    mockModel.findByIdAndDelete = jest.fn();
    mockModel.countDocuments = jest.fn();
    mockModel.insertMany = jest.fn();
    mockModel.aggregate = jest.fn();
    
    repository = new BookRepository(mockModel as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new book successfully', async () => {
      const createBookDto: any = {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        description: 'A handbook of agile software craftsmanship.'
      };

      const mockSavedBook = {
        _id: '507f1f77bcf86cd799439011',
        ...createBookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: '507f1f77bcf86cd799439011',
          ...createBookDto,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      // Mock the constructor call
      MockBookModel.mockImplementation(() => mockSavedBook);

      const result = await repository.create(createBookDto);

      expect(MockBookModel).toHaveBeenCalledWith({
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        publishedYear: createBookDto.publishedYear,
        description: createBookDto.description
      });
      
      expect(mockSavedBook.save).toHaveBeenCalled();
      expect(result).toEqual({
        _id: '507f1f77bcf86cd799439011',
        title: createBookDto.title,
        author: createBookDto.author,
        isbn: createBookDto.isbn,
        publishedYear: createBookDto.publishedYear,
        description: createBookDto.description,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('findById', () => {
    it('should return a book when found', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const mockBook = {
        _id: { toString: () => bookId },
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        description: 'A handbook of agile software craftsmanship.',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockModel.findById.mockResolvedValue(mockBook);

      const result = await repository.findById(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toEqual({
        _id: bookId,
        title: mockBook.title,
        author: mockBook.author,
        isbn: mockBook.isbn,
        publishedYear: mockBook.publishedYear,
        description: mockBook.description,
        createdAt: mockBook.createdAt,
        updatedAt: mockBook.updatedAt
      });
    });

    it('should return null when book not found', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      mockModel.findById.mockResolvedValue(null);

      const result = await repository.findById(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return books with pagination (simple query)', async () => {
      const mockBooks = [
        {
          _id: { toString: () => '1' },
          title: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
          publishedYear: 2020,
          description: 'Description 1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const queryChain = createQueryChain(mockBooks);
      mockModel.find.mockReturnValue(queryChain);
      mockModel.countDocuments.mockResolvedValue(1);

      const filters: any = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const result = await repository.findAll(filters);

      expect(mockModel.find).toHaveBeenCalledWith({});
      expect(mockModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual({
        books: [
          {
            _id: '1',
            title: 'Book 1',
            author: 'Author 1',
            isbn: '1234567890',
            publishedYear: 2020,
            description: 'Description 1',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        ],
        total: 1,
        page: 1,
        limit: 10
      });
    });

    it('should use aggregation when minRating filter is provided', async () => {
      const filters: any = {
        page: 1,
        limit: 10,
        minRating: 4
      };

      const mockAggregateResult = [
        {
          _id: '1',
          title: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
          publishedYear: 2020,
          description: 'Description 1',
          avgRating: 4.5,
          reviewCount: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockModel.aggregate
        .mockResolvedValueOnce([{ total: 1 }]) // count pipeline
        .mockResolvedValueOnce(mockAggregateResult); // main pipeline

      const result = await repository.findAllWithStats(filters);

      expect(mockModel.aggregate).toHaveBeenCalledTimes(2);
      expect(result.books).toHaveLength(1);
      expect(result.books[0]).toHaveProperty('avgRating', 4.5);
      expect(result.books[0]).toHaveProperty('reviewCount', 10);
    });
  });

  describe('update', () => {
    it('should update a book successfully', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const updateDto: any = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const updatedBook = {
        _id: { toString: () => bookId },
        title: 'Updated Title',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockModel.findByIdAndUpdate.mockResolvedValue(updatedBook);

      const result = await repository.update(bookId, updateDto);

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        bookId,
        {
          title: 'Updated Title',
          description: 'Updated description'
        },
        { new: true, runValidators: true }
      );

      expect(result).toEqual({
        _id: bookId,
        title: 'Updated Title',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        publishedYear: 2008,
        description: 'Updated description',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
    });

    it('should return null when book to update is not found', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const updateDto: any = { title: 'Updated Title' };

      mockModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await repository.update(bookId, updateDto);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a book successfully', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const deletedBook = { _id: bookId };

      mockModel.findByIdAndDelete.mockResolvedValue(deletedBook);

      const result = await repository.delete(bookId);

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(bookId);
      expect(result).toBe(true);
    });

    it('should return false when book to delete is not found', async () => {
      const bookId = '507f1f77bcf86cd799439011';

      mockModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await repository.delete(bookId);

      expect(result).toBe(false);
    });
  });

  describe('getTopRated', () => {
    it('should return top rated books using aggregation', async () => {
      const limit = 5;
      const mockTopBooks = [
        {
          _id: '1',
          title: 'Best Book',
          author: 'Great Author',
          isbn: '1234567890',
          publishedYear: 2020,
          description: 'Amazing book',
          avgRating: 4.8,
          reviewCount: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockModel.aggregate.mockResolvedValue(mockTopBooks);

      const result = await repository.getTopRated(limit);

      expect(mockModel.aggregate).toHaveBeenCalledWith([
        {
          $lookup: {
            from: 'reviews',
            let: { bookId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$bookId', { $toString: '$$bookId' }]
                  }
                }
              }
            ],
            as: 'reviews'
          }
        },
        {
          $addFields: {
            avgRating: {
              $cond: {
                if: { $gt: [{ $size: '$reviews' }, 0] },
                then: { $avg: '$reviews.rating' },
                else: 0
              }
            },
            reviewCount: { $size: '$reviews' }
          }
        },
        {
          $match: { reviewCount: { $gt: 0 } }
        },
        {
          $sort: { avgRating: -1, reviewCount: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: { reviews: 0 }
        }
      ]);

      expect(result).toEqual([
        {
          _id: '1',
          title: 'Best Book',
          author: 'Great Author',
          isbn: '1234567890',
          publishedYear: 2020,
          description: 'Amazing book',
          avgRating: 4.8,
          reviewCount: 100,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);
    });
  });

  describe('exists', () => {
    it('should return true when book exists', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const queryChain = {
        select: jest.fn().mockResolvedValue({ _id: bookId })
      };
      
      mockModel.findById.mockReturnValue(queryChain);

      const result = await repository.exists(bookId);

      expect(mockModel.findById).toHaveBeenCalledWith(bookId);
      expect(queryChain.select).toHaveBeenCalledWith('_id');
      expect(result).toBe(true);
    });

    it('should return false when book does not exist', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const queryChain = {
        select: jest.fn().mockResolvedValue(null)
      };
      
      mockModel.findById.mockReturnValue(queryChain);

      const result = await repository.exists(bookId);

      expect(result).toBe(false);
    });
  });

  describe('seedBooks', () => {
    it('should seed books when database is empty', async () => {
      const seedData = [
        {
          title: 'Seed Book 1',
          author: 'Seed Author 1',
          isbn: '1111111111',
          publishedYear: 2020,
          description: 'Seed description 1'
        }
      ];

      mockModel.countDocuments.mockResolvedValue(0);
      mockModel.insertMany.mockResolvedValue([{ _id: '1', ...seedData[0] }]);

      const result = await repository.seedBooks(seedData);

      expect(mockModel.countDocuments).toHaveBeenCalled();
      expect(mockModel.insertMany).toHaveBeenCalledWith(seedData);
      expect(result).toEqual({
        message: 'Successfully seeded 1 books to the database.',
        count: 1
      });
    });

    it('should skip seeding when books already exist', async () => {
      const seedData = [{ title: 'Test' }];
      
      mockModel.countDocuments.mockResolvedValue(5);

      const result = await repository.seedBooks(seedData);

      expect(mockModel.countDocuments).toHaveBeenCalled();
      expect(mockModel.insertMany).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Database already has 5 books. Skipping seed.',
        count: 5
      });
    });
  });

  describe('countDocuments', () => {
    it('should return the count of documents', async () => {
      mockModel.countDocuments.mockResolvedValue(42);

      const result = await repository.countDocuments();

      expect(mockModel.countDocuments).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });
}); 