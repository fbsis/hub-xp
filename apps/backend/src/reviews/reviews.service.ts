import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto, UpdateReviewDto, ReviewPrimitive } from '@domain/core';
import { ReviewMongoDocument, BookMongoDocument } from '@infrastructure/core';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private reviewModel: Model<ReviewMongoDocument>,
    @InjectModel('Book') private bookModel: Model<BookMongoDocument>
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewPrimitive> {
    // First check if the book exists
    const book = await this.bookModel.findById(createReviewDto.bookId);
    if (!book) {
      throw new NotFoundException(`Book with ID ${createReviewDto.bookId} not found`);
    }

    const review = new this.reviewModel({
      bookId: createReviewDto.bookId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment || '',
      reviewerName: createReviewDto.reviewerName
    });

    const savedReview = await review.save();
    return this.toReviewPrimitive(savedReview);
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

  async findOne(id: string): Promise<ReviewPrimitive | null> {
    const review = await this.reviewModel.findById(id);
    return review ? this.toReviewPrimitive(review) : null;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewPrimitive | null> {
    const updateFields: any = {};

    if (updateReviewDto.rating !== undefined) updateFields.rating = updateReviewDto.rating;
    if (updateReviewDto.comment !== undefined) updateFields.comment = updateReviewDto.comment;

    const review = await this.reviewModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return review ? this.toReviewPrimitive(review) : null;
  }

  async remove(id: string): Promise<boolean> {
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