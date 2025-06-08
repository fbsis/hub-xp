import { Schema, model, Document } from 'mongoose';
import { ReviewDocument } from '@domain/core';

export interface ReviewMongoDocument extends ReviewDocument, Document {
  _id: string;
}

const ReviewSchema = new Schema<ReviewMongoDocument>(
  {
    bookId: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          // ObjectId validation
          return /^[0-9a-fA-F]{24}$/.test(v);
        },
        message: 'Book ID must be a valid ObjectId'
      },
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: function(v: number) {
          return Number.isInteger(v);
        },
        message: 'Rating must be an integer'
      },
      index: true
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'reviews',
    versionKey: false
  }
);

// Indexes for better query performance
ReviewSchema.index({ bookId: 1, createdAt: -1 }); // Reviews for a book
ReviewSchema.index({ rating: -1, createdAt: -1 }); // Top reviews
ReviewSchema.index({ reviewerName: 1, createdAt: -1 }); // Reviews by user

// Ensure virtual fields are serialized
ReviewSchema.set('toJSON', {
  transform: function(doc: Document, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export const ReviewModel = model<ReviewMongoDocument>('Review', ReviewSchema);
export { ReviewSchema }; 