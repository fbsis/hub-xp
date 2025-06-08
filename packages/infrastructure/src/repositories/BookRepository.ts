import { BookModel, BookMongoDocument } from '../schemas/BookSchema';
import { BookPrimitive, CreateBookDto, UpdateBookDto, GetBooksDto } from '@domain/core';

export interface BookRepositoryInterface {
  create(bookData: CreateBookDto): Promise<BookPrimitive>;
  findById(id: string): Promise<BookPrimitive | null>;
  findAll(filters: GetBooksDto): Promise<{ books: BookPrimitive[]; total: number; page: number; limit: number }>;
  update(id: string, updateData: UpdateBookDto): Promise<BookPrimitive | null>;
  delete(id: string): Promise<boolean>;
  getTopRated(limit: number): Promise<BookPrimitive[]>;
  updateRatingStats(bookId: string, newAvgRating: number, newReviewCount: number): Promise<void>;
}

export class BookRepository implements BookRepositoryInterface {
  async create(bookData: CreateBookDto): Promise<BookPrimitive> {
    const book = new BookModel({
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      publishedYear: bookData.publishedYear,
      description: bookData.description || '',
      avgRating: 0,
      reviewCount: 0
    });

    const savedBook = await book.save();
    return this.toBookPrimitive(savedBook);
  }

  async findById(id: string): Promise<BookPrimitive | null> {
    const book = await BookModel.findById(id);
    return book ? this.toBookPrimitive(book) : null;
  }

  async findAll(filters: GetBooksDto): Promise<{ books: BookPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      author,
      publishedYear,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    // Build query
    const query: any = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (publishedYear) {
      query.publishedYear = publishedYear;
    }

    if (minRating) {
      query.avgRating = { $gte: minRating };
    }

    // Build sort
    const sort: any = {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortDirection;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      BookModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      BookModel.countDocuments(query)
    ]);

    return {
      books: books.map(book => this.toBookPrimitive(book)),
      total,
      page,
      limit
    };
  }

  async update(id: string, updateData: UpdateBookDto): Promise<BookPrimitive | null> {
    const updateFields: any = {};

    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.author !== undefined) updateFields.author = updateData.author;
    if (updateData.isbn !== undefined) updateFields.isbn = updateData.isbn;
    if (updateData.publishedYear !== undefined) updateFields.publishedYear = updateData.publishedYear;
    if (updateData.description !== undefined) updateFields.description = updateData.description;

    const book = await BookModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return book ? this.toBookPrimitive(book) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await BookModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getTopRated(limit: number = 10): Promise<BookPrimitive[]> {
    const books = await BookModel.find({ reviewCount: { $gt: 0 } })
      .sort({ avgRating: -1, reviewCount: -1 })
      .limit(limit)
      .lean();

    return books.map(book => this.toBookPrimitive(book));
  }

  async updateRatingStats(bookId: string, newAvgRating: number, newReviewCount: number): Promise<void> {
    await BookModel.findByIdAndUpdate(bookId, {
      avgRating: Math.round(newAvgRating * 10) / 10, // Round to 1 decimal place
      reviewCount: newReviewCount
    });
  }

  private toBookPrimitive(bookDoc: any): BookPrimitive {
    return {
      _id: bookDoc._id.toString(),
      title: bookDoc.title,
      author: bookDoc.author,
      isbn: bookDoc.isbn,
      publishedYear: bookDoc.publishedYear,
      description: bookDoc.description,
      avgRating: bookDoc.avgRating,
      reviewCount: bookDoc.reviewCount,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt
    };
  }
} 