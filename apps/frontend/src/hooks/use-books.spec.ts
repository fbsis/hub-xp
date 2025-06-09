import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTopBooks, useBook, useBookReviews } from './use-books';
import { booksApi } from '@/services/api';
import { BookWithStats, Book, ReviewsResponse } from '@/types/api';

// Mock the API service
jest.mock('@/services/api');
const mockBooksApi = booksApi as jest.Mocked<typeof booksApi>;

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

const mockReviewsResponse: ReviewsResponse = {
  reviews: [{
    _id: '1',
    bookId: '1',
    rating: 5,
    comment: 'Great book!',
    reviewerName: 'Test Reviewer',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }],
  total: 1,
  page: 1,
  limit: 10
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );

  return Wrapper;
};

describe('useBooks hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useTopBooks', () => {
    it('fetches top books successfully', async () => {
      mockBooksApi.getTopBooks.mockResolvedValue([mockBookWithStats]);

      const { result } = renderHook(() => useTopBooks(5), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([mockBookWithStats]);
      expect(mockBooksApi.getTopBooks).toHaveBeenCalledWith(5);
    });

    it('uses default limit when not provided', async () => {
      mockBooksApi.getTopBooks.mockResolvedValue([mockBookWithStats]);

      const { result } = renderHook(() => useTopBooks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockBooksApi.getTopBooks).toHaveBeenCalledWith(10);
    });

    it('handles error when fetching top books fails', async () => {
      const error = new Error('API Error');
      mockBooksApi.getTopBooks.mockRejectedValue(error);

      const { result } = renderHook(() => useTopBooks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('uses correct query key', async () => {
      mockBooksApi.getTopBooks.mockResolvedValue([mockBookWithStats]);

      const { result } = renderHook(() => useTopBooks(15), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The query key should include the limit parameter
      expect(mockBooksApi.getTopBooks).toHaveBeenCalledWith(15);
    });

    it('has correct stale time configuration', async () => {
      mockBooksApi.getTopBooks.mockResolvedValue([mockBookWithStats]);

      const { result } = renderHook(() => useTopBooks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The data should not be stale immediately
      expect(result.current.isStale).toBe(false);
    });
  });

  describe('useBook', () => {
    it('fetches a single book successfully', async () => {
      mockBooksApi.getBook.mockResolvedValue(mockBook);

      const { result } = renderHook(() => useBook('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockBook);
      expect(mockBooksApi.getBook).toHaveBeenCalledWith('1');
    });

    it('is disabled when id is empty', async () => {
      const { result } = renderHook(() => useBook(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockBooksApi.getBook).not.toHaveBeenCalled();
    });

    it('is disabled when id is undefined', async () => {
      const { result } = renderHook(() => useBook(undefined as any), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockBooksApi.getBook).not.toHaveBeenCalled();
    });

    it('handles error when fetching book fails', async () => {
      const error = new Error('Book not found');
      mockBooksApi.getBook.mockRejectedValue(error);

      const { result } = renderHook(() => useBook('999'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useBookReviews', () => {
    it('fetches book reviews successfully', async () => {
      mockBooksApi.getBookReviews.mockResolvedValue(mockReviewsResponse);

      const { result } = renderHook(() => useBookReviews('1', 2, 5), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockReviewsResponse);
      expect(mockBooksApi.getBookReviews).toHaveBeenCalledWith('1', 2, 5);
    });

    it('uses default pagination parameters', async () => {
      mockBooksApi.getBookReviews.mockResolvedValue(mockReviewsResponse);

      const { result } = renderHook(() => useBookReviews('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockBooksApi.getBookReviews).toHaveBeenCalledWith('1', 1, 10);
    });

    it('is disabled when bookId is empty', async () => {
      const { result } = renderHook(() => useBookReviews(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockBooksApi.getBookReviews).not.toHaveBeenCalled();
    });

    it('is disabled when bookId is undefined', async () => {
      const { result } = renderHook(() => useBookReviews(undefined as any), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockBooksApi.getBookReviews).not.toHaveBeenCalled();
    });

    it('handles error when fetching reviews fails', async () => {
      const error = new Error('Reviews not found');
      mockBooksApi.getBookReviews.mockRejectedValue(error);

      const { result } = renderHook(() => useBookReviews('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('includes correct query key parameters', async () => {
      mockBooksApi.getBookReviews.mockResolvedValue(mockReviewsResponse);

      const { result } = renderHook(() => useBookReviews('book123', 3, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockBooksApi.getBookReviews).toHaveBeenCalledWith('book123', 3, 20);
    });
  });
}); 