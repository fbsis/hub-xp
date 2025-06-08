import { Model } from 'mongoose';
import { ReviewMongoDocument } from '../schemas/ReviewSchema';
import { ReviewPrimitive, CreateReviewDto, UpdateReviewDto } from '@domain/core';

export interface ReviewRepositoryInterface {
  create(reviewData: CreateReviewDto): Promise<ReviewPrimitive>;
  findById(id: string): Promise<ReviewPrimitive | null>;
  findAll(filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }>;
  findByBook(bookId: string, filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }>;
  update(id: string, updateData: UpdateReviewDto): Promise<ReviewPrimitive | null>;
  delete(id: string): Promise<boolean>;
}

export class ReviewRepository implements ReviewRepositoryInterface {
  constructor(private readonly reviewModel: Model<ReviewMongoDocument>) {}

  async create(reviewData: CreateReviewDto): Promise<ReviewPrimitive> {
    const review = new this.reviewModel({
      bookId: reviewData.bookId,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      reviewerName: reviewData.reviewerName
    });

    const savedReview = await review.save();
    return this.toReviewPrimitive(savedReview);
  }

  async findById(id: string): Promise<ReviewPrimitive | null> {
    const review = await this.reviewModel.findById(id);
    return review ? this.toReviewPrimitive(review) : null;
  }

  async findAll(filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      bookId,
      rating,
      reviewerName
    } = filters;

    // Build query
    const query: any = {};

    if (bookId) {
      query.bookId = bookId;
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    if (reviewerName) {
      query.reviewerName = { $regex: reviewerName, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.reviewModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.reviewModel.countDocuments(query)
    ]);

    return {
      reviews: reviews.map(review => this.toReviewPrimitive(review)),
      total,
      page,
      limit
    };
  }

  async findByBook(bookId: string, filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10
    } = filters;

    // Build query
    const query = { bookId };

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.reviewModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.reviewModel.countDocuments(query)
    ]);

    return {
      reviews: reviews.map(review => this.toReviewPrimitive(review)),
      total,
      page,
      limit
    };
  }

  async update(id: string, updateData: UpdateReviewDto): Promise<ReviewPrimitive | null> {
    const updateFields: any = {};

    if (updateData.rating !== undefined) updateFields.rating = updateData.rating;
    if (updateData.comment !== undefined) updateFields.comment = updateData.comment;

    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return review ? this.toReviewPrimitive(review) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.reviewModel.findByIdAndDelete(id);
    return result !== null;
  }

  private toReviewPrimitive(reviewDoc: any): ReviewPrimitive {
    return {
      _id: reviewDoc._id.toString(),
      bookId: reviewDoc.bookId,
      rating: reviewDoc.rating,
      comment: reviewDoc.comment,
      reviewerName: reviewDoc.reviewerName,
      createdAt: reviewDoc.createdAt,
      updatedAt: reviewDoc.updatedAt
    };
  }
} 