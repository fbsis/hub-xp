import { booksApi, reviewsApi } from './api';
import { BookWithStats, Book, Review, ReviewsResponse, CreateReviewDto } from '@/types/api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const mockBookWithStats: BookWithStats = {
  _id: '1',
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: 2023,
  description: 'Test description',
  avgRating: 4.5,
  reviewCount: 10,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockBook: Book = {
  _id: '1',
  title: 'Test Book',
  author: 'Test Author',
  publishedYear: 2023,
  description: 'Test description',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockReview: Review = {
  _id: '1',
  bookId: '1',
  rating: 5,
  comment: 'Great book!',
  reviewerName: 'Test Reviewer',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockReviewsResponse: ReviewsResponse = {
  reviews: [mockReview],
  total: 1,
  page: 1,
  limit: 10
};

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('booksApi', () => {
    describe('getTopBooks', () => {
      it('fetches top books successfully', async () => {
        const mockResponse = [mockBookWithStats];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await booksApi.getTopBooks(5);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/books/top?limit=5',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('uses default limit when not provided', async () => {
        const mockResponse = [mockBookWithStats];
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        await booksApi.getTopBooks();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/books/top?limit=10',
          expect.any(Object)
        );
      });

      it('handles API error response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response);

        await expect(booksApi.getTopBooks()).rejects.toThrow('HTTP 500: Internal Server Error');
      });

      it('handles network error', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(booksApi.getTopBooks()).rejects.toThrow('Network error: Network error');
      });
    });

    describe('getBook', () => {
      it('fetches a single book successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockBook,
        } as Response);

        const result = await booksApi.getBook('1');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/books/1',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        expect(result).toEqual(mockBook);
      });

      it('handles book not found error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        } as Response);

        await expect(booksApi.getBook('999')).rejects.toThrow('HTTP 404: Not Found');
      });
    });

    describe('getBookReviews', () => {
      it('fetches book reviews successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReviewsResponse,
        } as Response);

        const result = await booksApi.getBookReviews('1', 1, 5);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/reviews/book/1?page=1&limit=5',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        expect(result).toEqual(mockReviewsResponse);
      });

      it('uses default pagination when not provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReviewsResponse,
        } as Response);

        await booksApi.getBookReviews('1');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/reviews/book/1?page=1&limit=10',
          expect.any(Object)
        );
      });
    });
  });

  describe('reviewsApi', () => {
    describe('createReview', () => {
      it('creates a review successfully', async () => {
        const reviewDto: CreateReviewDto = {
          bookId: '1',
          rating: 5,
          comment: 'Excellent book!',
          reviewerName: 'John Doe'
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReview,
        } as Response);

        const result = await reviewsApi.createReview(reviewDto);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/reviews',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewDto),
          }
        );
        expect(result).toEqual(mockReview);
      });

      it('handles validation error when creating review', async () => {
        const reviewDto: CreateReviewDto = {
          bookId: '1',
          rating: 6, // Invalid rating
          comment: 'Test',
          reviewerName: 'John Doe'
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
        } as Response);

        await expect(reviewsApi.createReview(reviewDto)).rejects.toThrow('HTTP 400: Bad Request');
      });
    });

    describe('getReviews', () => {
      it('fetches all reviews successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReviewsResponse,
        } as Response);

        const result = await reviewsApi.getReviews(1, 5);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/reviews?page=1&limit=5',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        expect(result).toEqual(mockReviewsResponse);
      });

      it('uses default pagination when not provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockReviewsResponse,
        } as Response);

        await reviewsApi.getReviews();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3001/reviews?page=1&limit=10',
          expect.any(Object)
        );
      });
    });
  });

  describe('API Error handling', () => {
    it('uses fallback API URL when environment variable is not set', async () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockBookWithStats],
      } as Response);

      await booksApi.getTopBooks();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/books/top?limit=10',
        expect.any(Object)
      );
    });

    it('preserves custom headers when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReview,
      } as Response);

      const reviewDto: CreateReviewDto = {
        bookId: '1',
        rating: 5,
        reviewerName: 'Test'
      };

      await reviewsApi.createReview(reviewDto);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('handles JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      await expect(booksApi.getTopBooks()).rejects.toThrow('Invalid JSON');
    });
  });
}); 