import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema, ReviewSchema } from '@infrastructure/core';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Book', schema: BookSchema },
      { name: 'Review', schema: ReviewSchema }
    ])
  ],
  exports: [MongooseModule]
})
export class InfrastructureModule {} 