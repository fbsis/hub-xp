import { BookId, Rating, Comment, ReviewerName } from '../value-objects';

export interface Review {
  _id: string;
  bookId: BookId;
  rating: Rating;
  comment?: Comment;
  reviewerName: ReviewerName;
  createdAt: Date;
  updatedAt: Date;
}

// Para compatibilidade com MongoDB/API (primitives)
export interface ReviewPrimitive {
  _id: string;
  bookId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewDocument extends Omit<ReviewPrimitive, '_id'> {
  _id?: string;
} 