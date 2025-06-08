import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto, UpdateBookDto, GetBooksDto, BookPrimitive, BookWithStats } from '@domain/core';
import { BookMongoDocument, ReviewMongoDocument, bookSeedData } from '@infrastructure/core';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('Book') private bookModel: Model<BookMongoDocument>,
    @InjectModel('Review') private reviewModel: Model<ReviewMongoDocument>
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookPrimitive> {
    const book = new this.bookModel({
      title: createBookDto.title,
      author: createBookDto.author,
      isbn: createBookDto.isbn,
      publishedYear: createBookDto.publishedYear,
      description: createBookDto.description || ''
    });

    const savedBook = await book.save();
    return this.toBookPrimitive(savedBook);
  }

  async seedDatabase(): Promise<{ message: string; count: number }> {
    try {
      // Check if books already exist
      const existingBooks = await this.bookModel.countDocuments();
      
      if (existingBooks > 0) {
        return {
          message: `Database already has ${existingBooks} books. Skipping seed.`,
          count: existingBooks
        };
      }

      // Insert seed data (without avgRating and reviewCount)
      const seedBooksData = bookSeedData.map(({ avgRating, reviewCount, ...book }) => book);
      const books = await this.bookModel.insertMany(seedBooksData);
      
      return {
        message: `Successfully seeded ${books.length} books to the database.`,
        count: books.length
      };

    } catch (error) {
      throw new Error(`Error seeding books: ${error.message}`);
    }
  }

  async findAll(query: GetBooksDto): Promise<{ books: BookPrimitive[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      author,
      publishedYear,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    // Build query
    const mongoQuery: any = {};

    if (search) {
      mongoQuery.$text = { $search: search };
    }

    if (author) {
      mongoQuery.author = { $regex: author, $options: 'i' };
    }

    if (publishedYear) {
      mongoQuery.publishedYear = publishedYear;
    }

    // For minRating, we need to use aggregation
    let books: any[];
    let total: number;

    if (minRating || sortBy === 'avgRating') {
      // Use aggregation pipeline when rating-related filtering/sorting is needed
      const pipeline: any[] = [
        { $match: mongoQuery },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'bookId',
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
      total = countResult[0]?.total || 0;

      // Add pagination
      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: limit });

      // Remove reviews array from final result
      pipeline.push({ $project: { reviews: 0 } });

      books = await this.bookModel.aggregate(pipeline);
    } else {
      // Simple query without rating-related operations
      const sort: any = {};
      const sortDirection = sortOrder === 'asc' ? 1 : -1;
      sort[sortBy] = sortDirection;

      const skip = (page - 1) * limit;
      
      [books, total] = await Promise.all([
        this.bookModel.find(mongoQuery)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        this.bookModel.countDocuments(mongoQuery)
      ]);
    }

    return {
      books: books.map(book => this.toBookPrimitive(book)),
      total,
      page,
      limit
    };
  }

  async findOne(id: string): Promise<BookPrimitive | null> {
    const book = await this.bookModel.findById(id);
    return book ? this.toBookPrimitive(book) : null;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookPrimitive | null> {
    const updateFields: any = {};

    if (updateBookDto.title !== undefined) updateFields.title = updateBookDto.title;
    if (updateBookDto.author !== undefined) updateFields.author = updateBookDto.author;
    if (updateBookDto.isbn !== undefined) updateFields.isbn = updateBookDto.isbn;
    if (updateBookDto.publishedYear !== undefined) updateFields.publishedYear = updateBookDto.publishedYear;
    if (updateBookDto.description !== undefined) updateFields.description = updateBookDto.description;

    const book = await this.bookModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    return book ? this.toBookPrimitive(book) : null;
  }

  async remove(id: string): Promise<boolean> {
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