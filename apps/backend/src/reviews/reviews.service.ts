import { Injectable, NotFoundException } from '@nestjs/common';
import { 
  ReviewPrimitive, 
  Review, 
  ReviewMapper 
} from '@domain/core';
import { ReviewRepository, BookRepository } from '@infrastructure/core';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly bookRepository: BookRepository
  ) {}

  async create(reviewData: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Promise<ReviewPrimitive> {
    // First check if the book exists
    const bookExists = await this.bookRepository.exists(reviewData.bookId.getValue());
    if (!bookExists) {
      throw new NotFoundException(`Book with ID ${reviewData.bookId.getValue()} not found`);
    }

    // Convert domain entity to DTO for repository
    const createDto = ReviewMapper.toCreateDto(reviewData);
    return await this.reviewRepository.create(createDto);
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

  async update(id: string, reviewData: Partial<Omit<Review, '_id' | 'bookId' | 'createdAt' | 'updatedAt'>>): Promise<ReviewPrimitive | null> {
    // Convert domain entity to DTO for repository
    const updateDto = ReviewMapper.toUpdateDto(reviewData);
    return await this.reviewRepository.update(id, updateDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.reviewRepository.delete(id);
  }
} 