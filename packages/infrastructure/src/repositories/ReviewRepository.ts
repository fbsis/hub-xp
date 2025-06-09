import { Model } from 'mongoose';
import { ReviewMongoDocument } from '../schemas/ReviewSchema';
import { ReviewPrimitive, CreateReviewDto, UpdateReviewDto } from '@domain/core';
import { BaseRepository } from './BaseRepository';

export interface ReviewRepositoryInterface {
  create(reviewData: CreateReviewDto): Promise<ReviewPrimitive>;
  findById(id: string): Promise<ReviewPrimitive | null>;
  findAll(filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }>;
  findByBook(bookId: string, filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }>;
  update(id: string, updateData: UpdateReviewDto): Promise<ReviewPrimitive | null>;
  delete(id: string): Promise<boolean>;
}

export class ReviewRepository 
  extends BaseRepository<ReviewMongoDocument, ReviewPrimitive, CreateReviewDto, UpdateReviewDto> 
  implements ReviewRepositoryInterface {

  constructor(reviewModel: Model<ReviewMongoDocument>) {
    super(reviewModel);
  }

  async findAll(filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      bookId,
      rating,
      reviewerName
    } = filters;

    // Build query using base class helpers
    const query = {
      ...this.buildEqualityQuery('bookId', bookId),
      ...this.buildEqualityQuery('rating', rating ? parseInt(rating) : undefined),
      ...this.buildRegexQuery('reviewerName', reviewerName)
    };

    const sort = { createdAt: -1 };
    const result = await this.paginate(query, page, limit, sort);

    return {
      reviews: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit
    };
  }

  async findByBook(bookId: string, filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10
    } = filters;

    // Build query
    const query = { bookId };
    const sort = { createdAt: -1 };
    const result = await this.paginate(query, page, limit, sort);

    return {
      reviews: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit
    };
  }

  // Mapping methods required by BaseRepository
  protected mapCreateDto(data: CreateReviewDto): any {
    return {
      bookId: data.bookId,
      rating: data.rating,
      comment: data.comment || '',
      reviewerName: data.reviewerName
    };
  }

  protected mapUpdateDto(data: UpdateReviewDto): any {
    const updateFields: any = {};
    if (data.rating !== undefined) updateFields.rating = data.rating;
    if (data.comment !== undefined) updateFields.comment = data.comment;
    return updateFields;
  }

  protected mapToEntity(doc: any): ReviewPrimitive {
    return {
      _id: doc._id.toString(),
      bookId: doc.bookId,
      rating: doc.rating,
      comment: doc.comment,
      reviewerName: doc.reviewerName,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
} 