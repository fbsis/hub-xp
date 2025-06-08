import { BookTitle, Author, ISBN, PublishedYear, Description, AverageRating, ReviewCount } from '../value-objects';

export interface Book {
  _id: string;
  title: BookTitle;
  author: Author;
  isbn?: ISBN;
  publishedYear: PublishedYear;
  description?: Description;
  avgRating: AverageRating;
  reviewCount: ReviewCount;
  createdAt: Date;
  updatedAt: Date;
}

// Para compatibilidade com MongoDB/API (primitives)
export interface BookPrimitive {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  description?: string;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookDocument extends Omit<BookPrimitive, '_id'> {
  _id?: string;
} 