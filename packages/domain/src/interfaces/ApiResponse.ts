import { Book, Review } from '../entities';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BooksResponse extends PaginatedResponse<Book> {}

export interface ReviewsResponse extends PaginatedResponse<Review> {}

export interface TopBooksResponse {
  data: Array<Book & {
    avgRating: number;
    reviewCount: number;
  }>;
  total: number;
}

export interface BookWithReviews extends Book {
  reviews: Review[];
} 