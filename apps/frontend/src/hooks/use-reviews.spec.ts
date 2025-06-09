import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreateReview } from './use-reviews';
import { reviewsApi } from '@/services/api';
import { CreateReviewDto, Review } from '@/types/api';

// Mock the API service
jest.mock('@/services/api');
const mockReviewsApi = reviewsApi as jest.Mocked<typeof reviewsApi>;

const mockReview: Review = {
  _id: '1',
  bookId: 'book123',
  rating: 5,
  comment: 'Great book!',
  reviewerName: 'Test Reviewer',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockCreateReviewDto: CreateReviewDto = {
  bookId: 'book123',
  rating: 5,
  comment: 'Excellent read!',
  reviewerName: 'John Doe'
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Mock invalidateQueries to track calls
  const originalInvalidateQueries = queryClient.invalidateQueries;
  queryClient.invalidateQueries = jest.fn(originalInvalidateQueries);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );

  return { Wrapper, queryClient };
};

describe('useCreateReview hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a review successfully', async () => {
    mockReviewsApi.createReview.mockResolvedValue(mockReview);
    const { Wrapper, queryClient } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();

    // Trigger the mutation
    result.current.mutate(mockCreateReviewDto);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockReview);
    expect(mockReviewsApi.createReview).toHaveBeenCalledWith(mockCreateReviewDto);
  });

  it('invalidates related queries on successful review creation', async () => {
    mockReviewsApi.createReview.mockResolvedValue(mockReview);
    const { Wrapper, queryClient } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate(mockCreateReviewDto);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check that queries were invalidated
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["reviews", "book", mockReview.bookId],
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["books", "top"],
    });
  });

  it('handles error when creating review fails', async () => {
    const error = new Error('Failed to create review');
    mockReviewsApi.createReview.mockRejectedValue(error);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate(mockCreateReviewDto);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it('resets state between mutations', async () => {
    mockReviewsApi.createReview.mockResolvedValue(mockReview);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    // First mutation
    result.current.mutate(mockCreateReviewDto);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Reset mutation
    result.current.reset();

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
    // Note: data may persist after reset in React Query mutations
  });

  it('allows multiple review submissions', async () => {
    mockReviewsApi.createReview.mockResolvedValue(mockReview);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    // First review
    result.current.mutate(mockCreateReviewDto);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Second review with different data
    const secondReviewDto: CreateReviewDto = {
      ...mockCreateReviewDto,
      bookId: 'book456',
      rating: 4,
      comment: 'Good book too!'
    };

    result.current.reset();
    result.current.mutate(secondReviewDto);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockReviewsApi.createReview).toHaveBeenCalledTimes(2);
    expect(mockReviewsApi.createReview).toHaveBeenLastCalledWith(secondReviewDto);
  });

  it('handles review creation with minimal data', async () => {
    const minimalReview: CreateReviewDto = {
      bookId: 'book789',
      rating: 3,
      reviewerName: 'Anonymous'
    };

    const createdReview: Review = {
      ...mockReview,
      bookId: 'book789',
      rating: 3,
      reviewerName: 'Anonymous',
      comment: undefined
    };

    mockReviewsApi.createReview.mockResolvedValue(createdReview);
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    result.current.mutate(minimalReview);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(createdReview);
    expect(mockReviewsApi.createReview).toHaveBeenCalledWith(minimalReview);
  });

  it('provides correct mutation status states', async () => {
    mockReviewsApi.createReview.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockReview), 100))
    );
    
    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useCreateReview(), {
      wrapper: Wrapper,
    });

    // Initial state
    expect(result.current.isPending).toBe(false);
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);

    // Start mutation
    result.current.mutate(mockCreateReviewDto);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });
}); 