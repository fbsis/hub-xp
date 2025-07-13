import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookSchema, ReviewSchema, BookRepository, ReviewRepository, BookMongoDocument, ReviewMongoDocument } from '@infrastructure/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'Review', schema: ReviewSchema }
    ])
  ],
  providers: [
    {
      provide: BookRepository,
      useFactory: (bookModel: Model<BookMongoDocument>) => {
        return new BookRepository(bookModel);
      },
      inject: [getModelToken('Book')]
    },
    {
      provide: ReviewRepository,
      useFactory: (reviewModel: Model<ReviewMongoDocument>) => {
        return new ReviewRepository(reviewModel);
      },
      inject: [getModelToken('Review')]
    }
  ],
  exports: [MongooseModule, BookRepository, ReviewRepository]
})
export class InfrastructureModule {} 