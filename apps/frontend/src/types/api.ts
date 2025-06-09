export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookWithStats extends Book {
  avgRating: number;
  reviewCount: number;
}

export interface Review {
  _id: string;
  bookId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  bookId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | number;
  total: number;
  page: number;
  limit: number;
}

export interface BooksResponse extends PaginatedResponse<Book> {
  books: Book[];
}

export interface ReviewsResponse extends PaginatedResponse<Review> {
  reviews: Review[];
} 