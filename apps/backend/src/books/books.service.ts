import { Injectable } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto, GetBooksDto, BookPrimitive, BookWithStats } from '@domain/core';
import { BookRepository, bookSeedData } from '@infrastructure/core';

@Injectable()
export class BooksService {
  constructor(private readonly bookRepository: BookRepository) {}

  async create(createBookDto: CreateBookDto): Promise<BookPrimitive> {
    return await this.bookRepository.create(createBookDto);
  }

  async seedDatabase(): Promise<{ message: string; count: number }> {
    try {
      // Remove avgRating and reviewCount from seed data since they're not in the new schema
      const cleanSeedData = bookSeedData.map(({ avgRating, reviewCount, ...book }) => book);
      return await this.bookRepository.seedBooks(cleanSeedData);
    } catch (error) {
      throw new Error(`Error seeding books: ${error.message}`);
    }
  }

  async findAll(query: GetBooksDto): Promise<{ books: BookPrimitive[]; total: number; page: number; limit: number }> {
    return await this.bookRepository.findAll(query);
  }

  async findOne(id: string): Promise<BookPrimitive | null> {
    return await this.bookRepository.findById(id);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookPrimitive | null> {
    return await this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.bookRepository.delete(id);
  }

  async getTopRated(limit: number = 10): Promise<BookWithStats[]> {
    return await this.bookRepository.getTopRated(limit);
  }
} 