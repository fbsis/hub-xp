import { Model } from 'mongoose';
import { BookMongoDocument } from '../schemas/BookSchema';
import { BookPrimitive, CreateBookDto, UpdateBookDto, GetBooksDto, BookWithStats } from '@domain/core';

export interface BookRepositoryInterface {
  create(bookData: CreateBookDto): Promise<BookPrimitive>;
  findById(id: string): Promise<BookPrimitive | null>;
  findAll(filters: GetBooksDto): Promise<{ books: BookPrimitive[]; total: number; page: number; limit: number }>;
  findAllWithStats(filters: GetBooksDto): Promise<{ books: BookWithStats[]; total: number; page: number; limit: number }>;
  update(id: string, updateData: UpdateBookDto): Promise<BookPrimitive | null>;
  delete(id: string): Promise<boolean>;
  getTopRated(limit: number): Promise<BookWithStats[]>;
  exists(id: string): Promise<boolean>;
  seedBooks(seedData: any[]): Promise<{ message: string; count: number }>;
  countDocuments(): Promise<number>;
}

export class BookRepository implements BookRepositoryInterface {
  constructor(private readonly bookModel: Model<BookMongoDocument>) {}

  async create(bookData: CreateBookDto): Promise<BookPrimitive> {
    const book = new this.bookModel({
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      publishedYear: bookData.publishedYear,
      description: bookData.description || ''
    });

    const savedBook = await book.save();
    return this.toBookPrimitive(savedBook);
  }

  async findById(id: string): Promise<BookPrimitive | null> {
    const book = await this.bookModel.findById(id);
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

    // If rating filters are needed, use aggregation
    if (minRating || sortBy === 'avgRating') {
      return this.findAllWithStats(filters);
    }

    // Build query for simple cases
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

    // Build sort
    const sort: any = {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortDirection;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      this.bookModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.bookModel.countDocuments(query)
    ]);

    return {
      books: books.map(book => this.toBookPrimitive(book)),
      total,
      page,
      limit
    };
  }

  async findAllWithStats(filters: GetBooksDto): Promise<{ books: BookWithStats[]; total: number; page: number; limit: number }> {
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

    // Build initial match query
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

    // Aggregation pipeline
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'reviews',
          let: { bookId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$bookId', { $toString: '$$bookId' }]
                }
              }
            }
          ],
          as: 'reviews'
        }
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          },
          reviewCount: { $size: '$reviews' }
        }
      }
    ];

    if (minRating) {
      pipeline.push({ $match: { avgRating: { $gte: minRating } } });
    }

    // Sort
    const sort: any = {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortDirection;
    pipeline.push({ $sort: sort });

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await this.bookModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    // Remove reviews array from final result
    pipeline.push({ $project: { reviews: 0 } });

    const books = await this.bookModel.aggregate(pipeline);

    return {
      books: books.map(book => this.toBookWithStats(book)),
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

    const book = await this.bookModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return book ? this.toBookPrimitive(book) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getTopRated(limit: number = 10): Promise<BookWithStats[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'reviews',
          let: { bookId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$bookId', { $toString: '$$bookId' }]
                }
              }
            }
          ],
          as: 'reviews'
        }
      },
      {
        $addFields: {
          avgRating: {
            $cond: {
              if: { $gt: [{ $size: '$reviews' }, 0] },
              then: { $avg: '$reviews.rating' },
              else: 0
            }
          },
          reviewCount: { $size: '$reviews' }
        }
      },
      {
        $match: { reviewCount: { $gt: 0 } }
      },
      {
        $sort: { avgRating: -1 as const, reviewCount: -1 as const }
      },
      {
        $limit: limit
      },
      {
        $project: { reviews: 0 }
      }
    ];

    const books = await this.bookModel.aggregate(pipeline);
    return books.map(book => this.toBookWithStats(book));
  }

  async exists(id: string): Promise<boolean> {
    const book = await this.bookModel.findById(id).select('_id');
    return book !== null;
  }

  async seedBooks(seedData: any[]): Promise<{ message: string; count: number }> {
    // Check if books already exist
    const existingBooks = await this.countDocuments();
    
    if (existingBooks > 0) {
      return {
        message: `Database already has ${existingBooks} books. Skipping seed.`,
        count: existingBooks
      };
    }

    // Insert seed data
    const books = await this.bookModel.insertMany(seedData);
    
    return {
      message: `Successfully seeded ${books.length} books to the database.`,
      count: books.length
    };
  }

  async countDocuments(): Promise<number> {
    return await this.bookModel.countDocuments();
  }

  private toBookPrimitive(bookDoc: any): BookPrimitive {
    return {
      _id: bookDoc._id.toString(),
      title: bookDoc.title,
      author: bookDoc.author,
      isbn: bookDoc.isbn,
      publishedYear: bookDoc.publishedYear,
      description: bookDoc.description,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt
    };
  }

  private toBookWithStats(bookDoc: any): BookWithStats {
    return {
      _id: bookDoc._id.toString(),
      title: bookDoc.title,
      author: bookDoc.author,
      isbn: bookDoc.isbn,
      publishedYear: bookDoc.publishedYear,
      description: bookDoc.description,
      avgRating: Math.round((bookDoc.avgRating || 0) * 10) / 10,
      reviewCount: bookDoc.reviewCount || 0,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt
    };
  }
} 