import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto, UpdateReviewDto, ReviewPrimitive } from '@domain/core';
import { ReviewRepository, BookRepository } from '@infrastructure/core';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly bookRepository: BookRepository
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewPrimitive> {
    // First check if the book exists
    const bookExists = await this.bookRepository.exists(createReviewDto.bookId);
    if (!bookExists) {
      throw new NotFoundException(`Book with ID ${createReviewDto.bookId} not found`);
    }

    return await this.reviewRepository.create(createReviewDto);
  }

  async findAll(filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    return await this.reviewRepository.findAll(filters);
  }

  async findByBook(bookId: string, filters: any): Promise<{ reviews: ReviewPrimitive[]; total: number; page: number; limit: number }> {
    return await this.reviewRepository.findByBook(bookId, filters);
  }

  async findOne(id: string): Promise<ReviewPrimitive | null> {
    return await this.reviewRepository.findById(id);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<ReviewPrimitive | null> {
    return await this.reviewRepository.update(id, updateReviewDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.reviewRepository.delete(id);
  }
} 