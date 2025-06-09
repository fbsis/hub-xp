import { BookWithStats, Book, Review, ReviewsResponse, CreateReviewDto } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const booksApi = {
  // Get top rated books
  getTopBooks: async (limit: number = 10): Promise<BookWithStats[]> => {
    return fetchApi<BookWithStats[]>(`/books/top?limit=${limit}`);
  },

  // Get a single book by ID
  getBook: async (id: string): Promise<Book> => {
    return fetchApi<Book>(`/books/${id}`);
  },

  // Get reviews for a specific book
  getBookReviews: async (bookId: string, page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
    return fetchApi<ReviewsResponse>(`/reviews/book/${bookId}?page=${page}&limit=${limit}`);
  },
};

export const reviewsApi = {
  // Create a new review
  createReview: async (review: CreateReviewDto): Promise<Review> => {
    return fetchApi<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    });
  },

  // Get all reviews with pagination
  getReviews: async (page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
    return fetchApi<ReviewsResponse>(`/reviews?page=${page}&limit=${limit}`);
  },
}; 