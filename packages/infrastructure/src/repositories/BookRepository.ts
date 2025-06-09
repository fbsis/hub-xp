import { Model } from 'mongoose';
import { BookMongoDocument } from '../schemas/BookSchema';
import { BookPrimitive, CreateBookDto, UpdateBookDto, GetBooksDto, BookWithStats } from '@domain/core';
import { BaseRepository } from './BaseRepository';
import { bookSeedData } from '../seeds/bookSeeds';

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

export class BookRepository 
  extends BaseRepository<BookMongoDocument, BookPrimitive, CreateBookDto, UpdateBookDto> 
  implements BookRepositoryInterface {

  constructor(bookModel: Model<BookMongoDocument>) {
    super(bookModel);
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

    // Build query using base class helpers
    const query = {
      ...this.buildTextSearchQuery(search),
      ...this.buildRegexQuery('author', author),
      ...this.buildEqualityQuery('publishedYear', publishedYear)
    };

    const sort = this.buildSort(sortBy, sortOrder);
    const result = await this.paginate(query, page, limit, sort);

    return {
      books: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit
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
    const query = {
      ...this.buildTextSearchQuery(search),
      ...this.buildRegexQuery('author', author),
      ...this.buildEqualityQuery('publishedYear', publishedYear)
    };

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
    const sort = this.buildSort(sortBy, sortOrder);
    pipeline.push({ $sort: sort });

    // Remove reviews array from final result
    pipeline.push({ $project: { reviews: 0 } });

    const result = await this.aggregatePaginate(pipeline, page, limit, this.toBookWithStats.bind(this));

    return {
      books: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit
    };
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
      { $match: { reviewCount: { $gt: 0 } } },
      { $sort: { avgRating: -1 as const, reviewCount: -1 as const } },
      { $limit: limit },
      { $project: { reviews: 0 } }
    ];

    const books = await this.model.aggregate(pipeline);
    return books.map(book => this.toBookWithStats(book));
  }

  async seedBooks(seedData: any[] = bookSeedData): Promise<{ message: string; count: number }> {
    // Clear existing books
    await this.model.deleteMany({});
    
    // Insert seed data
    const books = await this.model.insertMany(seedData);
    
    return {
      message: `Successfully seeded ${books.length} books`,
      count: books.length
    };
  }

  // Mapping methods required by BaseRepository
  protected mapCreateDto(data: CreateBookDto): any {
    return {
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      publishedYear: data.publishedYear,
      description: data.description || ''
    };
  }

  protected mapUpdateDto(data: UpdateBookDto): any {
    const updateFields: any = {};
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.author !== undefined) updateFields.author = data.author;
    if (data.isbn !== undefined) updateFields.isbn = data.isbn;
    if (data.publishedYear !== undefined) updateFields.publishedYear = data.publishedYear;
    if (data.description !== undefined) updateFields.description = data.description;
    return updateFields;
  }

  protected mapToEntity(doc: any): BookPrimitive {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      author: doc.author,
      isbn: doc.isbn,
      publishedYear: doc.publishedYear,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
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
      avgRating: bookDoc.avgRating || 0,
      reviewCount: bookDoc.reviewCount || 0,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt
    };
  }
} 