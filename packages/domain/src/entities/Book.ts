import { BookTitle, Author, ISBN, PublishedYear, Description } from '../value-objects';

export interface Book {
  _id: string;
  title: BookTitle;
  author: Author;
  isbn?: ISBN;
  publishedYear: PublishedYear;
  description?: Description;
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
  createdAt: Date;
  updatedAt: Date;
}

// Book with calculated statistics from reviews
export interface BookWithStats extends BookPrimitive {
  avgRating: number;
  reviewCount: number;
}

export interface BookDocument extends Omit<BookPrimitive, '_id'> {
  _id?: string;
} 